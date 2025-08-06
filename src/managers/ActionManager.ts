import { Collection } from 'discord.js';
import { Action } from '../typings';
import { ActionType } from '../typings/enum';
import fs from 'fs';
import path from 'path';

export const BASE_ACTIONS_PATH = path.resolve(__dirname, '../actions');

export class ActionManager {
  private collection = new Collection<string, Action<ActionType>>();

  /**
   * Registers an action in the collection.
   * If an action with the same identifier already exists, it will throw an error unless `force` is set to true.
   * @param action The action to register.
   * @param force If true, it will overwrite an existing action with the same identifier.
   * @throws {Error} If an action with the same identifier already exists and `force` is false.
   * @example
   * ```typescript
   * const action: Action<ActionType.CHAT_INPUT> = {
   *   identifier: 'test',
   *   type: ActionType.CHAT_INPUT,
   *   callback: (interaction) => {
   *     console.log(interaction);
   *   },
   * };
   *
   * manager.register(action);
   * ```
   */
  public register(action: Action<ActionType>, force = false): void {
    const prefix = this.getTypePrefix(action.type);
    const identifier = prefix + '-' + action.identifier;

    if (this.collection.has(identifier) && !force) {
      throw new Error(`Action with identifier ${identifier} already exists.`);
    }

    this.collection.set(identifier, action);
  }

  /**
   * Loads an action from a file and registers it.
   * The file must export a default action that matches the `Action` type.
   * @param file The path to the action file.
   * @param force If true, it will overwrite an existing action with the same identifier.
   * @throws {Error} If the file does not exist, is not a file, or does not export a valid action.
   * @example
   * ```typescript
   * await manager.load('./path/to/action.js');
   * ```
   */
  public async load(file: string, force = false): Promise<void> {
    const fullPath = path.resolve(BASE_ACTIONS_PATH, file);
    if (!fs.existsSync(fullPath)) throw new Error(`File ${fullPath} does not exist.`);

    const stats = fs.statSync(fullPath);
    if (!stats.isFile()) throw new Error(`Path ${fullPath} is not a file.`);

    const ext = path.extname(fullPath);
    if (ext !== '.js' && ext !== '.ts')
      throw new Error(`File ${fullPath} is not a valid action file (must end with .js or .ts).`);

    const data = await import(fullPath);
    if (!data || !data.default) throw new Error(`File ${fullPath} does not export a default action.`);

    const action: Action<ActionType> = data.default;
    if (typeof action.enabled === 'boolean' && !action.enabled) throw new Error(`Action in ${fullPath} is disabled.`);

    this.register(action, force);
  }

  /**
   * Loads all actions from a folder and registers them.
   * If `recursive` is true, it will load actions from subfolders as well.
   * @param folder The folder to load actions from.
   * @param recursive If true, it will load actions from subfolders.
   * @param force If true, it will overwrite existing actions with the same identifier.
   * @returns An array of file paths that failed to load.
   * @throws {Error} If the folder does not exist or is not a directory.
   */
  public async loadFolder(
    folder: string,
    recursive = true,
    force = false
  ): Promise<{ message: string; path: string }[]> {
    const fullPath = path.resolve(BASE_ACTIONS_PATH, folder);
    if (!fs.existsSync(fullPath)) throw new Error(`Folder ${fullPath} does not exist.`);

    const stats = fs.statSync(fullPath);
    if (!stats.isDirectory()) throw new Error(`Path ${fullPath} is not a directory.`);

    const files = fs.readdirSync(fullPath);

    const failedFiles: { message: string; path: string }[] = [];

    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const fileStats = fs.statSync(filePath);

      if (fileStats.isDirectory() && recursive) {
        await this.loadFolder(filePath, recursive, force);
      } else if (fileStats.isFile()) {
        try {
          await this.load(filePath, force);
        } catch (error) {
          failedFiles.push({ message: error instanceof Error ? error.message : String(error), path: filePath });
          console.error(`Failed to load action from ${filePath}:`, error);
        }
      }
    }

    return failedFiles;
  }

  /**
   * Removes an action from the collection by its type and identifier.
   * If the action does not exist, it will do nothing.
   * @param type The type of the action to remove.
   * @param identifier The identifier of the action to remove.
   */
  public remove(type: ActionType, identifier: string): void {
    const prefix = this.getTypePrefix(type);
    this.collection.delete(prefix + '-' + identifier);
  }

  /**
   * Gets an action from the collection by its type and identifier.
   * If the action does not exist, it will return null.
   * @param type The type of the action to get.
   * @param identifier The identifier of the action to get.
   * @example
   * ```typescript
   * const action = manager.get(ActionType.CHAT_INPUT, 'test');
   * ```
   * @returns
   */
  public get(type: ActionType, identifier: string): Action<ActionType> | null {
    const prefix = this.getTypePrefix(type);
    return this.collection.get(prefix + '-' + identifier) || null;
  }

  /**
   * Checks if an action exists in the collection by its type and identifier.
   * @param type The type of the action to check.
   * @param identifier The identifier of the action to check.
   * @example
   * ```typescript
   * const exists = manager.has(ActionType.CHAT_INPUT, 'test');
   * ```
   * @returns
   */
  public has(type: ActionType, identifier: string): boolean {
    const prefix = this.getTypePrefix(type);
    return this.collection.has(prefix + '-' + identifier);
  }

  /**
   * Updates an existing action in the collection.
   * If the action does not exist, it will throw an error.
   * @param type The type of the action to update.
   * @param identifier The identifier of the action to update.
   * @param action The new action to set.
   * @throws {Error} If the action with the specified identifier does not exist.
   */
  public update(type: ActionType, identifier: string, action: Action<ActionType>): void {
    const prefix = this.getTypePrefix(type);
    const key = prefix + '-' + identifier;

    if (!this.collection.has(key)) {
      throw new Error(`Action with identifier ${key} does not exist.`);
    }

    this.collection.set(key, action);
  }

  /**
   * Get all actions in the collection.
   * This returns a clone of the collection to prevent external modifications.
   * @returns
   */
  public get all(): Collection<string, Action<ActionType>> {
    return this.collection.clone();
  }

  /**
   * Gets the prefix for the action type.
   * This is used to create a unique identifier for the action.
   * @param type The type of the action.s
   * @returns
   */
  private getTypePrefix(type: ActionType): string {
    if (type === ActionType.ChatInput) return 'chat-input';
    if (type === ActionType.MessageContext) return 'message-context';
    if (type === ActionType.UserContext) return 'user-context';
    if (type === ActionType.StringSelectMenu) return 'string-select-menu';
    if (type === ActionType.UserSelectMenu) return 'user-select-menu';
    if (type === ActionType.RoleSelectMenu) return 'role-select-menu';
    if (type === ActionType.MentionableSelectMenu) return 'mentionable-select-menu';
    if (type === ActionType.ChannelSelectMenu) return 'channel-select-menu';
    if (type === ActionType.SelectMenu) return 'select-menu';
    if (type === ActionType.Button) return 'button';
    if (type === ActionType.Autocomplete) return 'autocomplete';
    if (type === ActionType.ModalSubmit) return 'modal-submit';
    return 'unknown';
  }
}

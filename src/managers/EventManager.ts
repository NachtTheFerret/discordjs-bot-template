import { Client, Collection, Events as EventType } from 'discord.js';
import { Event } from '../typings';
import fs from 'fs';
import path from 'path';
import { Logger } from '../services/Logger';
import { CustomErrorType } from '../typings/enum';

export const BASE_EVENTS_PATH = path.resolve(__dirname, '../events');

export class EventManager {
  private collection = new Collection<string, Event<EventType>>();

  /**
   * Registers an event in the collection.
   * If an event with the same identifier already exists, it will throw an error unless `force` is set to true.
   */
  public register(event: Event<EventType>, force = false): void {
    const logger = new Logger({ event, force });
    if (this.collection.has(event.identifier) && !force)
      throw logger.error(
        CustomErrorType.EVENT_IDENTIFIER_ALREADY_EXISTS,
        `Event with identifier ${event.identifier} already exists.`
      );

    this.collection.set(event.identifier, event);
  }

  /**
   * Listens to an event for a specific client.
   * It will throw an error if the event does not exist, is disabled, or does
   * @param client Client to listen to the event on.
   * @param identifier Identifier of the event to listen to.
   * @throws {Error} If the event does not exist, is disabled, or does not have a valid callback function.
   */
  public listen(client: Client, identifier: string): void {
    const logger = new Logger({ client, identifier });
    const event = this.collection.get(identifier);

    if (!event)
      throw logger.error(CustomErrorType.EVENT_NOT_FOUND, `Event with identifier ${identifier} does not exist.`);
    if (event.disabled) throw logger.error(CustomErrorType.EVENT_DISABLED, `Event ${identifier} is disabled.`);
    if (!event.callback)
      throw logger.error(
        CustomErrorType.EVENT_WITHOUT_CALLBACK,
        `Event ${identifier} does not have a valid callback function.`
      );

    client.on(event.type as any, event.callback);
  }

  /**
   * Mutes an event for a specific client.
   * It will throw an error if the event does not exist or does not have a valid callback function.
   * @param client Client to mute the event on.
   * @param identifier Identifier of the event to mute.
   */
  public mute(client: Client, identifier: string): void {
    const logger = new Logger({ client, identifier });
    const event = this.collection.get(identifier);

    if (!event)
      throw logger.error(CustomErrorType.EVENT_NOT_FOUND, `Event with identifier ${identifier} does not exist.`);
    if (!event.callback)
      throw logger.error(
        CustomErrorType.EVENT_WITHOUT_CALLBACK,
        `Event ${identifier} does not have a valid callback function.`
      );

    client.off(event.type as any, event.callback);
  }

  /**
   * Loads an event from a file and registers it.
   * The file must export a default event that matches the `Event` type.
   */
  public async load(file: string, force = false): Promise<void> {
    const logger = new Logger({ file, force });

    const fullPath = path.resolve(BASE_EVENTS_PATH, file);
    if (!fs.existsSync(fullPath))
      throw logger.error(CustomErrorType.FILE_NOT_FOUND, `File ${fullPath} does not exist.`);

    const stats = fs.statSync(fullPath);
    if (!stats.isFile()) throw logger.error(CustomErrorType.INVALID_FILE_TYPE, `Path ${fullPath} is not a file.`);

    const ext = path.extname(fullPath);
    if (ext !== '.js' && ext !== '.ts')
      throw logger.error(
        CustomErrorType.INVALID_FILE_TYPE,
        `File ${fullPath} is not a valid JavaScript or TypeScript file.`
      );

    const data = await import(fullPath);
    if (!data || !data.default)
      throw logger.error(CustomErrorType.NO_DEFAULT_EXPORT, `File ${fullPath} does not export a default event.`);

    const event: Event<EventType> = data.default;
    if (event.disabled) throw logger.error(CustomErrorType.EVENT_DISABLED, `Event ${event.identifier} is disabled.`);

    this.register(event, force);
  }

  /**
   * Loads all events from a folder and registers them.
   * If `recursive` is true, it will load events from subfolders as well.
   */
  public async loadFolder(folder: string, recursive = true, force = false): Promise<{ error: Error; path: string }[]> {
    const logger = new Logger({ folder, recursive, force });

    const fullPath = path.resolve(BASE_EVENTS_PATH, folder);
    if (!fs.existsSync(fullPath))
      throw logger.error(CustomErrorType.FOLDER_NOT_FOUND, `Folder ${fullPath} does not exist.`);

    const stats = fs.statSync(fullPath);
    if (!stats.isDirectory())
      throw logger.error(CustomErrorType.INVALID_FOLDER_TYPE, `Path ${fullPath} is not a directory.`);

    const files = fs.readdirSync(fullPath);

    const failedFiles: { error: Error; path: string }[] = [];

    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const fileStats = fs.statSync(filePath);

      if (fileStats.isDirectory() && recursive) {
        const subFailedFiles = await this.loadFolder(filePath, recursive, force);
        failedFiles.push(...subFailedFiles);
      } else if (fileStats.isFile()) {
        await this.load(filePath, force).catch((error) => {
          failedFiles.push({ error, path: filePath });
        });
      }
    }

    return failedFiles;
  }

  /**
   * Removes an event from the collection by its identifier.
   */
  public remove(identifier: string): void {
    this.collection.delete(identifier);
  }

  /**
   * Gets an event from the collection by its identifier.
   */
  public get(identifier: string): Event<EventType> | null {
    return this.collection.get(identifier) || null;
  }

  /**
   * Checks if an event exists in the collection by its identifier.
   */
  public has(identifier: string): boolean {
    return this.collection.has(identifier);
  }

  /**
   * Updates an existing event in the collection.
   * If the event does not exist, it will throw an error.
   */
  public update(identifier: string, event: Event<EventType>): void {
    const logger = new Logger({ identifier, event });

    if (!this.collection.has(identifier))
      throw logger.error(CustomErrorType.EVENT_NOT_FOUND, `Event with identifier ${identifier} does not exist.`);

    this.collection.set(identifier, event);
  }

  /**
   * Get all events in the collection.
   * This returns a clone of the collection to prevent external modifications.
   */
  public get all(): Collection<string, Event<EventType>> {
    return this.collection.clone();
  }
}

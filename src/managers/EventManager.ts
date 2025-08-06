import { Collection } from 'discord.js';
import { Event } from '../typings';
import { EventType } from '../typings/enum';
import fs from 'fs';
import path from 'path';

export const BASE_EVENTS_PATH = path.resolve(__dirname, '../events');

export class EventManager {
  private collection = new Collection<string, Event<EventType>>();

  /**
   * Registers an event in the collection.
   * If an event with the same identifier already exists, it will throw an error unless `force` is set to true.
   */
  public register(event: Event<EventType>, force = false): void {
    if (this.collection.has(event.identifier) && !force) {
      throw new Error(`Event with identifier ${event.identifier} already exists.`);
    }
    this.collection.set(event.identifier, event);
  }

  /**
   * Loads an event from a file and registers it.
   * The file must export a default event that matches the `Event` type.
   */
  public async load(file: string, force = false): Promise<void> {
    const fullPath = path.resolve(BASE_EVENTS_PATH, file);
    if (!fs.existsSync(fullPath)) throw new Error(`File ${fullPath} does not exist.`);

    const stats = fs.statSync(fullPath);
    if (!stats.isFile()) throw new Error(`Path ${fullPath} is not a file.`);

    const ext = path.extname(fullPath);
    if (ext !== '.js' && ext !== '.ts')
      throw new Error(`File ${fullPath} is not a valid event file (must end with .js or .ts).`);

    const data = await import(fullPath);
    if (!data || !data.default) throw new Error(`File ${fullPath} does not export a default event.`);

    const event: Event<EventType> = data.default;
    if (typeof event.enabled === 'boolean' && !event.enabled) throw new Error(`Event in ${fullPath} is disabled.`);

    this.register(event, force);
  }

  /**
   * Loads all events from a folder and registers them.
   * If `recursive` is true, it will load events from subfolders as well.
   */
  public async loadFolder(
    folder: string,
    recursive = true,
    force = false
  ): Promise<{ message: string; path: string }[]> {
    const fullPath = path.resolve(BASE_EVENTS_PATH, folder);
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
          console.error(`Failed to load event from ${filePath}:`, error);
        }
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
    if (!this.collection.has(identifier)) {
      throw new Error(`Event with identifier ${identifier} does not exist.`);
    }
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

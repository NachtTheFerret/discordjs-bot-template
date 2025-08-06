import { manager as shardingManager } from './sharding';
import { ActionManager } from './managers/ActionManager';
import { EventManager } from './managers/EventManager';
import path from 'path';

const actions = new ActionManager();
const ACTION_PATH = path.resolve(__dirname, './actions');

const events = new EventManager();
const EVENT_PATH = path.resolve(__dirname, './events');

const start = async () => {
  try {
    const failedActionFiles = await actions.loadFolder(ACTION_PATH, true, false);

    // # Start to load actions
    console.log('');
    console.log(`\x1b[34m🔍 Attempting to load actions from ${ACTION_PATH}...\x1b[0m`);

    failedActionFiles.forEach((failedFile) => {
      console.error(`❌ \x1b[31mFailed to load ${failedFile.path}: ${failedFile.message}\x1b[0m`);
    });

    if (actions.all.size) {
      console.log(`\x1b[32m✅ Successfully loaded ${actions.all.size} actions.\x1b[0m`);
    } else {
      console.warn(`\x1b[33m⚠️  No actions were loaded.\x1b[0m`);
    }

    // # Start to load events
    console.log('');
    console.log(`\x1b[34m🔍 Attempting to load events from ${EVENT_PATH}...\x1b[0m`);
    const failedEventFiles = await events.loadFolder(EVENT_PATH, true, false);

    failedEventFiles.forEach((failedFile) => {
      console.error(`❌ \x1b[31mFailed to load ${failedFile.path}: ${failedFile.message}\x1b[0m`);
    });

    if (events.all.size) {
      console.log(`\x1b[32m✅ Successfully loaded ${events.all.size} events.\x1b[0m`);
    } else {
      console.warn(`\x1b[33m⚠️  No events were loaded.\x1b[0m`);
    }

    // # Start the sharding manager
    console.log('');
    console.log(`\x1b[34m🔄 Starting sharding manager...\x1b[0m`);

    await shardingManager.spawn();

    console.log('');
    console.log(
      `\x1b[32m🟢 Bot is ready and running with ${shardingManager.totalShards} shard${
        shardingManager.totalShards != 'auto' && shardingManager.totalShards > 1 ? 's' : ''
      }.\x1b[0m`
    );
  } catch (error) {
    console.error(
      `\x1b[31m❌ An error occurred while starting the bot: ${
        error instanceof Error ? error.message : String(error)
      }\x1b[0m`
    );
    process.exit(1); // Exit the process with an error code
  }
};

start();

import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import { ActionManager } from './managers/ActionManager';
import { EventManager } from './managers/EventManager';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

export const actions = new ActionManager();
const ACTION_PATH = path.resolve(__dirname, './actions');

export const events = new EventManager();
const EVENT_PATH = path.resolve(__dirname, './events');

export const client = new Client({
  intents: [GatewayIntentBits.Guilds],
}) as Client<true>;

const start = async () => {
  try {
    const failedActionFiles = await actions.loadFolder(ACTION_PATH, true, false);

    // # Start to load actions
    console.log('');
    console.log(`\x1b[34m🔍 Attempting to load actions from ${ACTION_PATH}...\x1b[0m`);

    failedActionFiles.forEach((failedFile) => {
      console.error(`❌ \x1b[31mFailed to load ${failedFile.path}: ${failedFile.error.message}\x1b[0m`);
    });

    if (actions.all.size) {
      console.log(
        `\x1b[33m🌟 Successfully loaded ${actions.all.size} action${actions.all.size > 1 ? 's' : ''}.\x1b[0m`
      );
    } else {
      console.warn(`\x1b[33m⚠️  No actions were loaded.\x1b[0m`);
    }

    // # Start to load events
    console.log('');
    console.log(`\x1b[34m🔍 Attempting to load events from ${EVENT_PATH}...\x1b[0m`);
    const failedEventFiles = await events.loadFolder(EVENT_PATH, true, false);

    failedEventFiles.forEach((failedFile) => {
      console.error(`❌ \x1b[31mFailed to load ${failedFile.path}: ${failedFile.error.message}\x1b[0m`);
    });

    if (events.all.size) {
      console.log(`\x1b[33m🌟 Successfully loaded ${events.all.size} event${events.all.size > 1 ? 's' : ''}.\x1b[0m`);
    } else {
      console.warn(`\x1b[33m⚠️  No events were loaded.\x1b[0m`);
    }

    console.log('');
    console.log('\x1b[34m🔄 Initializing Discord bot client...\x1b[0m');

    let count = 0;
    events.all.forEach((event) => {
      try {
        if (!event.disabled && !!event.callback) {
          events.listen(client, event.identifier);
          count++;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`❌ Failed to listen to event ${event.identifier}: ${message}`);
      }
    });

    if (count === 0) {
      console.warn(`\x1b[33m⚠️  No events were successfully listened to.\x1b[0m`);
    } else {
      console.log(`\x1b[33m🔔 Successfully listened to ${count} event${count > 1 ? 's' : ''}.\x1b[0m`);
    }

    await client.login(process.env.DISCORD_BOT_TOKEN);

    console.log('');
    console.log(`\x1b[32m✅  Bot is connected to Discord with ${client.user.displayName}\x1b[0m`);
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

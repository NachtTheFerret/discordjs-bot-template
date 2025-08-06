import { ShardingManager } from 'discord.js';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const EXT = path.extname(__filename);
const PATH = path.resolve(__dirname, `./bot${EXT}`);

export const manager = new ShardingManager(PATH, {
  token: TOKEN,
  totalShards: 'auto', // Automatically determine the number of shards
  respawn: true, // Automatically respawn shards if they crash
  shardArgs: [
    '--color', // Enable color output in console
    '--shardId', // Pass the shard ID to the client
    '--shardCount', // Pass the total number of shards to the client
  ],
  execArgv: ['--trace-warnings'], // Enable trace warnings for better debugging
});

manager.on('shardCreate', (shard) => {
  shard.on('spawn', () => {
    // Log when the shard has successfully spawned
    console.log(`\x1b[32m✅ Shard ${shard.id} has spawned.\x1b[0m`);
  });

  shard.on('error', (error) => {
    // Log any errors that occur in the shard
    console.error(`\x1b[31m❌ Shard ${shard.id} encountered an error: ${error}\x1b[0m`);
  });

  shard.on('disconnect', () => {
    // Log when the shard disconnects
    console.log(`\x1b[33mShard ${shard.id} disconnected.\x1b[0m`);
  });

  shard.on('reconnecting', () => {
    // Log when the shard is attempting to reconnect
    console.log(`\x1b[33mShard ${shard.id} is reconnecting...\x1b[0m`);
  });

  shard.on('death', () => {
    // Log when the shard has died
    console.log(`\x1b[31m💀 Shard ${shard.id} has died.\x1b[0m`);
  });
});

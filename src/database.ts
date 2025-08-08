import { Sequelize } from 'sequelize-typescript';
import path from 'path';

export const database = new Sequelize({
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  models: [path.join(__dirname, 'models')], // Automatically load models from the 'models' directorys
  logging: false, // Set to true to enable SQL query logging

  define: {
    timestamps: true, // Enable timestamps for all models
    underscored: true, // Use snake_case for column names
  },
});

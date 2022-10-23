import * as mongoDB from 'mongodb';
import debug from 'debug';
import dotenv from 'dotenv';

const log: debug.IDebugger = debug('app:database-dao');

export abstract class DatabaseService {
  private connectionParameters = {
    uri: process.env.DB_URI || 'mongodb://localhost:27017',
    dbName: process.env.DB_NAME || '',
  };

  client = new mongoDB.MongoClient(this.connectionParameters.uri);

  constructor() {
    dotenv.config();
    this.databaseConnect;
  }

  async databaseConnect() {
    log(
      `Trying to establish database connection at ${this.connectionParameters.uri}`
    );

    await this.client.connect();
    await this.client.db('admin').command({ ping: 1 });

    log(`Connected successfully to server at ${this.connectionParameters.uri}`);
  }

  getClient(): mongoDB.MongoClient {
    return this.client;
  }

  getDatabase(): mongoDB.Db {
    return this.client.db(this.connectionParameters.dbName);
  }

  abstract getCollection(): mongoDB.Collection;
  abstract applySchemaValidation(): any;
}

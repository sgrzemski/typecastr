import * as mongoDB from 'mongodb';
import { DatabaseService } from '../../common/services/database.service';

class PodcastsDatabaseService extends DatabaseService {
  private collectionParameters = {
    collectionName: process.env.DB_COLLECTION || 'podcasts',
  };

  database = this.getDatabase();

  constructor() {
    super();
    this.applySchemaValidation();
  }

  async applySchemaValidation() {
    const jsonSchema = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['title', 'author'],
        additionalProperties: false,
        properties: {
          _id: {},
          title: {
            bsonType: 'string',
            description: "'title' is required and is a string",
          },
          author: {
            bsonType: 'string',
            description: "'author' is required and is a string",
          },
          filename: {
            bsonType: 'string',
            description: "'filename' is optional and is a string",
          },
        },
      },
    };

    await this.database
      .command({
        collMod: this.collectionParameters.collectionName,
        validator: jsonSchema,
      })
      .catch(async (error: mongoDB.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
          await this.database.createCollection(
            this.collectionParameters.collectionName,
            {
              validator: jsonSchema,
            }
          );
        }
      });
  }

  getCollection(): mongoDB.Collection<mongoDB.Document> {
    return this.database.collection(this.collectionParameters.collectionName);
  }
}

export default new PodcastsDatabaseService();

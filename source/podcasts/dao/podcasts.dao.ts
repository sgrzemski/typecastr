import podcastsDatabaseService from '../services/podcasts.database.service';
import { CreatePodcastDto } from '../dto/create.podcast.dto';
import { PatchPodcastDto } from '../dto/patch.podcast.dto';
import { PutPodcastDto } from '../dto/put.podcast.dto';
import dotenv from 'dotenv';
import shortid from 'shortid';
import debug from 'debug';
import { Collection, Document, ObjectId } from 'mongodb';

const log: debug.IDebugger = debug('app:podcasts-dao');

class PodcastsDao {
  collection = podcastsDatabaseService.getCollection();

  constructor() {
    log('Created new instance of PodcastsDao');
  }

  async addPodcast(podcast: CreatePodcastDto) {
    let podcastId;
    const result = await this.collection.insertOne(podcast).then((result) => {
      podcastId = result.insertedId;
    });
    return podcastId;
  }

  async getPodcasts() {
    const query = await this.collection.find({}).toArray();
    return query;
  }

  async getPodcastById(podcastId: ObjectId) {
    const query = { _id: podcastId };
    const result = await this.collection.findOne(query);
    return result;
  }

  async putPodcastById(podcastId: ObjectId, podcast: PutPodcastDto) {
    const query = { _id: podcast._id };
    const result = await this.collection.updateOne(query, { $set: podcast });
    return `${podcast._id} replaced`;
  }

  async patchPodcastById(podcastId: ObjectId, podcast: PatchPodcastDto) {
    const query = { _id: new ObjectId(podcastId) };
    const currentPodcast = await this.collection.findOne(query);
    const allowedPatchFields = ['title', 'author', 'filename'];
    for (const field of allowedPatchFields) {
      if (field in podcast) {
        // @ts-ignore
        currentPodcast[field] = podcast[field];
      }
    }
    await this.collection.updateOne(query, { $set: currentPodcast });
    return `${podcast._id} patched`;
  }

  async removePodcastById(podcastId: ObjectId) {
    const query = { _id: new ObjectId(podcastId) };
    const result = await this.collection.deleteOne(query);
    return `${podcastId} removed`;
  }
}

export default new PodcastsDao();

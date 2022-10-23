import PodcastsDao from '../dao/podcasts.dao';
import { CreatePodcastDto } from '../dto/create.podcast.dto';
import { PutPodcastDto } from '../dto/put.podcast.dto';
import { PatchPodcastDto } from '../dto/patch.podcast.dto';
import { ObjectId } from 'mongodb';

class PodcastsService {
  async create(resource: CreatePodcastDto) {
    return PodcastsDao.addPodcast(resource);
  }

  async deleteById(id: ObjectId) {
    return PodcastsDao.removePodcastById(id);
  }

  async list() {
    return PodcastsDao.getPodcasts();
  }

  async patchById(id: ObjectId, resource: PatchPodcastDto) {
    return PodcastsDao.patchPodcastById(id, resource);
  }

  async putById(id: ObjectId, resource: PutPodcastDto) {
    return PodcastsDao.putPodcastById(id, resource);
  }

  async readById(id: ObjectId) {
    return PodcastsDao.getPodcastById(id);
  }
}

export default new PodcastsService();

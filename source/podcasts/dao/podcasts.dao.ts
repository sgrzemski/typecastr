import { CreatePodcastDto } from '../dto/create.podcast.dto';
import { PatchPodcastDto } from '../dto/patch.podcast.dto';
import { PutPodcastDto } from '../dto/put.podcast.dto';
import shortid from 'shortid';
import debug from 'debug';

const log: debug.IDebugger = debug('app:in-memory-dao');

class PodcastsDao {
  podcasts: Array<CreatePodcastDto> = [];

  constructor() {
    log('Created new instance of PodcastsDao');
  }

  async addPodcast(podcast: CreatePodcastDto) {
    podcast.id = shortid.generate();
    this.podcasts.push(podcast);
    return podcast.id;
  }

  async getPodcasts() {
    return this.podcasts;
  }

  async getPodcastById(podcastId: string) {
    return this.podcasts.find(({ id }) => id === podcastId);
  }

  async putPodcastById(podcastId: string, podcast: PutPodcastDto) {
    const objIndex = this.podcasts.findIndex(
      (obj: { id: string }) => obj.id === podcastId
    );
    this.podcasts.splice(objIndex, 1, podcast);
    return `${podcast.id} updated via put`;
  }

  async patchPodcastById(podcastId: string, podcast: PatchPodcastDto) {
    const objIndex = this.podcasts.findIndex(
      (obj: { id: string }) => obj.id === podcastId
    );
    const currentPodcast = this.podcasts[objIndex];
    const allowedPatchFields = ['title', 'author', 'filename'];
    for (const field of allowedPatchFields) {
      if (field in podcast) {
        // @ts-ignore
        currentPodcast[field] = podcast[field];
      }
    }
    this.podcasts.splice(objIndex, 1, currentPodcast);
    return `${podcast.id} patched`;
  }

  async removePodcastById(podcastId: string) {
    const objIndex = this.podcasts.findIndex(
      (obj: { id: string }) => obj.id === podcastId
    );
    this.podcasts.splice(objIndex, 1);
    return `${podcastId} removed`;
  }
}

export default new PodcastsDao();

import express from 'express';
import podcastsService from '../services/podcasts.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:podcasts-controller');
class PodcastsController {
  async listPodcasts(_: express.Request, res: express.Response) {
    const podcasts = await podcastsService.list();
    res.status(200).send(podcasts);
  }

  async getPodcastById(req: express.Request, res: express.Response) {
    const podcast = await podcastsService.readById(req.body._id);
    res.status(200).send(podcast);
  }

  async createPodcast(req: express.Request, res: express.Response) {
    const podcastId = await podcastsService.create(req.body);
    res.status(201).send({ _id: podcastId });
  }

  async patch(req: express.Request, res: express.Response) {
    log(await podcastsService.patchById(req.body._id, req.body));
    res.status(204).send();
  }

  async put(req: express.Request, res: express.Response) {
    log(await podcastsService.putById(req.body._id, req.body));
    res.status(204).send();
  }

  async removePodcast(req: express.Request, res: express.Response) {
    log(await podcastsService.deleteById(req.body._id));
    res.status(204).send();
  }

  async getHealth(_: express.Request, res: express.Response) {
    res.status(200).send('OK');
  }
}

export default new PodcastsController();

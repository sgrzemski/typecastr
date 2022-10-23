import express from 'express';
import podcastService from '../services/podcasts.service';
import debug from 'debug';
import { ObjectId } from 'mongodb';

const log: debug.IDebugger = debug('app:podcasts-controller');
class PodcastsMiddleware {
  async validateRequiredPodcastBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.title && req.body.author) {
      next();
    } else {
      res.status(400).send({
        error: 'Missing required fields: title and/or author',
      });
    }
  }

  async validatePodcastExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const podcast = await podcastService.readById(new ObjectId(req.params.podcastId));
    if (podcast) {
      next();
    } else {
      res.status(404).send({
        error: `Podcast ${req.params.podcastId} not found`,
      });
    }
  }

  async extractPodcastId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body._id = new ObjectId(req.params.podcastId);
    next();
  }
}

export default new PodcastsMiddleware();

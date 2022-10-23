import { CommonRoutesConfig } from '../common/common.routes.config';
import PodcastsController from './controllers/podcasts.controller';
import PodcastsMiddleware from './middleware/podcasts.middleware';
import express from 'express';

export class PodcastsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'PodcastsRoutes');
  }

  configureRoutes() {
    this.app
      .route(PODCAST_PATH)
      .get(PodcastsController.listPodcasts)
      .post(
        PodcastsMiddleware.validateRequiredPodcastBodyFields,
        PodcastsController.createPodcast
      );

    this.app.param('podcastId', PodcastsMiddleware.extractPodcastId);
    this.app
      .route(PODCAST_BY_ID_PATH)
      .all(PodcastsMiddleware.validatePodcastExists)
      .get(PodcastsController.getPodcastById)
      .delete(PodcastsController.removePodcast);

    this.app.put(PODCAST_BY_ID_PATH, [
      PodcastsMiddleware.validateRequiredPodcastBodyFields,
      PodcastsController.put,
    ]);

    this.app.patch(PODCAST_BY_ID_PATH, [PodcastsController.patch]);

    this.app.route(HEALTHCHECK_PATH).get(PodcastsController.getHealth);

    return this.app;
  }
}

const HEALTHCHECK_PATH = '/health';
const PODCAST_PATH = '/podcasts/';
const PODCAST_BY_ID_PATH = '/podcasts/:podcastId';

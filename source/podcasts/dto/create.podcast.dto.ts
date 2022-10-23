import { ObjectId } from 'mongodb';

export interface CreatePodcastDto {
  title: string;
  author: string;
  filename?: string;
  _id?: ObjectId;
}

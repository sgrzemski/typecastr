import { ObjectId } from 'mongodb';

export interface PutPodcastDto {
  title: string;
  author: string;
  filename?: string;
  _id?: ObjectId;
}

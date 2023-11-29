export interface ISong {
  songId: string;
  category: string;
  value: string;
  wasInDaily: boolean;
  artist?: string;
  key: string;
}

export interface ILastFmSong {
  name: string;
  artist: string;
  url: string;
  image: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '#text': string;
    size: string;
  }[];
  mbid: string;
}

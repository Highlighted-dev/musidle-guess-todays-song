export interface IWiki {
  _id: string;
  name: string;
  description: string;
  notableAlbums: {
    name: string;
    artist: {
      name: string;
      url: string;
    };
    image: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '#text': string;
      size: string;
    }[];
  }[];
  popularSongs: {
    name: string;
    artist: {
      name: string;
      url: string;
    };
    youtubeUrl: string;
  }[];
  relatedArtists: {
    name: string;
    url: string;
  }[];
  tags: string[];
}

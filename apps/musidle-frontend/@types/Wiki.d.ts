export interface IWiki {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  coverImage: {
    url: string;
    copyright: {
      creatorUrl: string;
      creatorName: string;
      licenseName: string;
      licenseUrl: string;
      serviceName: string;
    };
  };

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

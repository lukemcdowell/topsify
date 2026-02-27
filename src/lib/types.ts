export type TopItemType = "tracks" | "artists";
export type TimeRangeType = "long_term" | "medium_term" | "short_term";

export interface AccessTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface TopTrackType {
  name: string;
  album: {
    images: { url: string; height: number; width: number }[];
    name: string;
    external_urls: {
      spotify: string;
    };
    artists: {
      name: string;
      href: string;
      id: string;
      uri: string;
    }[];
  };
  artists: {
    name: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    id: string;
    uri: string;
  }[];
  uri: string;
  href: string;
  external_urls: {
    spotify: string;
  };
}

export type TopArtistType = {
  external_urls: {
    spotify: string;
  };
  genres: string[];
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  uri: string;
};

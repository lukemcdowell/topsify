export type TopItemsType = 'tracks' | 'artists';
export type TimeRangeType = 'long_term' | 'medium_term' | 'short_term';

// TODO: add other attributes that will be used
// TODO: different type for Track v Artist?
export interface SpotifyItem {
  id: string;
  name: string;
}

export interface AccessTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

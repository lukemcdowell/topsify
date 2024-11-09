import SpotifyWebApi from 'spotify-web-api-node';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SECRET_KEY = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

export let spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: SECRET_KEY,
  redirectUri: REDIRECT_URI,
});

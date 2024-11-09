import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
var crypto = require('crypto');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomString(length: number) {
  return crypto.randomBytes(60).toString('hex').slice(0, length);
}

// TODO: better types
export function getTop(type: string, time_range: string, access_token: string) {
  return axios
    .get(`https://api.spotify.com/v1/me/top/${type}`, {
      params: {
        time_range: time_range,
        limit: 50,
      },
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    })
    .then((response) => {
      return response.data.items;
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });
}

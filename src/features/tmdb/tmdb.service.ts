import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

@Injectable()
export class TmdbService {
  private client: AxiosInstance;
  private logger = new Logger(TmdbService.name);

  constructor() {
    this.client = axios.create({
      baseURL: process.env.TMDB_BASE_URL,
      params: { api_key: process.env.TMDB_API_KEY },
      timeout: 10_000,
    });

    axiosRetry(this.client, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
  }

  getGenres() {
    return this.client.get('/genre/movie/list').then((r) => r.data.genres);
  }

  getPopular(page: number) {
    return this.client.get('/movie/popular', { params: { page } }).then((r) => r.data);
  }
    getMovieDetails(movieId: number) {
    return this.client.get(`/movie/${movieId}`).then((r) => r.data);
  }
}


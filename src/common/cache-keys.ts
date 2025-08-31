import crypto from 'crypto';
export const movieDetailKey = (id: string) => `movies:detail:${id}`;
export const movieListKey = (qs: Record<string, any>) =>
  `movies:list:${crypto.createHash('sha1').update(JSON.stringify(qs)).digest('hex')}`;
export const genresAllKey = `genres:all`;

export class Genre {
  constructor(public readonly id: number, public readonly name: string, public readonly tmdbId: number) {}
}

export class Movie {
  constructor(
    public readonly id: string,
    public readonly tmdbId: number,
    public title: string,
    public overview: string | null,
    public releaseDate: Date | null,
    public posterPath: string | null,
    public popularity: number | null,
    public avgRating: number,
    public ratingCount: number,
    public genres: Genre[] = [],
  ) {}
}

export class Rating {
  constructor(public readonly userId: string, public readonly movieId: string, public score: number) {}
}

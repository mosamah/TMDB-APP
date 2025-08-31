export type PageParams = { page?: number; limit?: number };
export type PageMeta = { page: number; limit: number; total: number };
export type PageResult<T> = { meta: PageMeta; data: T[] };

export function normalizePage({ page = 1, limit = 20 }: PageParams) {
  const p = Math.max(1, Number(page));
  const l = Math.min(100, Math.max(1, Number(limit)));
  return { page: p, limit: l, skip: (p - 1) * l };
}

export function toPageResult<T>(items: T[], total: number, page: number, limit: number): PageResult<T> {
  return { meta: { page, limit, total }, data: items };
}

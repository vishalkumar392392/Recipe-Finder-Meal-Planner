import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const API = 'https://www.themealdb.com/api/json/v1/1';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const resource = url.searchParams.get('resource');
  const value = url.searchParams.get('value') ?? '';
  const paths: Record<string, string> = {
    search: `/search.php?s=${encodeURIComponent(value)}`,
    category: `/filter.php?c=${encodeURIComponent(value)}`,
    detail: `/lookup.php?i=${encodeURIComponent(value)}`,
    categories: '/list.php?c=list',
    areas: '/list.php?a=list',
  };
  const path = resource ? paths[resource] : undefined;
  if (!path) throw error(400, 'Unsupported recipe request.');

  const response = await fetch(`${API}${path}`);
  if (!response.ok) throw error(502, 'The recipe service is unavailable.');
  return json(await response.json());
};

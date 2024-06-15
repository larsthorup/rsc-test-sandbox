import { readFile } from 'fs/promises';

export async function getDreams() {
  const dreams = JSON.parse(await readFile('data/dreams.json', 'utf-8'));
  return dreams;
}

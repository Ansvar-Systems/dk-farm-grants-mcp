import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleSearchGrants } from '../../src/tools/search-grants.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-search-grants.db';

describe('search_grants tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('returns results for staldteknologi query', () => {
    const result = handleSearchGrants(db, { query: 'staldteknologi' });
    expect(result).toHaveProperty('results_count');
    expect((result as { results_count: number }).results_count).toBeGreaterThan(0);
  });

  test('returns results for gylleforsuring query', () => {
    const result = handleSearchGrants(db, { query: 'gylleforsuring' });
    expect(result).toHaveProperty('results_count');
    expect((result as { results_count: number }).results_count).toBeGreaterThan(0);
  });

  test('respects grant_type filter', () => {
    const result = handleSearchGrants(db, { query: 'investering tilskud', grant_type: 'investment' });
    if ('results' in result) {
      for (const r of (result as { results: { grant_type: string }[] }).results) {
        expect(r.grant_type).toBe('investment');
      }
    }
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleSearchGrants(db, { query: 'gylleforsuring', jurisdiction: 'FR' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });
});

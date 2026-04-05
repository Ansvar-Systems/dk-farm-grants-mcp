import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleEstimateGrantValue } from '../../src/tools/estimate-grant-value.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-estimate-value.db';

describe('estimate_grant_value tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('calculates total for selected items', () => {
    const result = handleEstimateGrantValue(db, {
      grant_id: 'miljoeteknologi',
      items: ['MT-01'],
    });
    // Single item: 40 (% value)
    expect((result as { items_selected: number }).items_selected).toBe(1);
  });

  test('calculates per-hectare items with area', () => {
    const result = handleEstimateGrantValue(db, {
      grant_id: 'oeko-arealtilskud',
      items: ['OA-01'],
      area_ha: 10,
    });
    // 1050/ha * 10 ha = 10500
    expect((result as { grant_value: number }).grant_value).toBe(10500);
  });

  test('calculates match funding for modernisering', () => {
    const result = handleEstimateGrantValue(db, {
      grant_id: 'modernisering',
    });
    // Modernisering: 60% match funding
    expect((result as { match_funding_pct: number }).match_funding_pct).toBe(60);
  });

  test('returns error for unknown grant', () => {
    const result = handleEstimateGrantValue(db, { grant_id: 'nonexistent' });
    expect(result).toHaveProperty('error', 'grant_not_found');
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleEstimateGrantValue(db, { grant_id: 'miljoeteknologi', jurisdiction: 'NL' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });
});

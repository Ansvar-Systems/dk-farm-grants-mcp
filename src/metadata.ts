export interface Meta {
  disclaimer: string;
  data_age: string;
  source_url: string;
  copyright: string;
  server: string;
  version: string;
}

const DISCLAIMER =
  'Tilskudsordninger ændres løbende. Tjek altid lbst.dk for aktuelle ordninger og ansøgningsfrister. ' +
  'Denne server giver vejledning baseret på offentliggjort information fra Landbrugsstyrelsen. ' +
  'Dette er ikke en ansøgningstjeneste.';

export function buildMeta(overrides?: Partial<Meta>): Meta {
  return {
    disclaimer: DISCLAIMER,
    data_age: overrides?.data_age ?? 'unknown',
    source_url: overrides?.source_url ?? 'https://lbst.dk/tilskud-selvbetjening/',
    copyright: 'Data: Landbrugsstyrelsen (offentlige data). Server: Apache-2.0 Ansvar Systems.',
    server: 'dk-farm-grants-mcp',
    version: '0.1.0',
    ...overrides,
  };
}

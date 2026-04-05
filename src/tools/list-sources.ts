import { buildMeta } from '../metadata.js';
import type { Database } from '../db.js';

interface Source {
  name: string;
  authority: string;
  official_url: string;
  retrieval_method: string;
  update_frequency: string;
  license: string;
  coverage: string;
  last_retrieved?: string;
}

export function handleListSources(db: Database): { sources: Source[]; _meta: ReturnType<typeof buildMeta> } {
  const lastIngest = db.get<{ value: string }>('SELECT value FROM db_metadata WHERE key = ?', ['last_ingest']);

  const sources: Source[] = [
    {
      name: 'Landbrugsstyrelsen Tilskudsguiden',
      authority: 'Landbrugsstyrelsen (Danish Agricultural Agency)',
      official_url: 'https://lbst.dk/tilskud-selvbetjening/',
      retrieval_method: 'MANUAL_EXTRACTION',
      update_frequency: 'per grant round',
      license: 'Danish public sector data (open)',
      coverage: 'Grant schemes, eligibility, payment rates, application guidance',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Landdistriktsprogrammet',
      authority: 'Ministeriet for Fødevarer, Landbrug og Fiskeri',
      official_url: 'https://lbst.dk/landdistrikter/',
      retrieval_method: 'MANUAL_EXTRACTION',
      update_frequency: 'programme period',
      license: 'Danish public sector data (open)',
      coverage: 'Rural development programme, investment support, environmental schemes',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'CAP Strategic Plan 2023-2027 (Denmark)',
      authority: 'European Commission / Landbrugsstyrelsen',
      official_url: 'https://agriculture.ec.europa.eu/cap-my-country/cap-strategic-plans_en',
      retrieval_method: 'MANUAL_EXTRACTION',
      update_frequency: 'programme period',
      license: 'EU open data',
      coverage: 'Direct payments, eco-schemes, rural development interventions',
      last_retrieved: lastIngest?.value,
    },
  ];

  return {
    sources,
    _meta: buildMeta({ source_url: 'https://lbst.dk/tilskud-selvbetjening/' }),
  };
}

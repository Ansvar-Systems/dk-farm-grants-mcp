import { createDatabase, type Database } from '../../src/db.js';

export function createSeededDatabase(dbPath: string): Database {
  const db = createDatabase(dbPath);

  // Grants
  db.run(
    `INSERT INTO grants (id, name, grant_type, authority, budget, status, open_date, close_date, description, eligible_applicants, match_funding_pct, max_grant_value, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['miljoeteknologi', 'Miljoeknologi', 'investment', 'Landbrugsstyrelsen', null, 'open', null, null, 'Investeringsstoette til staldteknologi der reducerer miljobelastning.', 'Jordbrugere med husdyrproduktion', 60, null, 'DK']
  );
  db.run(
    `INSERT INTO grants (id, name, grant_type, authority, budget, status, open_date, close_date, description, eligible_applicants, match_funding_pct, max_grant_value, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['oeko-arealtilskud', 'Oekologisk Arealtilskud', 'area_payment', 'Landbrugsstyrelsen', null, 'open', null, null, 'Tilskud til oekologisk drift. Omlaegningstilskud og opretholdelsestilskud.', 'Oekologisk certificerede jordbrugere', 0, null, 'DK']
  );
  db.run(
    `INSERT INTO grants (id, name, grant_type, authority, budget, status, open_date, close_date, description, eligible_applicants, match_funding_pct, max_grant_value, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['skovrejsning', 'Tilskud til skovrejsning', 'investment', 'Landbrugsstyrelsen', null, 'open', null, null, 'Tilskud til etablering af ny skov.', 'Lodsejere med landbrugsjord', 0, null, 'DK']
  );
  db.run(
    `INSERT INTO grants (id, name, grant_type, authority, budget, status, open_date, close_date, description, eligible_applicants, match_funding_pct, max_grant_value, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['modernisering', 'Moderniseringsstoette', 'investment', 'Landbrugsstyrelsen', null, 'open', null, null, 'Investeringer i primaer jordbrugsproduktion.', 'Jordbrugere med primaer produktion', 60, null, 'DK']
  );

  // Grant items
  db.run(
    `INSERT INTO grant_items (id, grant_id, item_code, name, description, specification, grant_value, grant_unit, category, score, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['mt-gylleforsuring', 'miljoeteknologi', 'MT-01', 'Gylleforsuring', 'Forsuringsanlaeg til gylle i stalden', 'Svovlsyrebaseret forsuringssystem', 40, '% af investering', 'staldteknologi', null, 'DK']
  );
  db.run(
    `INSERT INTO grant_items (id, grant_id, item_code, name, description, specification, grant_value, grant_unit, category, score, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['mt-kemisk-luftrensning', 'miljoeteknologi', 'MT-02', 'Kemisk luftrensning', 'Kemiske luftrensningsanlaeg', 'Anlaeg med dokumenteret NH3-reduktion', 40, '% af investering', 'staldteknologi', null, 'DK']
  );
  db.run(
    `INSERT INTO grant_items (id, grant_id, item_code, name, description, specification, grant_value, grant_unit, category, score, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['oeko-omlaegning', 'oeko-arealtilskud', 'OA-01', 'Omlaegningstilskud', 'Tilskud i omlaegningsperioden til oekologisk drift', '5-aarig tilsagnsperiode', 1050, 'DKK/ha/aar', 'omlaegning', null, 'DK']
  );
  db.run(
    `INSERT INTO grant_items (id, grant_id, item_code, name, description, specification, grant_value, grant_unit, category, score, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['oeko-opretholdelse', 'oeko-arealtilskud', 'OA-02', 'Opretholdelsestilskud', 'Tilskud til opretholdelse af oekologisk drift', '5-aarig tilsagnsperiode', 870, 'DKK/ha/aar', 'opretholdelse', null, 'DK']
  );
  db.run(
    `INSERT INTO grant_items (id, grant_id, item_code, name, description, specification, grant_value, grant_unit, category, score, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['skov-etablering', 'skovrejsning', 'SK-01', 'Etableringstilskud', 'Tilskud til plantning, jordbearbejdning og hegning', 'Min. 75% loevtrae, 20 aars fredskovspligt', null, 'variabel', 'etablering', null, 'DK']
  );

  // Stacking rules
  db.run(
    `INSERT INTO stacking_rules (grant_a, grant_b, compatible, conditions, jurisdiction)
     VALUES (?, ?, ?, ?, ?)`,
    ['miljoeteknologi', 'modernisering', 0, 'Kan ikke kombineres for samme investering.', 'DK']
  );
  db.run(
    `INSERT INTO stacking_rules (grant_a, grant_b, compatible, conditions, jurisdiction)
     VALUES (?, ?, ?, ?, ?)`,
    ['oeko-arealtilskud', 'skovrejsning', 1, 'Kan kombineres paa forskellige arealer.', 'DK']
  );
  db.run(
    `INSERT INTO stacking_rules (grant_a, grant_b, compatible, conditions, jurisdiction)
     VALUES (?, ?, ?, ?, ?)`,
    ['miljoeteknologi', 'oeko-arealtilskud', 1, 'Kan kombineres. Forskellige formaal.', 'DK']
  );

  // Application guidance
  db.run(
    `INSERT INTO application_guidance (grant_id, step_order, description, evidence_required, portal, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['miljoeteknologi', 1, 'Log ind paa Tast Selv med NemID/MitID.', null, 'https://tastselvservice.lbst.dk/', 'DK']
  );
  db.run(
    `INSERT INTO application_guidance (grant_id, step_order, description, evidence_required, portal, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['miljoeteknologi', 2, 'Udfyld ansoegningsskema med projektbeskrivelse.', 'Projektbeskrivelse, budget', 'https://tastselvservice.lbst.dk/', 'DK']
  );

  // FTS5 search index
  db.run(
    `INSERT INTO search_index (title, body, grant_type, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['Miljoeknologi', 'Investeringsstoette til staldteknologi der reducerer miljobelastning. Gylleforsuring, kemisk luftrensning, overdaekning.', 'investment', 'DK']
  );
  db.run(
    `INSERT INTO search_index (title, body, grant_type, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['Gylleforsuring -- Miljoeknologi', 'Forsuringsanlaeg til gylle i stalden. Reduktion af NH3-emission. Tilskud 40% af investering.', 'investment', 'DK']
  );
  db.run(
    `INSERT INTO search_index (title, body, grant_type, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['Kemisk luftrensning -- Miljoeknologi', 'Kemiske luftrensningsanlaeg til staldbygninger. Fjernelse af NH3 og lugt.', 'investment', 'DK']
  );
  db.run(
    `INSERT INTO search_index (title, body, grant_type, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['Oekologisk Arealtilskud', 'Tilskud til oekologisk drift. Omlaegningstilskud og opretholdelsestilskud.', 'area_payment', 'DK']
  );
  db.run(
    `INSERT INTO search_index (title, body, grant_type, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['Tilskud til skovrejsning', 'Tilskud til etablering af ny skov. Min 75% loevtrae.', 'investment', 'DK']
  );

  // Metadata
  db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('last_ingest', ?)", [new Date().toISOString().split('T')[0]]);

  return db;
}

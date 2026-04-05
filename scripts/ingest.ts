/**
 * Denmark Farm Grants MCP — Data Ingestion Script
 *
 * Populates the SQLite database with Danish farm grant schemes from
 * Landbrugsstyrelsen (lbst.dk), the Landdistriktsprogrammet, and
 * Denmark's CAP Strategic Plan 2023-2027.
 *
 * Usage: npm run ingest
 */

import { createDatabase } from '../src/db.js';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('data', { recursive: true });
const db = createDatabase('data/database.db');

const now = new Date().toISOString().split('T')[0];

// ──────────────────────────────────────────────
// 1. Grants
// ──────────────────────────────────────────────

interface Grant {
  id: string;
  name: string;
  grant_type: string;
  authority: string;
  budget: string | null;
  status: string;
  open_date: string | null;
  close_date: string | null;
  description: string;
  eligible_applicants: string;
  match_funding_pct: number;
  max_grant_value: number | null;
  jurisdiction: string;
}

const grants: Grant[] = [
  {
    id: 'miljoeteknologi',
    name: 'Miljøteknologi',
    grant_type: 'investment',
    authority: 'Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Investeringsstøtte til staldteknologi der reducerer miljøbelastning (gylleforsuring, kemisk luftrensning, overdækning). Op til 40% medfinansiering. Prioritering efter NH3-reduktion per krone.',
    eligible_applicants: 'Jordbrugere med husdyrproduktion',
    match_funding_pct: 60,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
  {
    id: 'oeko-arealtilskud',
    name: 'Økologisk Arealtilskud',
    grant_type: 'area_payment',
    authority: 'Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Tilskud til økologisk drift. Omlægningstilskud (5 år) og opretholdelsestilskud.',
    eligible_applicants: 'Økologisk certificerede jordbrugere',
    match_funding_pct: 0,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
  {
    id: 'pleje-natur',
    name: 'Pleje af græs- og naturarealer',
    grant_type: 'area_payment',
    authority: 'Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Tilskud til ekstensiv pleje af §3-arealer og andre naturarealer.',
    eligible_applicants: 'Jordbrugere og naturforvaltere med §3-arealer',
    match_funding_pct: 0,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
  {
    id: 'skovrejsning',
    name: 'Tilskud til skovrejsning',
    grant_type: 'investment',
    authority: 'Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Tilskud til etablering af ny skov. Krav om min. 75% løvtræ, 20 års fredskovspligt. Prioritering nær drikkevandsressourcer.',
    eligible_applicants: 'Lodsejere med landbrugsjord',
    match_funding_pct: 0,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
  {
    id: 'minivaadomraader',
    name: 'Tilskud til minivådområder',
    grant_type: 'investment',
    authority: 'Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Etableringstilskud op til 100% af standardomkostning. Konstruerede vådområder til kvælstoffjernelse. Årligt vedligeholdelsestilskud.',
    eligible_applicants: 'Jordbrugere i kvælstofsårbare områder',
    match_funding_pct: 0,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
  {
    id: 'vaadomraader',
    name: 'Vådområder og lavbundsprojekter',
    grant_type: 'project',
    authority: 'Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Projekttilskud til etablering af vådområder for kvælstoffjernelse og kulstofbinding. Kommunalt eller privat initiativ.',
    eligible_applicants: 'Kommuner, lodsejere, fælles initiativer',
    match_funding_pct: 0,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
  {
    id: 'modernisering',
    name: 'Moderniseringsstøtte',
    grant_type: 'investment',
    authority: 'Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Investeringer i primær jordbrugsproduktion. Ekstra point for unge landbrugere (<40 år).',
    eligible_applicants: 'Jordbrugere med primær produktion',
    match_funding_pct: 60,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
  {
    id: 'oe-stoette',
    name: 'Ø-tilskud til småøer',
    grant_type: 'area_payment',
    authority: 'Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Særligt drifts- og investeringstilskud til landbrug på 27 danske småøer (Ærø, Samsø, Læsø, etc.).',
    eligible_applicants: 'Jordbrugere på danske småøer',
    match_funding_pct: 0,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
  {
    id: 'dyrevelfaerd',
    name: 'Dyrevelfærdstilskud',
    grant_type: 'area_payment',
    authority: 'Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Tilskud til frilands- og økologisk husdyrhold med forbedret dyrevelfærd.',
    eligible_applicants: 'Husdyrbrugere med frilands- eller økologisk drift',
    match_funding_pct: 0,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
  {
    id: 'energi-landbrug',
    name: 'Energieffektivisering i landbruget',
    grant_type: 'investment',
    authority: 'Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Investeringsstøtte til energibesparende teknologi (LED, varmepumper, isolering, solceller).',
    eligible_applicants: 'Jordbrugere med aktiv produktion',
    match_funding_pct: 60,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
  {
    id: 'biogas',
    name: 'Tilskud til biogasanlæg',
    grant_type: 'investment',
    authority: 'Energistyrelsen / Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Etableringstilskud til fælles- og gårdbiogasanlæg. Feed-in tarif for el og varme.',
    eligible_applicants: 'Jordbrugere, andelsselskaber, energiselskaber',
    match_funding_pct: 0,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
  {
    id: 'klima-lavbund',
    name: 'Klima-lavbundsprojekter',
    grant_type: 'project',
    authority: 'Landbrugsstyrelsen',
    budget: null,
    status: 'open',
    open_date: null,
    close_date: null,
    description:
      'Udtagning af lavbundsjorder fra landbrugsdrift. Kulstofbinding og reduktion af drivhusgasemissioner. Engangserstatning.',
    eligible_applicants: 'Lodsejere med lavbundsjord',
    match_funding_pct: 0,
    max_grant_value: null,
    jurisdiction: 'DK',
  },
];

const insertGrant = db.instance.prepare(`
  INSERT OR REPLACE INTO grants
    (id, name, grant_type, authority, budget, status, open_date, close_date,
     description, eligible_applicants, match_funding_pct, max_grant_value, jurisdiction)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const g of grants) {
  insertGrant.run(
    g.id, g.name, g.grant_type, g.authority, g.budget, g.status,
    g.open_date, g.close_date, g.description, g.eligible_applicants,
    g.match_funding_pct, g.max_grant_value, g.jurisdiction
  );
}
console.log(`Inserted ${grants.length} grants.`);

// ──────────────────────────────────────────────
// 2. Grant Items (rate details per scheme)
// ──────────────────────────────────────────────

interface GrantItem {
  id: string;
  grant_id: string;
  item_code: string;
  name: string;
  description: string;
  specification: string | null;
  grant_value: number | null;
  grant_unit: string;
  category: string;
  score: number | null;
  jurisdiction: string;
}

const grantItems: GrantItem[] = [
  // Miljøteknologi items
  {
    id: 'mt-gylleforsuring',
    grant_id: 'miljoeteknologi',
    item_code: 'MT-01',
    name: 'Gylleforsuring',
    description: 'Forsuringsanlæg til gylle i stalden. Reduktion af NH3-emission med op til 70%.',
    specification: 'Svovlsyrebaseret forsuringssystem',
    grant_value: 40,
    grant_unit: '% af investering',
    category: 'staldteknologi',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'mt-kemisk-luftrensning',
    grant_id: 'miljoeteknologi',
    item_code: 'MT-02',
    name: 'Kemisk luftrensning',
    description: 'Kemiske luftrensningsanlæg til staldbygninger. Fjernelse af NH3 og lugt.',
    specification: 'Anlæg med dokumenteret NH3-reduktion min. 80%',
    grant_value: 40,
    grant_unit: '% af investering',
    category: 'staldteknologi',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'mt-overdaekning',
    grant_id: 'miljoeteknologi',
    item_code: 'MT-03',
    name: 'Overdækning af gyllebeholder',
    description: 'Fast overdækning af gyllebeholdere. Reducerer NH3-emission og lugtgener.',
    specification: 'Fast overdækning (telt eller beton)',
    grant_value: 40,
    grant_unit: '% af investering',
    category: 'gyllebeholdere',
    score: null,
    jurisdiction: 'DK',
  },
  // Økologisk Arealtilskud items
  {
    id: 'oeko-omlaegning',
    grant_id: 'oeko-arealtilskud',
    item_code: 'OA-01',
    name: 'Omlægningstilskud',
    description: 'Tilskud i omlægningsperioden til økologisk drift (5 år).',
    specification: '5-årig tilsagnsperiode',
    grant_value: 1050,
    grant_unit: 'DKK/ha/år',
    category: 'omlægning',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'oeko-opretholdelse',
    grant_id: 'oeko-arealtilskud',
    item_code: 'OA-02',
    name: 'Opretholdelsestilskud',
    description: 'Tilskud til opretholdelse af økologisk drift efter omlægningsperioden.',
    specification: '5-årig tilsagnsperiode',
    grant_value: 870,
    grant_unit: 'DKK/ha/år',
    category: 'opretholdelse',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'oeko-special',
    grant_id: 'oeko-arealtilskud',
    item_code: 'OA-03',
    name: 'Specialafgrødetillæg',
    description: 'Forhøjet tilskud til økologisk dyrkning af specialafgrøder (frugt, grønt, bær).',
    specification: 'Kræver specialafgrødeproduktion',
    grant_value: 1200,
    grant_unit: 'DKK/ha/år',
    category: 'specialafgrøder',
    score: null,
    jurisdiction: 'DK',
  },
  // Pleje af naturarealer items
  {
    id: 'pn-afgraesning',
    grant_id: 'pleje-natur',
    item_code: 'PN-01',
    name: 'Afgræsning',
    description: 'Tilskud til pleje af naturarealer ved afgræsning med husdyr.',
    specification: 'Min. 0,3 storkreaturenheder/ha',
    grant_value: 2600,
    grant_unit: 'DKK/ha/år',
    category: 'afgræsning',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'pn-slaet',
    grant_id: 'pleje-natur',
    item_code: 'PN-02',
    name: 'Slæt',
    description: 'Tilskud til pleje af naturarealer ved høslæt.',
    specification: 'Slåning og fjernelse af materiale min. 1x/år',
    grant_value: 1800,
    grant_unit: 'DKK/ha/år',
    category: 'slæt',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'pn-saerlig',
    grant_id: 'pleje-natur',
    item_code: 'PN-03',
    name: 'Særlig pleje',
    description: 'Forhøjet tilskud til arealer med særlige naturværdier (HNV-arealer, Natura 2000).',
    specification: 'Kræver udpeget HNV- eller Natura 2000-areal',
    grant_value: 3200,
    grant_unit: 'DKK/ha/år',
    category: 'særlig pleje',
    score: null,
    jurisdiction: 'DK',
  },
  // Skovrejsning items
  {
    id: 'skov-etablering',
    grant_id: 'skovrejsning',
    item_code: 'SK-01',
    name: 'Etableringstilskud',
    description: 'Tilskud til plantning, jordbearbejdning og hegning ved skovrejsning.',
    specification: 'Min. 75% løvtræ, 20 års fredskovspligt',
    grant_value: null,
    grant_unit: 'variabel',
    category: 'etablering',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'skov-drikkevand',
    grant_id: 'skovrejsning',
    item_code: 'SK-02',
    name: 'Drikkevandsbonus',
    description: 'Forhøjet tilskud for skovrejsning i områder med særlige drikkevandsinteresser (OSD).',
    specification: 'Areal udpeget som OSD eller BNBO',
    grant_value: null,
    grant_unit: 'variabel',
    category: 'drikkevandsbeskyttelse',
    score: null,
    jurisdiction: 'DK',
  },
  // Minivådområder items
  {
    id: 'mini-aaben',
    grant_id: 'minivaadomraader',
    item_code: 'MV-01',
    name: 'Åbent minivådområde',
    description: 'Etablering af åbent konstrueret vådområde til kvælstoffjernelse. Op til 100% tilskud.',
    specification: 'Min. 1% af drænoplandet',
    grant_value: 100,
    grant_unit: '% af standardomkostning',
    category: 'etablering',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'mini-lukket',
    grant_id: 'minivaadomraader',
    item_code: 'MV-02',
    name: 'Lukket minivådområde (matriceanlæg)',
    description: 'Undergrundssystem med filtermatrice til kvælstoffjernelse.',
    specification: 'Træflis- eller muslingeskalbaseret matrice',
    grant_value: 100,
    grant_unit: '% af standardomkostning',
    category: 'etablering',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'mini-vedligehold',
    grant_id: 'minivaadomraader',
    item_code: 'MV-03',
    name: 'Vedligeholdelsestilskud',
    description: 'Årligt tilskud til vedligeholdelse af etableret minivådområde.',
    specification: '10-årig vedligeholdelsesperiode',
    grant_value: null,
    grant_unit: 'DKK/år (fastsat ved tilsagn)',
    category: 'vedligeholdelse',
    score: null,
    jurisdiction: 'DK',
  },
  // Modernisering items
  {
    id: 'mod-stald',
    grant_id: 'modernisering',
    item_code: 'MO-01',
    name: 'Staldmodernisering',
    description: 'Investeringer i modernisering af staldbygninger og inventar.',
    specification: 'Op til 40% tilskud',
    grant_value: 40,
    grant_unit: '% af investering',
    category: 'staldanlæg',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'mod-unge',
    grant_id: 'modernisering',
    item_code: 'MO-02',
    name: 'Unge landbrugere bonus',
    description: 'Ekstra prioriteringspoint for ansøgere under 40 år ved førstegangsetablering.',
    specification: 'Ansøger under 40 år ved ansøgningstidspunkt',
    grant_value: null,
    grant_unit: 'prioriteringspoint',
    category: 'unge landbrugere',
    score: 10,
    jurisdiction: 'DK',
  },
  // Energieffektivisering items
  {
    id: 'energi-led',
    grant_id: 'energi-landbrug',
    item_code: 'EN-01',
    name: 'LED-belysning',
    description: 'Udskiftning til LED-belysning i stald- og driftsbygninger.',
    specification: 'Energiklasse A eller bedre',
    grant_value: 40,
    grant_unit: '% af investering',
    category: 'belysning',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'energi-varmepumpe',
    grant_id: 'energi-landbrug',
    item_code: 'EN-02',
    name: 'Varmepumper',
    description: 'Installation af varmepumpeanlæg til opvarmning af stalde eller driftsrum.',
    specification: 'COP min. 3,0',
    grant_value: 40,
    grant_unit: '% af investering',
    category: 'opvarmning',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'energi-solceller',
    grant_id: 'energi-landbrug',
    item_code: 'EN-03',
    name: 'Solcelleanlæg',
    description: 'Installation af solcelleanlæg til egenproduktion af el på landbrugsbedriften.',
    specification: 'Tilsluttet bedriftens eget forbrug',
    grant_value: 40,
    grant_unit: '% af investering',
    category: 'vedvarende energi',
    score: null,
    jurisdiction: 'DK',
  },
  // Dyrevelfærd items
  {
    id: 'dv-friland',
    grant_id: 'dyrevelfaerd',
    item_code: 'DV-01',
    name: 'Frilandstilskud',
    description: 'Tilskud til frilandsproduktion med adgang til udeareal hele året.',
    specification: 'Dyrene skal have permanent adgang til udeareal',
    grant_value: null,
    grant_unit: 'DKK/dyr (variabel)',
    category: 'friland',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'dv-oeko-husdyr',
    grant_id: 'dyrevelfaerd',
    item_code: 'DV-02',
    name: 'Økologisk husdyrtilskud',
    description: 'Tillægstilskud til økologisk husdyrhold med dokumenteret dyrevelfærd.',
    specification: 'Økologisk certificering + dyrevelfærdscertificering',
    grant_value: null,
    grant_unit: 'DKK/dyr (variabel)',
    category: 'økologisk husdyr',
    score: null,
    jurisdiction: 'DK',
  },
  // Biogas items
  {
    id: 'biogas-faelles',
    grant_id: 'biogas',
    item_code: 'BG-01',
    name: 'Fællesbiogasanlæg',
    description: 'Etableringstilskud til fælles biogasanlæg der modtager gylle fra flere bedrifter.',
    specification: 'Min. 75% husdyrgødning som inputmateriale',
    grant_value: null,
    grant_unit: 'variabel',
    category: 'fællesanlæg',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'biogas-gaard',
    grant_id: 'biogas',
    item_code: 'BG-02',
    name: 'Gårdbiogasanlæg',
    description: 'Etableringstilskud til gårdbiogasanlæg på enkeltbedrift.',
    specification: 'Primært egen husdyrgødning',
    grant_value: null,
    grant_unit: 'variabel',
    category: 'gårdanlæg',
    score: null,
    jurisdiction: 'DK',
  },
  {
    id: 'biogas-feedin',
    grant_id: 'biogas',
    item_code: 'BG-03',
    name: 'Feed-in tarif',
    description: 'Løbende pristillæg for el og varme produceret fra biogas.',
    specification: 'Afhængig af anlægsstørrelse og tidspunkt for godkendelse',
    grant_value: null,
    grant_unit: 'øre/kWh',
    category: 'driftsstøtte',
    score: null,
    jurisdiction: 'DK',
  },
];

const insertItem = db.instance.prepare(`
  INSERT OR REPLACE INTO grant_items
    (id, grant_id, item_code, name, description, specification,
     grant_value, grant_unit, category, score, jurisdiction)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const item of grantItems) {
  insertItem.run(
    item.id, item.grant_id, item.item_code, item.name, item.description,
    item.specification, item.grant_value, item.grant_unit, item.category,
    item.score, item.jurisdiction
  );
}
console.log(`Inserted ${grantItems.length} grant items.`);

// ──────────────────────────────────────────────
// 3. Stacking Rules (combinability)
// ──────────────────────────────────────────────

interface StackingRule {
  grant_a: string;
  grant_b: string;
  compatible: number;
  conditions: string;
}

const stackingRules: StackingRule[] = [
  {
    grant_a: 'oeko-arealtilskud',
    grant_b: 'pleje-natur',
    compatible: 1,
    conditions: 'Kan kombineres på samme areal — dog ikke dobbelt arealtilskud for samme formål.',
  },
  {
    grant_a: 'oeko-arealtilskud',
    grant_b: 'dyrevelfaerd',
    compatible: 1,
    conditions: 'Kan kombineres. Økologisk arealtilskud og dyrevelfærdstilskud dækker forskellige formål.',
  },
  {
    grant_a: 'miljoeteknologi',
    grant_b: 'modernisering',
    compatible: 0,
    conditions: 'Kan ikke kombineres for samme investering. Vælg den mest fordelagtige ordning.',
  },
  {
    grant_a: 'miljoeteknologi',
    grant_b: 'energi-landbrug',
    compatible: 1,
    conditions: 'Kan kombineres hvis investeringerne er adskilte (f.eks. staldteknologi + solceller).',
  },
  {
    grant_a: 'minivaadomraader',
    grant_b: 'vaadomraader',
    compatible: 0,
    conditions: 'Kan ikke kombineres på samme areal. Minivådområder og vådområdeprojekter er separate ordninger.',
  },
  {
    grant_a: 'skovrejsning',
    grant_b: 'klima-lavbund',
    compatible: 1,
    conditions: 'Kan kombineres på tilstødende arealer. Skovrejsning på lavbundsjord kan opnå begge tilskud.',
  },
  {
    grant_a: 'pleje-natur',
    grant_b: 'oe-stoette',
    compatible: 1,
    conditions: 'Kan kombineres. Ø-tilskud er supplement til øvrige arealordninger.',
  },
  {
    grant_a: 'modernisering',
    grant_b: 'energi-landbrug',
    compatible: 1,
    conditions: 'Kan kombineres for adskilte investeringer (f.eks. staldombygning + energitiltag).',
  },
  {
    grant_a: 'biogas',
    grant_b: 'energi-landbrug',
    compatible: 1,
    conditions: 'Kan kombineres. Biogas og energieffektivisering er komplementære ordninger.',
  },
  {
    grant_a: 'vaadomraader',
    grant_b: 'klima-lavbund',
    compatible: 1,
    conditions: 'Kan kombineres — begge sigter på lavbundsarealer, men dækker forskellige projekttyper.',
  },
];

const insertStacking = db.instance.prepare(`
  INSERT OR REPLACE INTO stacking_rules
    (grant_a, grant_b, compatible, conditions, jurisdiction)
  VALUES (?, ?, ?, ?, 'DK')
`);

for (const r of stackingRules) {
  insertStacking.run(r.grant_a, r.grant_b, r.compatible, r.conditions);
}
console.log(`Inserted ${stackingRules.length} stacking rules.`);

// ──────────────────────────────────────────────
// 4. Application Guidance
// ──────────────────────────────────────────────

interface Guidance {
  grant_id: string;
  step_order: number;
  description: string;
  evidence_required: string | null;
  portal: string;
}

const guidance: Guidance[] = [
  // Generic steps (apply to all schemes via Tast Selv)
  {
    grant_id: 'miljoeteknologi',
    step_order: 1,
    description: 'Log ind på Tast Selv (Landbrugsstyrelsens digitale ansøgningsplatform) med NemID/MitID.',
    evidence_required: null,
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'miljoeteknologi',
    step_order: 2,
    description: 'Vælg ordningen "Miljøteknologi" under investeringsstøtte. Udfyld ansøgningsskema med projektbeskrivelse.',
    evidence_required: 'Projektbeskrivelse, tegninger, budget',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'miljoeteknologi',
    step_order: 3,
    description: 'Vedlæg dokumentation for forventet NH3-reduktion og 2 uafhængige tilbud.',
    evidence_required: 'NH3-reduktionsberegning, min. 2 tilbud fra leverandører',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'miljoeteknologi',
    step_order: 4,
    description: 'Vent på tilsagn fra Landbrugsstyrelsen (typisk 3-6 måneder). Påbegynd IKKE investering før tilsagn.',
    evidence_required: null,
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'miljoeteknologi',
    step_order: 5,
    description: 'Gennemfør investering inden tilsagnets udløbsdato. Indsend udbetalingsanmodning med fakturaer og betalingsdokumentation.',
    evidence_required: 'Fakturaer, betalingsbilag, afsluttende projektrapport',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'oeko-arealtilskud',
    step_order: 1,
    description: 'Sikr at bedriften er økologisk certificeret via Landbrugsstyrelsen.',
    evidence_required: 'Økologisk certificering / autorisation',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'oeko-arealtilskud',
    step_order: 2,
    description: 'Ansøg i Fællesskemaet (det årlige ansøgningsskema) via Tast Selv. Angiv arealer der søges tilskud til.',
    evidence_required: 'Markkort med angivelse af økologiske arealer',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'oeko-arealtilskud',
    step_order: 3,
    description: 'Overhold krav om økologisk drift i hele tilsagnsperioden (5 år). Udbetaling sker årligt.',
    evidence_required: 'Årlig kontrol af økologisk drift',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'pleje-natur',
    step_order: 1,
    description: 'Ansøg via Tast Selv under "Pleje af græs- og naturarealer". Angiv arealer og plejemetode (afgræsning/slæt).',
    evidence_required: 'Markkort, §3-registrering af arealet',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'pleje-natur',
    step_order: 2,
    description: 'Overhold plejekrav i tilsagnsperioden: afgræsning min. 0,3 SKE/ha eller slæt min. 1x årligt.',
    evidence_required: 'Dokumentation af plejetiltag',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'minivaadomraader',
    step_order: 1,
    description: 'Ansøg via Tast Selv. Vedlæg projektforslag med placering, drænopland og forventet kvælstoffjernelse.',
    evidence_required: 'Projektforslag, kort over drænopland, kvælstofberegning',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'minivaadomraader',
    step_order: 2,
    description: 'Ved tilsagn: gennemfør etablering inden tilsagnets udløb. Indsend udbetalingsanmodning.',
    evidence_required: 'Dokumentation for etablering, fakturaer',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'minivaadomraader',
    step_order: 3,
    description: 'Overhold vedligeholdelseskrav i 10 år. Årlig kontrol af anlæggets funktion.',
    evidence_required: 'Vedligeholdelsesrapport',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'skovrejsning',
    step_order: 1,
    description: 'Ansøg via Tast Selv. Vedlæg tilplantningsplan med artsfordeling (min. 75% løvtræ).',
    evidence_required: 'Tilplantningsplan, kort over arealet',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'skovrejsning',
    step_order: 2,
    description: 'Arealet pålægges 20 års fredskovspligt ved tilsagn. Gennemfør plantning inden frist.',
    evidence_required: 'Kvittering for fredskovspligt-tinglysning',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'modernisering',
    step_order: 1,
    description: 'Ansøg via Tast Selv under moderniseringsordningen. Vedlæg investeringsbudget og projektbeskrivelse.',
    evidence_required: 'Investeringsbudget, 2 tilbud, projektbeskrivelse',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'modernisering',
    step_order: 2,
    description: 'Vent på tilsagn. Påbegynd IKKE investering før tilsagn er modtaget. Gennemfør og indsend udbetaling.',
    evidence_required: 'Fakturaer, betalingsbilag',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'vaadomraader',
    step_order: 1,
    description: 'Kontakt kommunen eller Landbrugsstyrelsen for at afklare projektmuligheder i dit område.',
    evidence_required: null,
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'vaadomraader',
    step_order: 2,
    description: 'Ansøg via Tast Selv med detaljeret projektbeskrivelse, arealkort og hydrologisk vurdering.',
    evidence_required: 'Projektbeskrivelse, arealkort, hydrologisk vurdering, lodsejertilkendegivelser',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'klima-lavbund',
    step_order: 1,
    description: 'Ansøg via Tast Selv. Arealet skal være klassificeret som lavbundsjord (kulstofrig jord).',
    evidence_required: 'Jordklassificering, arealkort',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'klima-lavbund',
    step_order: 2,
    description: 'Ved tilsagn: arealet udtages permanent fra landbrugsdrift. Engangserstatning udbetales.',
    evidence_required: 'Dokumentation for udtagning, tinglysning',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'energi-landbrug',
    step_order: 1,
    description: 'Ansøg via Tast Selv under energieffektiviseringsordningen. Vedlæg energirådgiverrapport.',
    evidence_required: 'Energirådgiverrapport, investeringsbudget, 2 tilbud',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'energi-landbrug',
    step_order: 2,
    description: 'Gennemfør investering efter tilsagn. Indsend udbetalingsanmodning med dokumentation.',
    evidence_required: 'Fakturaer, betalingsbilag, energibesparelsesoversigt',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'biogas',
    step_order: 1,
    description: 'Ansøg om etableringstilskud via Energistyrelsen (store anlæg) eller Landbrugsstyrelsen (gårdanlæg).',
    evidence_required: 'Projektbeskrivelse, businessplan, miljøvurdering',
    portal: 'https://ens.dk/',
  },
  {
    grant_id: 'biogas',
    step_order: 2,
    description: 'Indhent miljøgodkendelse og byggetilladelse. Gennemfør etablering efter tilsagn.',
    evidence_required: 'Miljøgodkendelse, byggetilladelse, fakturaer',
    portal: 'https://ens.dk/',
  },
  {
    grant_id: 'oe-stoette',
    step_order: 1,
    description: 'Ansøg via Tast Selv. Bedriften skal være beliggende på en af de 27 udpegede danske småøer.',
    evidence_required: 'CVR-registrering med adresse på småø',
    portal: 'https://tastselvservice.lbst.dk/',
  },
  {
    grant_id: 'dyrevelfaerd',
    step_order: 1,
    description: 'Ansøg via Tast Selv under dyrevelfærdsordningen. Dokumenter nuværende dyreholdsforhold.',
    evidence_required: 'Dyreholdsoversigt, staldtegninger, dyrevelfærdsvurdering',
    portal: 'https://tastselvservice.lbst.dk/',
  },
];

const insertGuidance = db.instance.prepare(`
  INSERT OR REPLACE INTO application_guidance
    (grant_id, step_order, description, evidence_required, portal, jurisdiction)
  VALUES (?, ?, ?, ?, ?, 'DK')
`);

for (const g of guidance) {
  insertGuidance.run(g.grant_id, g.step_order, g.description, g.evidence_required, g.portal);
}
console.log(`Inserted ${guidance.length} application guidance steps.`);

// ──────────────────────────────────────────────
// 5. FTS5 Search Index
// ──────────────────────────────────────────────

// Clear existing index
db.instance.exec('DELETE FROM search_index');

// Index grants
for (const g of grants) {
  db.instance.prepare(
    `INSERT INTO search_index (title, body, grant_type, jurisdiction)
     VALUES (?, ?, ?, ?)`
  ).run(g.name, g.description, g.grant_type, g.jurisdiction);
}

// Index grant items with parent grant name prefix
for (const item of grantItems) {
  const parent = grants.find(g => g.id === item.grant_id);
  const title = parent ? `${parent.name} -- ${item.name}` : item.name;
  const body = [item.description, item.specification].filter(Boolean).join('. ');
  db.instance.prepare(
    `INSERT INTO search_index (title, body, grant_type, jurisdiction)
     VALUES (?, ?, ?, ?)`
  ).run(title, body, parent?.grant_type ?? '', item.jurisdiction);
}

console.log(`Built FTS5 search index (${grants.length + grantItems.length} entries).`);

// ──────────────────────────────────────────────
// 6. Metadata
// ──────────────────────────────────────────────

const metadataEntries: [string, string][] = [
  ['last_ingest', now],
  ['build_date', now],
  ['schema_version', '1.0'],
  ['mcp_name', 'Danish Farm Grants MCP'],
  ['jurisdiction', 'DK'],
  ['grant_count', String(grants.length)],
  ['item_count', String(grantItems.length)],
  ['stacking_rule_count', String(stackingRules.length)],
  ['guidance_step_count', String(guidance.length)],
  ['data_sources', 'Landbrugsstyrelsen Tilskudsguiden (lbst.dk), Landdistriktsprogrammet, CAP SP 2023-2027'],
  ['disclaimer', 'Tilskudsordninger ændres løbende. Tjek altid lbst.dk for aktuelle ordninger og ansøgningsfrister.'],
];

for (const [key, value] of metadataEntries) {
  db.run('INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)', [key, value]);
}
console.log('Updated metadata.');

// ──────────────────────────────────────────────
// 7. Coverage file
// ──────────────────────────────────────────────

writeFileSync('data/coverage.json', JSON.stringify({
  mcp_name: 'Danish Farm Grants MCP',
  jurisdiction: 'DK',
  build_date: now,
  status: 'populated',
  grants: grants.length,
  grant_items: grantItems.length,
  stacking_rules: stackingRules.length,
  guidance_steps: guidance.length,
  data_sources: [
    'Landbrugsstyrelsen Tilskudsguiden (lbst.dk)',
    'Landdistriktsprogrammet',
    'CAP SP 2023-2027',
  ],
}, null, 2));

db.close();
console.log('Done. Database written to data/database.db');

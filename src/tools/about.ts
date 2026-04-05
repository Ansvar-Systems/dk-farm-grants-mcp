import { buildMeta } from '../metadata.js';
import { SUPPORTED_JURISDICTIONS } from '../jurisdiction.js';

export function handleAbout() {
  return {
    name: 'Danish Farm Grants MCP',
    description:
      'Danish farm grants and subsidies made queryable by AI. Covers Miljøteknologi, Økologisk Arealtilskud, ' +
      'Pleje af naturarealer, skovrejsning, minivådområder, modernisering, dyrevelfærd, and more. ' +
      'Data sourced from Landbrugsstyrelsen, Landdistriktsprogrammet, and CAP SP 2023-2027.',
    version: '0.1.0',
    jurisdiction: [...SUPPORTED_JURISDICTIONS],
    data_sources: [
      'Landbrugsstyrelsen Tilskudsguiden (lbst.dk)',
      'Landdistriktsprogrammet',
      'CAP Strategic Plan 2023-2027 (Denmark)',
    ],
    tools_count: 10,
    links: {
      homepage: 'https://ansvar.eu/open-agriculture',
      repository: 'https://github.com/Ansvar-Systems/dk-farm-grants-mcp',
      mcp_network: 'https://ansvar.ai/mcp',
    },
    _meta: buildMeta(),
  };
}

# Denmark Farm Grants MCP

[![CI](https://github.com/Ansvar-Systems/dk-farm-grants-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Ansvar-Systems/dk-farm-grants-mcp/actions/workflows/ci.yml)
[![GHCR](https://github.com/Ansvar-Systems/dk-farm-grants-mcp/actions/workflows/ghcr-build.yml/badge.svg)](https://github.com/Ansvar-Systems/dk-farm-grants-mcp/actions/workflows/ghcr-build.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Danish farm grants and subsidies via the [Model Context Protocol](https://modelcontextprotocol.io). Query Miljoeknologi, Oekologisk Arealtilskud, minivaadomraader, skovrejsning -- eligible items, stacking rules, and application guidance -- all from your AI assistant.

Part of [Ansvar Open Agriculture](https://ansvar.eu/open-agriculture).

## Why This Exists

Danish farmers miss available grant funding because the information is spread across Landbrugsstyrelsen publications, the Tast Selv portal, and various programme documents. This MCP server consolidates it into a single AI-queryable source. Ask about schemes, check eligibility, find out which grants can be combined, and get step-by-step application guidance.

## Quick Start

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "dk-farm-grants": {
      "command": "npx",
      "args": ["-y", "@ansvar/dk-farm-grants-mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add dk-farm-grants npx @ansvar/dk-farm-grants-mcp
```

### Streamable HTTP (remote)

```
https://mcp.ansvar.eu/dk-farm-grants/mcp
```

### Docker (self-hosted)

```bash
docker run -p 3000:3000 ghcr.io/ansvar-systems/dk-farm-grants-mcp:latest
```

### npm (stdio)

```bash
npx @ansvar/dk-farm-grants-mcp
```

## Example Queries

Ask your AI assistant:

- "Hvilke tilskudsordninger er der til miljoteknologi?"
- "Hvad er satserne for okologisk arealtilskud?"
- "Kan jeg kombinere miljoeteknologi med moderniseringsstoette?"
- "Hvordan ansoeger jeg om minivaadomraader?"
- "Hvilke energiinvesteringer kan jeg faa tilskud til?"
- "Hvad er kravene til skovrejsning?"
- "Vis mig tilskud til dyrevelfaerd"

## Stats

| Metric | Value |
|--------|-------|
| Tools | 10 (3 meta + 7 domain) |
| Jurisdiction | DK |
| Grants covered | 12 schemes (investment, area payments, projects) |
| Data sources | Landbrugsstyrelsen, Landdistriktsprogrammet, CAP SP 2023-2027 |
| License (data) | Danish public sector open data |
| License (code) | Apache-2.0 |
| Transport | stdio + Streamable HTTP |

## Tools

| Tool | Description |
|------|-------------|
| `about` | Server metadata and links |
| `list_sources` | Data sources with freshness info |
| `check_data_freshness` | Staleness status and refresh command |
| `search_grants` | FTS5 search across grants and eligible items |
| `get_grant_details` | Full grant scheme details with eligibility |
| `check_deadlines` | Open and upcoming deadlines with urgency |
| `get_eligible_items` | Eligible items with codes, values, specs |
| `check_stacking` | Grant combination compatibility matrix |
| `get_application_process` | Step-by-step application guidance |
| `estimate_grant_value` | Total grant estimate with match-funding |

See [TOOLS.md](TOOLS.md) for full parameter documentation.

## Security Scanning

This repository runs security checks on every push:

- **CodeQL** -- static analysis for JavaScript/TypeScript
- **Gitleaks** -- secret detection across full history
- **Dependency review** -- via Dependabot
- **Container scanning** -- via GHCR build pipeline

See [SECURITY.md](SECURITY.md) for reporting policy.

## Disclaimer

This tool provides reference data for informational purposes only. It is not professional financial or agricultural advice. Grant details change -- always verify on lbst.dk before applying. See [DISCLAIMER.md](DISCLAIMER.md).

## Contributing

Issues and pull requests welcome. For security vulnerabilities, email security@ansvar.eu (do not open a public issue).

## License

Apache-2.0. Data sourced under Danish public sector open data principles.

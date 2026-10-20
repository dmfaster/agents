export type DecisionMakerRoleTranslator = (key: string, fallback: string) => string;

type StandardDecisionMakerRole = {
  key: string;
  fallback: string;
};

const STANDARD_ROLE_BY_NORMALIZED_LABEL = new Map<string, StandardDecisionMakerRole>([
  [
    "toimitusjohtaja",
    {
      key: "companies.decisionMakerRole.ceo",
      fallback: "CEO",
    },
  ],
  [
    "direktør",
    {
      key: "companies.decisionMakerRole.ceo",
      fallback: "CEO",
    },
  ],
  [
    "adm. direktør",
    {
      key: "companies.decisionMakerRole.ceo",
      fallback: "CEO",
    },
  ],
  [
    "verkställande direktör",
    {
      key: "companies.decisionMakerRole.ceo",
      fallback: "CEO",
    },
  ],
  [
    "extern verkställande direktör",
    {
      key: "companies.decisionMakerRole.ceo",
      fallback: "CEO",
    },
  ],
  [
    "vice verkställande direktör",
    {
      key: "companies.decisionMakerRole.ceo",
      fallback: "CEO",
    },
  ],
  [
    "extern vice verkställande direktör",
    {
      key: "companies.decisionMakerRole.ceo",
      fallback: "CEO",
    },
  ],
  [
    "daglig leder",
    {
      key: "companies.decisionMakerRole.ceo",
      fallback: "CEO",
    },
  ],
  [
    "juhatuse liige (juhataja)",
    {
      key: "companies.decisionMakerRole.ceo",
      fallback: "CEO",
    },
  ],
  [
    "hallituksen puheenjohtaja",
    {
      key: "companies.decisionMakerRole.boardChair",
      fallback: "Board chair",
    },
  ],
  [
    "juhatuse esimees",
    {
      key: "companies.decisionMakerRole.boardChair",
      fallback: "Board chair",
    },
  ],
  [
    "bestyrelsesformand",
    {
      key: "companies.decisionMakerRole.boardChair",
      fallback: "Board chair",
    },
  ],
  [
    "ordförande",
    {
      key: "companies.decisionMakerRole.boardChair",
      fallback: "Board chair",
    },
  ],
  [
    "styrets leder",
    {
      key: "companies.decisionMakerRole.boardChair",
      fallback: "Board chair",
    },
  ],
  [
    "hallituksen jäsen",
    {
      key: "companies.decisionMakerRole.boardMember",
      fallback: "Board member",
    },
  ],
  [
    "juhatuse liige",
    {
      key: "companies.decisionMakerRole.boardMember",
      fallback: "Board member",
    },
  ],
  [
    "bestyrelsesmedlem",
    {
      key: "companies.decisionMakerRole.boardMember",
      fallback: "Board member",
    },
  ],
  [
    "ledamot",
    {
      key: "companies.decisionMakerRole.boardMember",
      fallback: "Board member",
    },
  ],
  [
    "styremedlem",
    {
      key: "companies.decisionMakerRole.boardMember",
      fallback: "Board member",
    },
  ],
  [
    "stifter",
    {
      key: "companies.decisionMakerRole.founder",
      fallback: "Founder",
    },
  ],
  [
    "prokurist",
    {
      key: "companies.decisionMakerRole.authorizedSignatory",
      fallback: "Authorized signatory",
    },
  ],
  [
    "extern firmatecknare",
    {
      key: "companies.decisionMakerRole.authorizedSignatory",
      fallback: "Authorized signatory",
    },
  ],
  [
    "suppleant",
    {
      key: "companies.decisionMakerRole.deputyBoardMember",
      fallback: "Deputy board member",
    },
  ],
  [
    "varamedlem",
    {
      key: "companies.decisionMakerRole.deputyBoardMember",
      fallback: "Deputy board member",
    },
  ],
]);

function normalizeDecisionMakerRoleLabel(value: string) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en-US");
}

export function formatStandardDecisionMakerRole(role: string, t: DecisionMakerRoleTranslator) {
  const normalized = normalizeDecisionMakerRoleLabel(role);
  if (!normalized) {
    return "";
  }

  const standardRole = STANDARD_ROLE_BY_NORMALIZED_LABEL.get(normalized);
  return standardRole ? t(standardRole.key, standardRole.fallback) : role.trim();
}

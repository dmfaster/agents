import type { CompanySignalsProfile } from "@dmfaster/product-ui/company-signals";
import { record, text, numeric, externalUrl, type CompanyDetail } from "./companies-data.ts";

const strings = (value: unknown) => (Array.isArray(value) ? value.map(text).filter(Boolean) : []);
const records = (value: unknown) => (Array.isArray(value) ? value.map(record) : []);

// Older public receipts can omit optional arrays. Normalize those at the adapter,
// keeping missing metrics unknown and all navigation restricted to web URLs.
export function companySignals(
  profile: CompanyDetail["profile"] | undefined,
): CompanySignalsProfile {
  const advertising = record(profile?.advertising);
  const google = record(advertising.google);
  const meta = record(advertising.meta);
  const funding = record(profile?.funding);
  const publicFunding = record(profile?.publicFunding);
  const hiring = record(profile?.hiring);
  const recruitment = record(profile?.recruitment);
  const approaches = record(google.audienceSelectionApproaches);
  const targeting = record(meta.targeting);
  return {
    funding: profile?.funding
      ? {
          ...funding,
          fundingServices: strings(funding.fundingServices),
          programmes: strings(funding.programmes),
          projectMunicipalities: strings(funding.projectMunicipalities),
          projectRegions: strings(funding.projectRegions),
        }
      : null,
    publicFunding: profile?.publicFunding
      ? {
          ...publicFunding,
          sources: records(publicFunding.sources),
          recentEvents: records(publicFunding.recentEvents),
        }
      : null,
    recruitment: profile?.recruitment
      ? {
          ...recruitment,
          postings: records(recruitment.postings).map((posting) => ({
            ...posting,
            sourceUrl: externalUrl(posting.sourceUrl),
          })),
        }
      : null,
    hiring:
      hiring.active === true
        ? {
            ...hiring,
            openPositionCount: numeric(hiring.openPositionCount),
            newJobs7d: numeric(hiring.newJobs7d),
            recentRoles: records(hiring.recentRoles),
            roleFamilies: strings(hiring.roleFamilies),
          }
        : null,
    advertising: {
      google: advertising.google
        ? {
            ...google,
            evidenceUrl: externalUrl(google.evidenceUrl),
            creativeCount: numeric(google.creativeCount),
            advertiserNames: strings(google.advertiserNames),
            advertiserLocations: strings(google.advertiserLocations),
            formats: strings(google.formats),
            topics: strings(google.topics),
            adFundedBy: strings(google.adFundedBy),
            verificationStatuses: strings(google.verificationStatuses),
            audienceSelectionApproaches: Object.fromEntries(
              [
                "demographicInfo",
                "geoLocation",
                "contextualSignals",
                "customerLists",
                "topicsOfInterest",
              ].map((key) => [key, strings(approaches[key])]),
            ),
          }
        : null,
      meta: advertising.meta
        ? {
            ...meta,
            evidenceUrl: externalUrl(meta.evidenceUrl),
            activeAdCount: numeric(meta.activeAdCount),
            maxSingleAdReach: numeric(meta.maxSingleAdReach),
            associationStatus: text(meta.associationStatus) || "unavailable",
            publisherPlatforms: strings(meta.publisherPlatforms),
            targeting: meta.targeting
              ? {
                  ageRanges: strings(targeting.ageRanges),
                  genders: strings(targeting.genders),
                  locations: records(targeting.locations),
                }
              : null,
          }
        : null,
    },
  } as unknown as CompanySignalsProfile;
}

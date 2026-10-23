export type PipelinePublicFundingSource = "tem" | "eura2021" | "leader" | "rural_nonleader";

export type PipelinePublicFundingSourceSummary = {
  source: PipelinePublicFundingSource;
  eventCount: number;
  latestEventDate: string;
  grantedEur: number;
  paidEur: number;
  plannedPublicFundingEur: number;
  realizedPublicFundingEur: number;
  publicFundingEur: number;
};

export type PipelinePublicFundingEvent = {
  source: PipelinePublicFundingSource;
  sourceRecordId: string;
  recordKind: "grant" | "payment" | "project";
  eventDate: string;
  startDate: string;
  endDate: string;
  projectTitle: string;
  authority: string;
  programme: string;
  category: string;
  status: string;
  grantedEur: number;
  paidEur: number;
  plannedPublicFundingEur: number;
  realizedPublicFundingEur: number;
  publicFundingEur: number;
};

export type PipelineCompanyHiringRole = {
  title: string;
  location: string;
  publishedAt: string;
};

export type PipelineCompanyHiringSignal = {
  active: boolean;
  /** Null when activity is inferred from a recruiting contact rather than the full posting feed. */
  activeJobCount: number | null;
  /** Null when activity is inferred from a recruiting contact rather than the full posting feed. */
  openPositionCount: number | null;
  /** Null when the full posting feed has not produced a current hiring state. */
  newJobs7d: number | null;
  /** Null when the full posting feed has not produced a current hiring state. */
  newJobs30d: number | null;
  latestJobAt: string;
  roleFamilies: string[];
  recentRoles: PipelineCompanyHiringRole[];
};

export type PipelineCompanyRecruitingContact = {
  name: string;
  role: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  active: boolean;
  jobTitle: string;
  lastSeenAt: string;
};

export type CompanySignalsProfile = {
  recruitment?: CompanyRecruitment | null;
  hiring: PipelineCompanyHiringSignal | null;
  funding: null | {
    grantedEur: number;
    grantedGrantEur: number;
    grantedLoanEur: number;
    grantedEakrEur: number;
    grantedResearchEur: number;
    paidEur: number;
    paidGrantEur: number;
    paidLoanEur: number;
    paidEakrEur: number;
    paidResearchEur: number;
    projectCount: number;
    activeProjectCount: number;
    waitingProjectCount: number;
    endedProjectCount: number;
    approvedProjectCount: number;
    cancelledProjectCount: number;
    firstYear: number;
    lastYear: number;
    firstPaidYear: number;
    lastPaidYear: number;
    latestProjectDate: string;
    latestProjectStatus: string;
    latestInstrument: string;
    latestSupportType: string;
    latestService: string;
    latestProgramme: string;
    fundingServices: string[];
    programmes: string[];
    projectMunicipalities: string[];
    projectRegions: string[];
  };
  /** Source-scoped Finnish public-funding metrics. Amounts must not be summed across sources. */
  publicFunding: null | {
    eventCount: number;
    latestEventDate: string;
    sources: PipelinePublicFundingSourceSummary[];
    recentEvents: PipelinePublicFundingEvent[];
  };
  currentRatio: number | null;
  quickRatio: number | null;
  advertising: {
    google: null | {
      status: "recent" | "historical" | "none_found";
      checkedAt: string;
      evidenceUrl: string;
      advertiserNames: string[];
      creativeCount: number | null;
      firstShown: string;
      lastShown: string;
      formats: string[];
      advertiserLocations: string[];
      verificationStatuses: string[];
      impressionRange: null | {
        lowerBound: number;
        upperBound: number;
        creativesWithReportedRange: number;
        reportingStart: string;
        reportingEnd: string;
        availabilityDate: string;
      };
      audienceSelectionApproaches: {
        demographicInfo: string[];
        geoLocation: string[];
        contextualSignals: string[];
        customerLists: string[];
        topicsOfInterest: string[];
      };
      topics: string[];
      isFundedByGoogleAdGrants: boolean;
      adFundedBy: string[];
    };
    meta: null | {
      active: boolean | null;
      checkedAt: string;
      evidenceUrl: string;
      facebookPageName: string;
      associationStatus: "corroborated" | "review_needed" | "unavailable";
      activeAdCount: number | null;
      firstDeliveryStart: string;
      latestDeliveryStart: string;
      publisherPlatforms: string[];
      maxSingleAdReach: number | null;
      targeting: null | {
        ageRanges: string[];
        genders: string[];
        locations: Array<{
          name: string;
          type: string;
          excluded: boolean;
        }>;
      };
    };
  };
};

export type CompanyRecruitment = {
  revision: string;
  snapshotAt: string;
  verifiedUntil: string | null;
  status: "verified" | "historical" | "stale";
  activeJobCount: number | null;
  snapshotJobCount: number;
  postings: Array<{
    source: string;
    externalId: string;
    title: string;
    location: string;
    publishedAt: string;
    sourceUrl: string;
    status: "open" | "closed" | "not_reverified";
    verifiedAt: string | null;
  }>;
};

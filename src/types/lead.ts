export type HasWebsite = "yes" | "no";

export type Employees = "none" | "under_5" | "over_5";

export type LegalForm =
  | "legal_entity"
  | "individual_entrepreneur"
  | "self_employed"
  | "individual";

export interface LeadFormData {
  inn: string;
  phone: string;
  email: string;
  hasWebsite: HasWebsite;
  websiteUrl?: string;
  employees: Employees;
  legalForm: LegalForm;
  personalDataConsent: boolean;
  marketingConsent: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  pageUrl?: string;
  /** honeypot anti-spam field, must stay empty */
  website?: string;
}

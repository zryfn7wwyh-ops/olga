import { z } from "zod";
import { siteConfig } from "@/config/site";
import { landingContent } from "@/content/landing";

const errors = landingContent.form.errors;

const innRegex = /^\d{10}(\d{2})?$/;
const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

export const leadFormSchema = z
  .object({
    inn: z.string().min(1, errors.inn).regex(innRegex, errors.inn),
    phone: z.string().min(1, errors.phone).regex(phoneRegex, errors.phone),
    email: z.string().min(1, errors.email).email(errors.email),
    hasWebsite: z.string().optional(),
    websiteUrl: z.string().optional().or(z.literal("")),
    employees: z.string().optional(),
    legalForm: z.string().optional(),
    personalDataConsent: z.boolean(),
    marketingConsent: z.boolean(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    utmContent: z.string().optional(),
    utmTerm: z.string().optional(),
    referrer: z.string().optional(),
    pageUrl: z.string().optional(),
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasWebsite || !["yes", "no"].includes(data.hasWebsite)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errors.hasWebsite,
        path: ["hasWebsite"],
      });
    }
    if (!data.employees || !["none", "under_5", "over_5"].includes(data.employees)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errors.employees,
        path: ["employees"],
      });
    }
    if (
      !data.legalForm ||
      !["legal_entity", "individual_entrepreneur", "self_employed", "individual"].includes(
        data.legalForm
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errors.legalForm,
        path: ["legalForm"],
      });
    }
    if (
      siteConfig.consents.personalDataConsentRequired &&
      !data.personalDataConsent
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errors.personalDataConsent,
        path: ["personalDataConsent"],
      });
    }
    if (siteConfig.consents.marketingConsentRequired && !data.marketingConsent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errors.marketingConsent,
        path: ["marketingConsent"],
      });
    }
  });

export type LeadFormSchema = z.infer<typeof leadFormSchema>;

import { z } from "zod";

export const settingsSchema = z.object({
  camera_access: z.boolean(),
  scan_freq: z.string(),
  enable_alert: z.boolean(), // Single string value
  data_retention: z.enum(["15", "30", "90"]), // Single string value
});

export const challengeSettingSchema = z.object({
  allow_deepanalisis: z.boolean(),
  auto_email: z.boolean(),
  alert_frecuency: z.enum(["daily", "weekly", "monthly", "trimesterly"]), // Single string value
});
export type SettingsForm = z.infer<typeof settingsSchema>;

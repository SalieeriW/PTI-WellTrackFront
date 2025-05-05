import { z } from "zod";

export const settingsSchema = z.object({
  automaticMonitoring: z.boolean(),
  cameraAccess: z.boolean(),
  alertFrequency: z.enum(["immediate", "5", "15"]), // Single string value
  alertDuration: z.string().optional(),
  pauseAlerts: z.enum(["Pause", "Continue"]), // Single string value
  dataRetention: z.enum(["15", "30", "90"]), // Single string value
  lighttheme: z.boolean(),
});

export const challengeSettingSchema = z.object({
  allowInform: z.boolean(),
  deepAnalisis: z.boolean(),
  autoEmail: z.boolean(),
  frequency: z.enum(["daily", "weekly", "monthly", "trimesterly"]), // Single string value
});
export type SettingsForm = z.infer<typeof settingsSchema>;

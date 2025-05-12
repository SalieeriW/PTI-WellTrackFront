import { z } from "zod";

const ChallengeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  progress: z.number(),
  criterion: z.number(),
  metricTypes: z.string(),
  date: z.string().optional(),
  downloadUrl: z.string().optional(),
  fingers: z.number().optional(),
});

export type Challenge = z.infer<typeof ChallengeSchema>;

export default ChallengeSchema;

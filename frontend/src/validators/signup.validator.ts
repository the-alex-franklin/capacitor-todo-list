import { z } from "zod";

export const signup_validator = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

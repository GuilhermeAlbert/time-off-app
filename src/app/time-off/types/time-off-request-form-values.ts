import { z } from "zod";

import { requestSchema } from "../schemas/request-schema";

export type TimeOffRequestFormValues = z.infer<typeof requestSchema> & {
  daysRequested: number;
};

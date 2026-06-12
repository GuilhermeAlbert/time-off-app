import { HcmErrorCode } from "../enums/hcm-error-code";

export type HcmErrorResponse = {
  error: {
    code: HcmErrorCode;
    message: string;
  };
};

/**
 * Types for the validation service API.
 *
 * Refer to the API documentation for details on each property.
 */

export type ValidationRule = {
  id: string;
  name: number | string;
  range: string;
  formula: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type ValidationJobStatus = {
  id: number;
  status: 'pending' | 'completed' | 'failed';
  message: string;
  created_at: string;
  updated_at: string;
};

export type ValidationJob = {
  id: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
  validation_job_status: ValidationJobStatus;
  validation_result?: any;
  validation_rules?: ValidationRule[];
  validation_rule_groups?: any[];
  validation_data_sources?: any[];
};

export type GetValidationJobsOptions = {
  page?: number;
  limit?: number;
  status?: string;
};

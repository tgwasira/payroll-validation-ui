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

export type ValidationJob = {
  id: number;
  slug: string;
  description?: string;
  result?: string;
  created_at: string;
  updated_at: string;
};

export type ValidationRuleGroup = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

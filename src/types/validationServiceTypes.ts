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

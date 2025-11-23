export type ValidationSummaryParams = {
  validationInfos: unknown[];
  validationWarnings: unknown[];
  validationErrors: unknown[];
};

export function getValidationSummary(
  t: (key: string, values?: Record<string, any>) => string,
  {
    validationInfos,
    validationWarnings,
    validationErrors,
  }: ValidationSummaryParams
): string {
  const infoCount = validationInfos.length;
  const warningCount = validationWarnings.length;
  const errorCount = validationErrors.length;

  const parts: string[] = [];

  if (infoCount > 0)
    parts.push(t("validation_jobs.summary.infos", { count: infoCount }));
  if (warningCount > 0)
    parts.push(t("validation_jobs.summary.warnings", { count: warningCount }));
  if (errorCount > 0)
    parts.push(t("validation_jobs.summary.errors", { count: errorCount }));

  if (parts.length === 0) return t("validation_jobs.summary.no_issues");

  if (parts.length === 1) return parts[0];
  if (parts.length === 2)
    return `${parts[0]} ${t("common.general.and")} ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} ${t("common.general.and")} ${
    parts[parts.length - 1]
  }`;
}

import React from "react";

import ValidationJobPage from "./ValidationJobPage";

/**
 * A detail page for a specific validation job.
 */
export default async function ValidationJobDetailPage({
  params,
}: {
  params: Promise<{ validationJobSlug: string }>;
}) {
  const { validationJobSlug } = await params;
  return <ValidationJobPage validationJobSlug={validationJobSlug} />;
}

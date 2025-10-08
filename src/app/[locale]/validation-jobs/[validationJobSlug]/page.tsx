import React from "react";

import ValidationJobDetail from "./ValidationJobDetail";

/**
 * A detail page for a specific validation job.
 */
export default async function ValidationJobDetailPage({
  params,
}: {
  params: Promise<{ validationJobSlug: string }>;
}) {
  const { validationJobSlug } = await params;
  return <ValidationJobDetail validationJobSlug={validationJobSlug} />;
}

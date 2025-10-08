import { useTranslations } from "next-intl";
import React from "react";

import PageSection from "@/react-ui-library/components/containers/page-section/PageSection";
import PageSectionHeader from "@/react-ui-library/components/containers/page-section/PageSectionHeader";
import PageSectionTitle from "@/react-ui-library/components/text/page-section-title/PageSectionTitle";

import styles from "./ValidationJobDetailsSection.module.css";

export default function ValidationJobDetailsSection() {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        {/* Data Sources Section */}
        <PageSection>
          <PageSectionHeader>
            <PageSectionTitle>
              {t("validation_jobs.detail.details.overview.title")}
            </PageSectionTitle>
          </PageSectionHeader>
          <dl className={styles.OverviewGrid}>
            <dt className={styles.OverviewLabel}>
              {t("validation_jobs.detail.details.overview.id")}
            </dt>
            <dd className={styles.OverviewValue}>Validation Job 1</dd>
            <dt className={styles.OverviewLabel}>
              {t("validation_jobs.detail.details.overview.description")}
            </dt>
            <dd className={styles.OverviewValue}>Lorem ipsum dolor sit amet</dd>
          </dl>
        </PageSection>

        {/* General Information Section */}
        <PageSection>Hi</PageSection>
      </div>

      {/* Validation Rules Section */}
      {/*
       * Wrap page section in div because outer div will take height of
       * tallest column
       */}
      <div className="col-span-4">Hi</div>
    </div>
  );
}

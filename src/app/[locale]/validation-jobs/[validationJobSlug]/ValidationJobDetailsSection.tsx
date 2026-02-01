// @ts-nocheck
import {
  PageSection,
  PageSectionSpacing,
} from "@algion-co/react-ui-library";
import { PageSectionHeader } from "@algion-co/react-ui-library";
import {
  Dd,
  Dl,
  Dt,
} from "@algion-co/react-ui-library";
import { FileCard } from "@algion-co/react-ui-library";";
import { useTranslations } from "next-intl";
import React from "react";

import { ValidationRulesList, ValidationRulesListPaddingLR } from "@/components/validation-rules-list/ValidationRulesList";
import { PageSectionTitle } from "@algion-co/react-ui-library";

import { validationServiceApi } from "../../../../../apiConfig";
import styles from "./ValidationJobDetailsSection.module.css";

export default function ValidationJobDetailsSection({ validationJob }) {
  const t = useTranslations();
  // console.log(validationJob);

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
          <Dl columns={2}>
            <Dt>{t("validation_jobs.detail.details.overview.id")}</Dt>
            <Dd>{validationJob?.slug}</Dd>
            <Dt className={styles.OverviewLabel}>
              {t("validation_jobs.detail.details.overview.description")}
            </Dt>
            <Dd className={styles.OverviewValue}>
              {validationJob?.description}
            </Dd>
            <Dt>{t("validation_jobs.detail.details.overview.last_run")}</Dt>
            <Dd>{validationJob?.validationJobStatus?.createdAt}</Dd>
            <Dt>{t("validation_jobs.detail.details.overview.status")}</Dt>
            <Dd>Success</Dd>
          </Dl>
        </PageSection>

        {/* General Information Section */}
        <PageSection>
          <PageSectionHeader>
            <PageSectionTitle>
              {t("validation_jobs.detail.details.data_sources.title")}
            </PageSectionTitle>
          </PageSectionHeader>
          <ul>
            {validationJob?.validationDataSources.map((dataSource) => {
              if (dataSource.type === "file") {
                return (
                  <FileCard
                    as="li"
                    fileName={dataSource?.validationFileRecord?.fileName}
                    displayFileName={
                      dataSource?.validationFileRecord?.originalFileName
                    }
                    fileSize={dataSource?.validationFileRecord?.fileSize}
                    key={dataSource.id}
                    downloadHref={`${validationServiceApi.baseURL}${
                      validationServiceApi.endpoints.downloadFile
                    }/${dataSource?.validationFileRecord?.filePath ?? ""}`}
                  />
                );
              }
            })}
          </ul>
        </PageSection>
      </div>

      {/* Validation Rules Section */}
      {/*
       * Wrap page section in div because outer div will take height of
       * tallest column
       */}
      <div className="col-span-4">
        <PageSection padding="none">
          <PageSectionSpacing padding="top">
            <ValidationRulesListPaddingLR>
              <PageSectionHeader>
                <PageSectionTitle>
                  {t("validation_jobs.detail.details.validation_rules.title")}
                </PageSectionTitle>
              </PageSectionHeader>
            </ValidationRulesListPaddingLR>
          </PageSectionSpacing>

          <PageSectionSpacing padding="bottom">
            <ValidationRulesList
              validationRules={validationJob.validationRules}
            />
          </PageSectionSpacing>
        </PageSection>
      </div>
    </div>
  );
}

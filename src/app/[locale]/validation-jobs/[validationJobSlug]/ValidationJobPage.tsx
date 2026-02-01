// @ts-nocheck
"use client";

import PageContent from "@algion-co/react-ui-library";
import PageSection from "@algion-co/react-ui-library";
import PageHeader from "@algion-co/react-ui-library";
import { PageTabGroup, PageTabList } from "@algion-co/react-ui-library";
import Table from "@algion-co/react-ui-library";
import Tab2 from "@algion-co/react-ui-library";
import {
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@algion-co/react-ui-library";
import PageTitleAndBackButton from "@algion-co/react-ui-library";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { useValidationJobs } from "@/hooks/api/validation-service/useValidationJob";

import ValidationJobDetailsSection from "./ValidationJobDetailsSection";
import ValidationResultsTable from "./ValidationResultsTable";

export default function ValidationJobPage({ validationJobSlug }) {
  const t = useTranslations();
  const { loading, error, validationJob, getValidationJob } =
    useValidationJobs();

  // TODO: Error handling
  // TODO: Loading state
  useEffect(() => {
    getValidationJob(validationJobSlug);
  }, []);

  return (
    <>
      <PageContent>
        <PageHeader marginBottom="tabs">
          <PageTitleAndBackButton
            title={t("validation_jobs.detail.page_title", {
              slug: validationJobSlug,
            })}
          />
        </PageHeader>
      </PageContent>

      <PageContent>
        <PageTabGroup>
          <PageTabList>
            <Tab2>{t("validation_jobs.detail.tabs.issues")}</Tab2>
            <Tab2>{t("validation_jobs.detail.tabs.details")}</Tab2>
          </PageTabList>
          <TabPanels>
            <TabPanel>
              <PageSection padding="none">
                <ValidationResultsTable
                  validationResult={validationJob?.validationResult}
                />
              </PageSection>
            </TabPanel>
            <TabPanel>
              <ValidationJobDetailsSection validationJob={validationJob} />
            </TabPanel>
          </TabPanels>
        </PageTabGroup>
      </PageContent>
    </>
  );
}

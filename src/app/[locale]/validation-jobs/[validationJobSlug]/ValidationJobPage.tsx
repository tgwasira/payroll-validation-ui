// @ts-nocheck
"use client";

import PageContent from "@algion-co/react-ui-library/components/containers/page-content/PageContent";
import PageSection from "@algion-co/react-ui-library/components/containers/page-section/PageSection";
import PageHeader from "@algion-co/react-ui-library/components/page-elements/page-header/PageHeader";
import {
  PageTabGroup,
  PageTabList,
} from "@algion-co/react-ui-library/components/page-elements/page-tabs/PageTabs";
import Table from "@algion-co/react-ui-library/components/tables/table/Table";
import Tab2 from "@algion-co/react-ui-library/components/tabs/Tab2/Tab2";
import {
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@algion-co/react-ui-library/components/tabs/Tabs";
import PageTitleAndBackButton from "@algion-co/react-ui-library/components/text/page-title-and-back-button/PageTitleAndBackButton";
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

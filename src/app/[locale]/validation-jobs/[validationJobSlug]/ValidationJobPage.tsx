"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { useValidationJob } from "@/hooks/api/validation-service/useValidationJob";
import PageContent from "@/react-ui-library/components/containers/page-content/PageContent";
import PageSection from "@/react-ui-library/components/containers/page-section/PageSection";
import PageHeader from "@/react-ui-library/components/page-elements/page-header/PageHeader";
import {
  PageTabGroup,
  PageTabList,
} from "@/react-ui-library/components/page-elements/page-tabs/PageTabs";
import Table from "@/react-ui-library/components/tables/table/Table";
import Tab2 from "@/react-ui-library/components/tabs/Tab2/Tab2";
import {
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@/react-ui-library/components/tabs/Tabs";
import PageTitleAndBackButton from "@/react-ui-library/components/text/page-title-and-back-button/PageTitleAndBackButton";

import ValidationJobDetailsSection from "./ValidationJobDetailsSection";
import ValidationResultsTable from "./ValidationResultsTable";

export default function ValidationJobPage({ validationJobSlug }) {
  const t = useTranslations();
  const { loading, error, validationJob, getValidationJob } =
    useValidationJob();

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
            <Tab2>{t("validation_jobs.detail.tabs.results")}</Tab2>
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

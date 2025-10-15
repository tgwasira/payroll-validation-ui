"use client";

import { StackIcon } from "@phosphor-icons/react/dist/ssr";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import routes from "@/app/routes";
import ValidationRuleTag from "@/components/validation-rule-tag/ValidationRuleTag";
import { useValidationJobs } from "@/hooks/api/validation-service/useValidationJobs";
import Button from "@/react-ui-library/components/buttons/button/Button";
import Checkbox from "@/react-ui-library/components/checkboxes/Checkbox";
import PageContent from "@/react-ui-library/components/containers/page-content/PageContent";
import PageSection from "@/react-ui-library/components/containers/page-section/PageSection";
import Input from "@/react-ui-library/components/forms/inputs/Input";
import SearchInput from "@/react-ui-library/components/forms/inputs/search-input/SearchInput";
import MenuItemsList from "@/react-ui-library/components/menu/MenuItemsList";
import PageHeader from "@/react-ui-library/components/page-elements/page-header/PageHeader";
import Table from "@/react-ui-library/components/tables/table/Table";
import TableSearchbar from "@/react-ui-library/components/tables/table-searchbar/TableSearchbar";
import TableToolbar from "@/react-ui-library/components/tables/table-toolbar/TableToolbar";
import getActionsColumn from "@/react-ui-library/components/tables/utils/getActionsColumn";
import getCheckboxColumn from "@/react-ui-library/components/tables/utils/getCheckboxColumn";
import Tag from "@/react-ui-library/components/tags/tag/Tag";
import TagGroup from "@/react-ui-library/components/tags/tag-group/TagGroup";
import PageTitle from "@/react-ui-library/components/text/page-title/PageTitle";
import MSExcelFileIcon from "@/react-ui-library/icons/MSExcelFileIcon";
import MSExcelIcon from "@/react-ui-library/icons/MSExcelIcon";
import { getFileExtension } from "@/react-ui-library/utils/fileUtils";

import StatusIcon from "./StatusIscon";

type Person = {
  validationDataSources: any[];
  validationRules: any[];
  age: number;
  visits: number;
  status: string;
  progress: number;
};

export default function ValidationJobsList() {
  const t = useTranslations();

  // === Table ===
  const columnHelper = createColumnHelper<Person>();

  const columns = [
    getCheckboxColumn("checkbox", columnHelper),
    columnHelper.accessor("validationDataSources", {
      header: t("validation_jobs.list.table.data_sources_column_heading"),
      cell: (info) => {
        const validationDataSources = info.getValue();
        console.log(validationDataSources);

        return validationDataSources.map((validationDataSource) => (
          <div
            key={validationDataSource.id}
            className="icon-large-and-text-container"
          >
            {validationDataSource.type === "file" &&
              (() => {
                const fileExtension = getFileExtension(
                  validationDataSource.validationFileRecord.fileName
                );

                if (fileExtension === "xlsx" || fileExtension === "xls") {
                  return (
                    <>
                      <MSExcelFileIcon className="icon-large" />
                      {validationDataSource.validationFileRecord.fileName}
                    </>
                  );
                } else if (fileExtension === "csv") {
                  return (
                    <>{validationDataSource.validationFileRecord.fileName}</>
                  );
                } else {
                  return (
                    <>{validationDataSource.validationFileRecord.fileName}</>
                  );
                }
              })()}
          </div>
        ));
      },
      meta: {
        style: { width: "30%" },
      },
    }),
    columnHelper.accessor("validationRules", {
      header: t("validation_jobs.list.table.validation_rules_column_heading"),
      cell: (info) => {
        const validationRules = info.getValue();

        return (
          <TagGroup>
            {validationRules.map((validationRule) => (
              <ValidationRuleTag
                key={validationRule.id}
                name={validationRule.name}
                type={validationRule.type}
              />
            ))}
          </TagGroup>
        );
      },
      meta: {
        style: { width: "30%" },
      },
    }),
    // TODO: Change to last run
    columnHelper.accessor("createdAt", {
      header: t("validation_jobs.list.table.created_at_column_heading"),
      meta: {
        style: { width: "30%" },
      },
    }),
    columnHelper.accessor("status", {
      header: t("validation_jobs.list.table.status_column_heading"),
      cell: (info) => {
        const status = info.getValue();

        return <StatusIcon status={status} />;
      },
      meta: {
        style: {
          textAlign: "center",
          // This is actually max-width = 20% and min-width = wrap content
          width: "10%",
        },
      },
    }),
    getActionsColumn("actions", columnHelper, () => (
      <MenuItemsList
        sections={[
          {
            options: [
              {
                id: "edit",
                label: "Edit",
                props: {
                  as: Link,
                  href: "/",
                },
              },
            ],
          },
        ]}
        // options={[
        //   {
        //     id: "edit",
        //     label: "Edit",
        //     onClick: (option) => {
        //       console.log(option);
        //     },
        //   },
        //   {
        //     id: "delete",
        //     label: "Delete",
        //     onClick: (option) => {
        //       console.log(option);
        //     },
        //   },
        // ]}
        padded={true}
      />
    )),
  ];

  const filterOptions = [
    {
      label: t(
        "validation_jobs.list.validation_jobs_table_toolbar.filter_options.all_filter_option_label"
      ),
      onClick: () => {
        console.log("All clicked");
      },
    },
    {
      label: t(
        "validation_jobs.list.validation_jobs_table_toolbar.filter_options.successful_filter_option_label"
      ),
      onClick: () => {
        console.log("Successful clicked");
      },
    },
  ];

  // === Data ===
  const { loading, error, validationJobs, getValidationJobs } =
    useValidationJobs();

  // Fetch validation jobs on component mount
  useEffect(() => {
    getValidationJobs();
  }, []);

  return (
    <PageContent>
      <PageHeader>
        <PageTitle>
          {t("validation_jobs.list.validation_jobs_list_page_title")}
        </PageTitle>
        <Button href={routes.validationJobs.new}>
          <div className="text-as-icon-large">+</div>
          {t("validation_jobs.list.new_validation_job_button_label")}
        </Button>
      </PageHeader>
      <PageSection padding={"none"}>
        {/* Table Toolbar */}
        <TableToolbar
          filterOptions={filterOptions}
          searchbarPlaceholder={t(
            "validation_jobs.list.validation_jobs_table_toolbar.search_validation_jobs_placeholder"
          )}
        />

        {/* Validation Jobs Table */}
        <Table
          data={validationJobs}
          columns={columns}
          getHref={(row) =>
            `${routes.validationJobs.base}/${row.original["slug"]}`
          }
        />

        {/* Pagination */}
        {/* <Pagination /> */}
      </PageSection>
    </PageContent>
  );
}

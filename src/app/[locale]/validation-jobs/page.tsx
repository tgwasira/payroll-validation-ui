"use client";

import { StackIcon } from "@phosphor-icons/react/dist/ssr";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";

import routes from "@/app/routes";
import Button from "@/react-ui-library/components/buttons/button/Button";
import Checkbox from "@/react-ui-library/components/checkboxes/Checkbox";
import PageContent from "@/react-ui-library/components/containers/page-content/PageContent";
import PageSection from "@/react-ui-library/components/containers/page-section/PageSection";
import PageHeader from "@/react-ui-library/components/headers/page-header/PageHeader";
import Input from "@/react-ui-library/components/inputs/Input";
import SearchInput from "@/react-ui-library/components/inputs/search-input/SearchInput";
import MenuItemsList from "@/react-ui-library/components/menu/MenuItemsList";
import Table from "@/react-ui-library/components/tables/table/Table";
import TableSearchbar from "@/react-ui-library/components/tables/table-searchbar/TableSearchbar";
import TableToolbar from "@/react-ui-library/components/tables/table-toolbar/TableToolbar";
import getActionsColumn from "@/react-ui-library/components/tables/utils/getActionsColumn";
import getCheckboxColumn from "@/react-ui-library/components/tables/utils/getCheckboxColumn";
import Tag from "@/react-ui-library/components/tags/tag/Tag";
import TagGroup from "@/react-ui-library/components/tags/tag-group/TagGroup";
import PageTitle from "@/react-ui-library/components/text/page-title/PageTitle";
import MSExcelIcon from "@/react-ui-library/icons/MSExcelIcon";

import StatusIcon from "./StatusIscon";

type Person = {
  dataSources: any[];
  validationRules: any[];
  age: number;
  visits: number;
  status: string;
  progress: number;
};

export default function ValidationJobsList() {
  const t = useTranslations();

  const defaultData: Person[] = [
    {
      dataSources: [{ id: 1, type: "ms-excel", name: "File 1.xls" }],
      validationRules: [
        { id: 1, name: "id-is-required", type: "validation-rule" },
      ],
      status: "validation-error",
      age: 24,
      visits: 100,
      // status: "In Relationship",
      progress: 50,
    },
    {
      dataSources: [{ id: 20, type: "ms-excel", name: "File 2.xls" }],
      validationRules: [
        { id: 2, name: "id-is-required", type: "validation-rule" },
      ],
      status: "validation-warning",
    },
    {
      dataSources: [{ id: 2, type: "ms-excel", name: "File 2.xls" }],
      validationRules: [
        { id: 2, name: "id-is-required", type: "validation-rule" },
      ],
      status: "cancelled",
    },
    {
      dataSources: [{ id: 3, type: "ms-excel", name: "File 3.xls" }],
      validationRules: [
        { id: 3, name: "id-is-unique", type: "validation-rule-group" },
        { id: 30, name: "id-is-unique", type: "validation-rule" },
      ],
      status: "success",
    },
  ];

  const columnHelper = createColumnHelper<Person>();

  const dataSourceIcons = {};

  const columns = [
    getCheckboxColumn("checkbox", columnHelper),
    columnHelper.accessor("dataSources", {
      header: t(
        "validation_jobs.validation_jobs_list.validation_jobs_table.data_sources_column_heading"
      ),
      cell: (info) => {
        const dataSources = info.getValue();

        return dataSources.map((dataSource) => (
          <div key={dataSource.id} className="icon-large-and-text-container">
            <MSExcelIcon className="icon-large" />
            {dataSource.name}
          </div>
        ));
      },
      meta: {
        style: { width: "40%" },
      },
    }),
    columnHelper.accessor("validationRules", {
      header: t(
        "validation_jobs.validation_jobs_list.validation_jobs_table.validation_rules_column_heading"
      ),
      cell: (info) => {
        const validationRules = info.getValue();

        return (
          <TagGroup>
            {validationRules.map((validationRule) => (
              <Tag key={validationRule.id}>
                {validationRule.type === "validation-rule-group" && (
                  <StackIcon className="icon-medium" />
                )}
                {validationRule.name}
              </Tag>
            ))}
          </TagGroup>
        );
      },
      meta: {
        style: { width: "40%" },
      },
    }),
    columnHelper.accessor("status", {
      header: t(
        "validation_jobs.validation_jobs_list.validation_jobs_table.status_column_heading"
      ),
      cell: (info) => {
        const status = info.getValue();

        return <StatusIcon status={status} />;
      },
      meta: {
        style: {
          textAlign: "center",
          // This is actually max-width = 20% and min-width = wrap content
          width: "20%",
        },
      },
    }),
    getActionsColumn("actions", columnHelper, () => (
      <MenuItemsList
        options={[
          {
            id: "edit",
            label: "Edit",
            onClick: (option) => {
              console.log(option);
            },
          },
          {
            id: "delete",
            label: "Delete",
            onClick: (option) => {
              console.log(option);
            },
          },
        ]}
        padded={true}
      />
    )),
  ];

  const filterOptions = [
    {
      label: t(
        "validation_jobs.validation_jobs_list.validation_jobs_table_toolbar.filter_options.all_filter_option_label"
      ),
      onClick: () => {
        console.log("All clicked");
      },
    },
    {
      label: t(
        "validation_jobs.validation_jobs_list.validation_jobs_table_toolbar.filter_options.successful_filter_option_label"
      ),
      onClick: () => {
        console.log("Successful clicked");
      },
    },
  ];

  const [data, setData] = useState(() => [...defaultData]);

  return (
    <PageContent>
      <PageHeader>
        <PageTitle>
          {t(
            "validation_jobs.validation_jobs_list.validation_jobs_list_page_title"
          )}
        </PageTitle>
        <Button href={routes.validationJobs.newValidationJob}>
          <div className="text-as-icon-large">+</div>
          {t(
            "validation_jobs.validation_jobs_list.new_validation_job_button_label"
          )}
        </Button>
      </PageHeader>
      <PageSection>
        {/* Table Toolbar */}
        <TableToolbar
          filterOptions={filterOptions}
          searchbarPlaceholder={t(
            "validation_jobs.validation_jobs_list.validation_jobs_table_toolbar.search_validation_jobs_placeholder"
          )}
        />

        {/* Validation Jobs Table */}
        <Table data={data} columns={columns} />

        {/* Pagination */}
        {/* <Pagination /> */}
      </PageSection>
    </PageContent>
  );
}

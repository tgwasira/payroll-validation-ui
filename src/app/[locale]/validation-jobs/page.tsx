"use client";

import { StackIcon } from "@phosphor-icons/react/dist/ssr";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";

import Button from "@/react-ui-library/components/buttons/button/Button";
import Checkbox from "@/react-ui-library/components/checkboxes/Checkbox";
import PageContent from "@/react-ui-library/components/containers/page-content/PageContent";
import PageSection from "@/react-ui-library/components/containers/page-section/PageSection";
import TextInput from "@/react-ui-library/components/inputs/text-input/TextInput";
import PageHeader from "@/react-ui-library/components/page-header/PageHeader";
import Searchbar from "@/react-ui-library/components/searchbar/Searchbar";
import Table from "@/react-ui-library/components/tables/table/Table";
import TableSearchbar from "@/react-ui-library/components/tables/table-searchbar/TableSearchbar";
import TableToolbar from "@/react-ui-library/components/tables/table-toolbar/TableToolbar";
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

export default function ValidationJobs() {
  const t = useTranslations("validation_jobs");

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
    // TODO: Move to utility
    columnHelper.display({
      id: "checkbox",
      header: (info) => (
        <Checkbox
          id={`validationJobsTableHeaderCheckbox`}
          checked={info.table.getIsAllRowsSelected()}
          indeterminate={info.table.getIsSomeRowsSelected()}
          onChange={info.table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: (info) => (
        <Checkbox
          id={`validationJobsTableBodyCheckbox-${info.row.index}`}
          checked={info.row.getIsSelected()}
          disabled={!info.row.getCanSelect()}
          onChange={info.row.getToggleSelectedHandler()}
        />
      ),
      meta: {
        // If width of all other columns sums up to 100%, the width of the
        // current column will just wrap the content
        style: { paddingLeft: "16px", paddingRight: "16px" },
      },
    }),
    columnHelper.accessor("dataSources", {
      header: t("validation_jobs_table.data_sources_column_heading"),
      cell: (info) => {
        const dataSources = info.getValue();

        return dataSources.map((dataSource) => (
          <div key={dataSource.id} className="icon-base-and-text-container">
            <MSExcelIcon className="icon-base" />
            {dataSource.name}
          </div>
        ));
      },
      meta: {
        style: { width: "45%" },
      },
    }),
    columnHelper.accessor("validationRules", {
      header: t("validation_jobs_table.validation_rules_column_heading"),
      cell: (info) => {
        const validationRules = info.getValue();

        return (
          <TagGroup>
            {validationRules.map((validationRule) => (
              <Tag key={validationRule.id}>
                {validationRule.type === "validation-rule-group" && (
                  <StackIcon className="icon-small" />
                )}
                {validationRule.name}
              </Tag>
            ))}
          </TagGroup>
        );
      },
      meta: {
        style: { width: "45%" },
      },
    }),
    columnHelper.accessor("status", {
      header: t("validation_jobs_table.status_column_heading"),
      cell: (info) => {
        const status = info.getValue();

        return <StatusIcon status={status} />;
      },
      meta: {
        style: {
          textAlign: "center",
          // This is actually max-width = 10% and min-width = wrap content
          width: "10%",
        },
      },
    }),

    // columnHelper.accessor("dataSources", {
    //   header: t("validation_jobs_table.data_sources_column_heading"),
    //   cell: (info) => info.getValue(),
    //   footer: (info) => info.column.id,
    // }),
    // columnHelper.accessor((row) => row.lastName, {
    //   id: "lastName",
    //   cell: (info) => <i>{info.getValue()}</i>,
    //   header: () => <span>Last Name</span>,
    //   footer: (info) => info.column.id,
    // }),
    // columnHelper.accessor("age", {
    //   header: () => "Age",
    //   cell: (info) => info.renderValue(),
    //   footer: (info) => info.column.id,
    // }),
    // columnHelper.accessor("visits", {
    //   header: () => <span>Visits</span>,
    //   footer: (info) => info.column.id,
    // }),
    // columnHelper.accessor("status", {
    //   header: "Status",
    //   footer: (info) => info.column.id,
    // }),
    // columnHelper.accessor("progress", {
    //   header: "Profile Progress",
    //   footer: (info) => info.column.id,
    // }),
  ];

  const [data, _setData] = useState(() => [...defaultData]);

  return (
    <PageContent>
      <PageHeader>
        <PageTitle>{t("validation_jobs_page_title")}</PageTitle>
        <Button>
          <div className="text-icon-base">+</div>
          {t("new_validation_job_button_label")}
        </Button>
      </PageHeader>
      <PageSection>
        {/* Table Toolbar */}
        <TableToolbar
          searchbarPlaceholder={t(
            "validation_jobs_table_toolbar.search_validation_jobs_placeholder"
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

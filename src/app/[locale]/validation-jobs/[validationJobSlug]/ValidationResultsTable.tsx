import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import React from "react";

import MenuItemsList from "@/react-ui-library/components/menu/MenuItemsList";
import Table from "@/react-ui-library/components/tables/table/Table";
import TableToolbar from "@/react-ui-library/components/tables/table-toolbar/TableToolbar";
import getActionsColumn from "@/react-ui-library/components/tables/utils/getActionsColumn";
import getCheckboxColumn from "@/react-ui-library/components/tables/utils/getCheckboxColumn";
import Tag from "@/react-ui-library/components/tags/tag/Tag";
import { toSpreadsheetRange } from "@/react-ui-library/utils/spreadsheetUtils";

export default function ValidationResultsTable({ validationResult }) {
  const t = useTranslations();

  // --- Table ---
  const columnHelper = createColumnHelper<ValidationResult>();

  const columns = [
    getCheckboxColumn("checkbox", columnHelper),
    columnHelper.accessor(
      (row) => toSpreadsheetRange(row.rowIndex, row.columnIndex),
      {
        id: "range",
        header: t("validation_jobs.detail.issues.table.range_column_heading"),
        meta: {
          style: { width: "20%" },
        },
      }
    ),
    columnHelper.accessor((row) => row.validationRule.name, {
      id: "rule",
      header: t("validation_jobs.detail.issues.table.rule_column_heading"),
      meta: {
        className: "truncate-overflow",
        style: { width: "40%" },
      },
    }),
    columnHelper.accessor((row) => row.validationRule.level, {
      id: "issue",
      header: t("validation_jobs.detail.issues.table.issue_column_heading"),
      cell: (info) => {
        const level = info.getValue();

        if (level === "info")
          return (
            <Tag type="info">
              {t("validation_jobs.detail.issues.table.level.info")}
            </Tag>
          );
        else if (level === "warning")
          return (
            <Tag type={"warning"}>
              {t("validation_jobs.detail.issues.table.level.warning")}
            </Tag>
          );
        else if (level === "error")
          return (
            <Tag type={"error"}>
              {t("validation_jobs.detail.issues.table.level.error")}
            </Tag>
          );
        else return <></>;
      },
      meta: {
        style: { width: "20%" },
      },
    }),
    columnHelper.accessor("value", {
      header: t("validation_jobs.detail.issues.table.value_column_heading"),
      meta: {
        style: { width: "20%" },
      },
    }),
    // columnHelper.display({
    //   header: t(
    //     "validation_jobs.detail.issues.table.correction_column_heading"
    //   ),
    //   meta: {
    //     style: { width: "30%" },
    //   },
    // }),

    getActionsColumn("actions", columnHelper, () => (
      <MenuItemsList
        //   TODO: Do translation
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
        "validation_jobs.detail.issues.table.toolbar.filter_options.all_filter_option_label"
      ),
      onClick: () => {
        console.log("All clicked");
      },
    },
    {
      label: t(
        "validation_jobs.detail.issues.table.toolbar.filter_options.infos_filter_option_label"
      ),
      onClick: () => {
        console.log("Info clicked");
      },
    },
    {
      label: t(
        "validation_jobs.detail.issues.table.toolbar.filter_options.warnings_filter_option_label"
      ),
      onClick: () => {
        console.log("Warning clicked");
      },
    },
    {
      label: t(
        "validation_jobs.detail.issues.table.toolbar.filter_options.errors_filter_option_label"
      ),
      onClick: () => {
        console.log("Error clicked");
      },
    },
  ];

  // --- Data ---
  // TODO: Consider querying and joining the tables directly and then
  // implementing pagination, sorting, and filtering on the server side.
  // Could also do that in the request for validation job details and include
  // validationIssues field then validation issue page limit etc. would be
  // argument of that request.
  const validationIssues = [
    ...(validationResult?.validationInfos ?? []),
    ...(validationResult?.validationWarnings ?? []),
    ...(validationResult?.validationErrors ?? []),
  ];

  console.log("validationIssues", validationIssues);

  return (
    <>
      <TableToolbar
        filterOptions={filterOptions}
        searchbarPlaceholder={t(
          "validation_jobs.detail.issues.table.search_placeholder"
        )}
      />
      <Table data={validationIssues} columns={columns} />
    </>
  );
}

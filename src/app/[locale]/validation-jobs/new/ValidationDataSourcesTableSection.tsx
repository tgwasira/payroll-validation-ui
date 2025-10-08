import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Button from "@/react-ui-library/components/buttons/button/Button";
import PageSection from "@/react-ui-library/components/containers/page-section/PageSection";
import PageSubsection from "@/react-ui-library/components/containers/page-subsection/PageSubsection";
import PageSectionHeader from "@/react-ui-library/components/containers/page-section/PageSectionHeader";
import Table from "@/react-ui-library/components/tables/table/Table";
import getCheckboxColumn from "@/react-ui-library/components/tables/utils/getCheckboxColumn";
import PageSectionTitle from "@/react-ui-library/components/text/page-section-title/PageSectionTitle";
import MSExcelIcon from "@/react-ui-library/icons/MSExcelIcon";

/**
 * The form section for data sources in the new validation job form.
 */
export default function ValidationDataSourcesTableSection({
  setDataSourceDialogOpen,
  dataSourcesTableData,
}) {
  const t = useTranslations();

  // === Data Sources Table ===
  const columnHelper = createColumnHelper<ValidationFile>();

  const columns = [
    getCheckboxColumn("checkbox", columnHelper),
    columnHelper.accessor(
      (row) => {
        if (row.type === "file") {
          return row.validationFileRecord.filename;
        }
        return "Unknown data source type";
      },
      {
        id: "dataSourceName",
        header: t(
          "validation_jobs.new.data_sources_table.data_source_column_heading"
        ),
        cell: (info) => {
          const dataSourceName = info.getValue();

          return (
            <div className="icon-large-and-text-container">
              <MSExcelIcon className="icon-large" />
              {dataSourceName}
            </div>
          );
        },
        meta: {
          style: { width: "100%" },
        },
      }
    ),
  ];

  return (
    <PageSection marginBottom={true}>
      <PageSectionHeader>
        <PageSectionTitle>
          {t("validation_jobs.new.data_sources_section_title")}
        </PageSectionTitle>
        <Button
          variant="tertiary"
          onClick={() => setDataSourceDialogOpen(true)}
        >
          <div className="text-as-icon-large">+</div>
          {t("validation_jobs.new.add_data_source_button_label")}
        </Button>
      </PageSectionHeader>
      <PageSubsection marginBottom="normal">
        <Table
          data={dataSourcesTableData}
          columns={columns}
          headerBorderTop={false}
        />
      </PageSubsection>
    </PageSection>
  );
}

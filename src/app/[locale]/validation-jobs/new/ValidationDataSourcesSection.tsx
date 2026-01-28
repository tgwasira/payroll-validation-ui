import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Button from "@algion-co/react-ui-library/components/buttons/button/Button";
import PageSection from "@algion-co/react-ui-library/components/containers/page-section/PageSection";
import PageSectionHeader from "@algion-co/react-ui-library/components/containers/page-section/PageSectionHeader";
import PageSubsection from "@algion-co/react-ui-library/components/containers/page-subsection/PageSubsection";
import EmptyState1 from "@algion-co/react-ui-library/components/empty-states/EmptyState1";
import FileCard from "@algion-co/react-ui-library/components/files/file-card/FileCard";
import { List } from "@algion-co/react-ui-library/components/lists/List";
import Table from "@algion-co/react-ui-library/components/tables/table/Table";
import getCheckboxColumn from "@algion-co/react-ui-library/components/tables/utils/getCheckboxColumn";
import PageSectionTitle from "@algion-co/react-ui-library/components/text/page-section-title/PageSectionTitle";
import MSExcelIcon from "@algion-co/react-ui-library/icons/MSExcelIcon";

import { validationServiceApi } from "../../../../../apiConfig";

/**
 * The form section for data sources in the new validation job form.
 */
export default function ValidationDataSourcesSection({
  setDataSourceDialogOpen,
  // TODO: Rename variable
  dataSourcesTableData,
}) {
  const t = useTranslations();

  // === Data Sources Table ===
  const columnHelper = createColumnHelper<ValidationFile>();

  // const columns = [
  //   getCheckboxColumn("checkbox", columnHelper),
  //   columnHelper.accessor(
  //     (row) => {
  //       if (row.type === "file") {
  //         return row.validationFileRecord.filename;
  //       }
  //       return "Unknown data source type";
  //     },
  //     {
  //       id: "dataSourceName",
  //       header: t(
  //         "validation_jobs.new.data_sources_table.data_source_column_heading"
  //       ),
  //       cell: (info) => {
  //         const dataSourceName = info.getValue();

  //         return (
  //           <div className="icon-large-and-text-container">
  //             <MSExcelIcon className="icon-large" />
  //             {dataSourceName}
  //           </div>
  //         );
  //       },
  //       meta: {
  //         style: { width: "100%" },
  //       },
  //     }
  //   ),
  // ];

  const renderAddDataSourceButton = () => (
    <Button variant="secondary" onClick={() => setDataSourceDialogOpen(true)}>
      <div className="text-as-icon-large">+</div>
      {t("validation_jobs.new.add_data_source_button_label")}
    </Button>
  );

  return (
    <PageSection marginBottom={true}>
      <PageSectionHeader>
        <PageSectionTitle>
          {t("validation_jobs.new.data_sources_section_title")}
        </PageSectionTitle>
        {renderAddDataSourceButton()}
      </PageSectionHeader>
      {(!dataSourcesTableData || dataSourcesTableData.length === 0) && (
        <EmptyState1
          heading={t(
            "validation_jobs.new.data_sources_page_section.empty_state_heading",
          )}
          renderButton1={renderAddDataSourceButton}
          padding="small"
        />
      )}
      <List gap="xlarge">
        {dataSourcesTableData?.map((dataSource, index) => {
          return dataSource.type === "file" ? (
            <FileCard
              key={index}
              as="li"
              fileName={dataSource.validationFileRecord.fileName}
              displayFileName={dataSource.validationFileRecord.originalFileName}
              fileSize={dataSource.validationFileRecord.fileSize}
              // Create a download link for the file in memory
              downloadHref={`${validationServiceApi.baseURL}${
                validationServiceApi.endpoints.downloadFile
              }/${dataSource?.validationFileRecord?.filePath ?? ""}`}
              onRemoveButtonClick={() => {
                console.log(`Remove file: ${file.name}`);
              }}
            />
          ) : dataSource.type === "api" ? (
            <div>api</div>
          ) : null;
        })}
      </List>
      {/* <PageSubsection marginBottom="normal"> */}
      {/* <Table
          data={dataSourcesTableData}
          columns={columns}
          headerBorderTop={false}
        /> */}
      {/* </PageSubsection> */}
    </PageSection>
  );
}

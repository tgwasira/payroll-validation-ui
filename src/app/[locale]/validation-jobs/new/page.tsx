"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import Button from "@/react-ui-library/components/buttons/button/Button";
import ButtonGroup from "@/react-ui-library/components/buttons/button-group/ButtonGroupContainer";
import PageContent from "@/react-ui-library/components/containers/page-content/PageContent";
import PageSection, {
  PageSectionPadding,
  // PageSectionPadding,
  PageSectionPaddingLR,
  PageSectionPaddingTB,
} from "@/react-ui-library/components/containers/page-section/PageSection";
import PageSubsection from "@/react-ui-library/components/containers/page-subsection/PageSubsection";
import RightAlignedContent from "@/react-ui-library/components/containers/right-aligned-content/RightAlignedContent";
import TextAreaField from "@/react-ui-library/components/forms/form-fields/text-area-field/TextAreaField";
import { Form } from "@/react-ui-library/components/forms/Forms";
import PageHeader from "@/react-ui-library/components/headers/page-header/PageHeader";
import SectionHeader from "@/react-ui-library/components/headers/section-header/SectionHeader";
import { Menu } from "@/react-ui-library/components/menu/Menu";
import { MenuButton } from "@/react-ui-library/components/menu/MenuButton";
import { MenuDropdown } from "@/react-ui-library/components/menu/MenuDropdown";
import MenuItemsList from "@/react-ui-library/components/menu/MenuItemsList";
import Table from "@/react-ui-library/components/tables/table/Table";
import getCheckboxColumn from "@/react-ui-library/components/tables/utils/getCheckboxColumn";
import PageTitle from "@/react-ui-library/components/text/page-title/PageTitle";
import PageTitleAndBackButton from "@/react-ui-library/components/text/page-title-and-back-button/PageTitleAndBackButton";
import SectionTitle from "@/react-ui-library/components/text/section-title/SectionTitle";
import MSExcelIcon from "@/react-ui-library/icons/MSExcelIcon";
import PlusIcon from "@/react-ui-library/icons/PlusIcon";

import DataSourceDialog from "./DataSourceDialog";
import ValidationRulesFormSection from "./ValidationRulesFormSection";

export default function NewValidationJob() {
  const t = useTranslations();

  const defaultData: ValidationFile[] = [
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
  ];

  const columnHelper = createColumnHelper<ValidationFile>();

  const columns = [
    getCheckboxColumn("checkbox", columnHelper),
    columnHelper.accessor("dataSources", {
      header: t(
        "validation_jobs.validation_jobs_new.data_sources_table.data_source_column_heading"
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
        style: { width: "100%" },
      },
    }),
  ];

  const [data, setData] = useState(() => [...defaultData]);

  const [dataSourceDialogOpen, setDataSourceDialogOpen] = useState(false);

  return (
    <>
      <PageContent>
        <PageHeader>
          <PageTitleAndBackButton
            title={t(
              "validation_jobs.validation_jobs_new.validation_jobs_new_page_title"
            )}
          />
        </PageHeader>
        <Form
          onSubmit={(data) => {
            // Extract validationRuleIds from validationRules and remove
            // validationRules
            data["validationRuleIds"] = data.validationRules.map(
              (validationRule) => validationRule.id
            );
            delete data.validationRules;
            console.log(data);
          }}
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              {/* Data Sources Section */}
              <PageSection marginBottom={true}>
                <SectionHeader>
                  <SectionTitle>
                    {t(
                      "validation_jobs.validation_jobs_new.data_sources_section_title"
                    )}
                  </SectionTitle>
                  <Button
                    variant="tertiary"
                    onClick={() => setDataSourceDialogOpen(true)}
                  >
                    <div className="text-as-icon-large">+</div>
                    {t(
                      "validation_jobs.validation_jobs_new.add_data_source_button_label"
                    )}
                  </Button>
                </SectionHeader>
                <PageSubsection>
                  <Table data={data} columns={columns} />
                </PageSubsection>
              </PageSection>

              {/* General Information Section */}
              <PageSection>
                <TextAreaField
                  name="description"
                  label={t("validation_jobs.new.description_field_label")}
                  marginBottom="small"
                  borderRadius="large"
                />
              </PageSection>
            </div>
            {/* Validation Rules Section */}
            {/*
             * Wrap page section in div because outer div will take height of
             * tallest column
             */}
            <div className="col-span-4">
              <ValidationRulesFormSection />
            </div>
          </div>
          <RightAlignedContent>
            <ButtonGroup>
              <Button variant="tertiary">Rename me</Button>
              <Button type="submit" variant="primary">
                Rename me
              </Button>
            </ButtonGroup>
          </RightAlignedContent>
        </Form>
      </PageContent>
      <DataSourceDialog
        dataSourceDialogOpen={dataSourceDialogOpen}
        setDataSourceDialogOpen={setDataSourceDialogOpen}
      />
    </>
  );
}

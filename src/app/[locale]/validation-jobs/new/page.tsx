"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { createColumnHelper } from "@tanstack/react-table";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import routes from "@/app/routes";
import useValidationJobMutations from "@/hooks/api/validation-service/useValidationJobMutations";
import Button from "@/react-ui-library/components/buttons/button/Button";
import ButtonGroup from "@/react-ui-library/components/buttons/button-group/ButtonGroupContainer";
import PageContent from "@/react-ui-library/components/containers/page-content/PageContent";
import PageSection, {
  PageSectionPadding,
  // PageSectionPadding,
  PageSectionPaddingLR,
  PageSectionPaddingTB,
} from "@/react-ui-library/components/containers/page-section/PageSection";
import PageSectionHeader from "@/react-ui-library/components/containers/page-section/PageSectionHeader";
import PageSubsection from "@/react-ui-library/components/containers/page-subsection/PageSubsection";
import RightAlignedContent from "@/react-ui-library/components/containers/right-aligned-content/RightAlignedContent";
import TextAreaField from "@/react-ui-library/components/forms/form-fields/text-area-field/TextAreaField";
import { Form } from "@/react-ui-library/components/forms/Forms";
import { Menu } from "@/react-ui-library/components/menu/Menu";
import { MenuButton } from "@/react-ui-library/components/menu/MenuButton";
import { MenuDropdown } from "@/react-ui-library/components/menu/MenuDropdown";
import MenuItemsList from "@/react-ui-library/components/menu/MenuItemsList";
import PageHeader from "@/react-ui-library/components/page-elements/page-header/PageHeader";
import Table from "@/react-ui-library/components/tables/table/Table";
import getCheckboxColumn from "@/react-ui-library/components/tables/utils/getCheckboxColumn";
import PageSectionTitle from "@/react-ui-library/components/text/page-section-title/PageSectionTitle";
import PageTitle from "@/react-ui-library/components/text/page-title/PageTitle";
import PageTitleAndBackButton from "@/react-ui-library/components/text/page-title-and-back-button/PageTitleAndBackButton";
import MSExcelIcon from "@/react-ui-library/icons/MSExcelIcon";
import PlusIcon from "@/react-ui-library/icons/PlusIcon";

import ValidationDataSourceDialog from "./ValidationDataSourceDialog";
import ValidationDataSourcesTableSection from "./ValidationDataSourcesTableSection";
import ValidationRulesFormSection from "./ValidationRulesFormSection";

export default function NewValidationJob() {
  const t = useTranslations();

  const [uploadedFiles, setUploadedFiles] = useState<ValidationFile[]>([]);
  const [dataSourceDialogOpen, setDataSourceDialogOpen] = useState(false);
  const [dataSourcesTableData, setValidationDataSourcesTableData] = useState(
    []
  );

  // === Data ===
  const { createValidationJob } = useValidationJobMutations();

  return (
    <Form
      onSubmit={async (data) => {
        // TODO: Put IDs directly in form
        // Extract validationRuleIds from validationRules and remove
        // validationRules
        data["validationRuleIds"] = data.validationRules.map(
          (validationRule) => validationRule.id
        );
        delete data.validationRules;

        // Create the validation job
        const validationJob = await createValidationJob(data);

        // If validation job was created successfully, redirect to validation
        // jobs page
        if (validationJob) {
          redirect(routes.validationJobs.validationJobsList);
        }
      }}
    >
      {({ control }) => {
        const {
          fields: validationDataSourceFields,
          append: appendValidationDataSource,
          remove: removeValidationDataSource,
        } = useFieldArray({
          name: "validationDataSourceIds",
          rules: { required: true },
          control,
        });

        return (
          // TODO: Have field for ID and create separate field for IDs in backend
          <>
            <PageContent>
              <PageHeader>
                <PageTitleAndBackButton
                  title={t(
                    "validation_jobs.new.validation_jobs_new_page_title"
                  )}
                />
              </PageHeader>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  {/* General Information Section */}
                  <PageSection>
                    <TextAreaField
                      name="description"
                      label={t("validation_jobs.new.description_field_label")}
                      marginBottom="small"
                      borderRadius="large"
                    />
                  </PageSection>

                  {/* Data Sources Section */}
                  <ValidationDataSourcesTableSection
                    setDataSourceDialogOpen={setDataSourceDialogOpen}
                    uploadedFiles={uploadedFiles}
                    dataSourcesTableData={dataSourcesTableData}
                  />
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
                  <Button variant="tertiary">
                    {t("common.buttons.cancel_button_label")}
                  </Button>
                  <Button type="submit" variant="primary">
                    {t("validation_jobs.new.submit_button_label")}
                  </Button>
                </ButtonGroup>
              </RightAlignedContent>
            </PageContent>
            <ValidationDataSourceDialog
              dataSourceDialogOpen={dataSourceDialogOpen}
              setDataSourceDialogOpen={setDataSourceDialogOpen}
              setUploadedFiles={setUploadedFiles}
              setValidationDataSourcesTableData={
                setValidationDataSourcesTableData
              }
              appendValidationDataSource={appendValidationDataSource}
            />
          </>
        );
      }}
    </Form>
  );
}

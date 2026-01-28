"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { createColumnHelper } from "@tanstack/react-table";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import routes from "@/app/routes";
import useValidationJobMutations from "@/hooks/api/validation-service/useValidationJobMutations";
import useValidationJobRun from "@/hooks/api/validation-service/useValidationJobRun";
import Button from "@algion-co/react-ui-library/components/buttons/button/Button";
import ButtonGroup from "@algion-co/react-ui-library/components/buttons/button-group/ButtonGroupContainer";
import PageContent from "@algion-co/react-ui-library/components/containers/page-content/PageContent";
import PageSection, {
  PageSectionSpacing,
  // PageSectionSpacing,
  PageSectionSpacingLR,
  PageSectionSpacingTB,
} from "@algion-co/react-ui-library/components/containers/page-section/PageSection";
import PageSectionHeader from "@algion-co/react-ui-library/components/containers/page-section/PageSectionHeader";
import PageSubsection from "@algion-co/react-ui-library/components/containers/page-subsection/PageSubsection";
import RightAlignedContent from "@algion-co/react-ui-library/components/containers/right-aligned-content/RightAlignedContent";
import TextAreaField from "@algion-co/react-ui-library/components/forms/form-fields/text-area-field/TextAreaField";
import TextInputField from "@algion-co/react-ui-library/components/forms/form-fields/text-input-field/TextInputField";
import { Form } from "@algion-co/react-ui-library/components/forms/Forms";
import { Menu } from "@algion-co/react-ui-library/components/menu/Menu";
import { MenuButton } from "@algion-co/react-ui-library/components/menu/MenuButton";
import { MenuDropdown } from "@algion-co/react-ui-library/components/menu/MenuDropdown";
import MenuItemsList from "@algion-co/react-ui-library/components/menu/MenuItemsList";
import PageHeader from "@algion-co/react-ui-library/components/page-elements/page-header/PageHeader";
import Table from "@algion-co/react-ui-library/components/tables/table/Table";
import getCheckboxColumn from "@algion-co/react-ui-library/components/tables/utils/getCheckboxColumn";
import PageSectionTitle from "@algion-co/react-ui-library/components/text/page-section-title/PageSectionTitle";
import PageTitle from "@algion-co/react-ui-library/components/text/page-title/PageTitle";
import PageTitleAndBackButton from "@algion-co/react-ui-library/components/text/page-title-and-back-button/PageTitleAndBackButton";
import { useSSE } from "@algion-co/react-ui-library/contexts/SSEContext";
import MSExcelIcon from "@algion-co/react-ui-library/icons/MSExcelIcon";
import PlusIcon from "@algion-co/react-ui-library/icons/PlusIcon";

import ValidationDataSourceDialog from "./ValidationDataSourceDialog";
import ValidationDataSourcesTableSection from "./ValidationDataSourcesSection";
import ValidationDataSourcesSection from "./ValidationDataSourcesSection";
import ValidationRulesFormSection from "./ValidationRulesFormSection";

export default function NewValidationJob() {
  const t = useTranslations();

  const [uploadedFiles, setUploadedFiles] = useState<ValidationFile[]>([]);
  const [dataSourceDialogOpen, setDataSourceDialogOpen] = useState(false);
  const [dataSourcesTableData, setValidationDataSourcesTableData] = useState(
    [],
  );

  const { runValidationJob } = useValidationJobRun();

  // === Data ===
  const { createValidationJob } = useValidationJobMutations();

  return (
    <Form
      onSubmit={async (data) => {
        // console.log(data);
        // TODO: Put IDs directly in form
        // Extract validationRuleIds from validationRules and remove
        // validationRules
        data["validationRuleIds"] = data.validationRules.map(
          (validationRule) => validationRule.id,
        );
        delete data.validationRules;

        // Create the validation job
        const validationJob = await createValidationJob(data);

        // If validation job was created successfully, redirect to validation
        // jobs page
        if (validationJob) {
          // Run validation job via SSE
          await runValidationJob(validationJob);
          redirect(`${routes.validationJobs.list}`);
        }
      }}
    >
      {({ control }) => {
        const {
          fields: validationDataSourceFields,
          append: appendValidationDataSource, // TODO: The field should store IDs. // TODO: Pass handler that does the appending and setting of the data state for the list
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
                    "validation_jobs.new.validation_jobs_new_page_title",
                  )}
                />
              </PageHeader>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  {/* General Information Section */}
                  <PageSection>
                    <TextInputField
                      name="slug"
                      label={t("validation_jobs.new.slug_field_label")}
                      rules={{
                        required: {
                          value: true,
                          message: t(
                            "common.forms.validation.required_error_message_specific",
                            {
                              field: t("validation_jobs.new.slug_field_label"),
                            },
                          ),
                        },
                      }}
                    />

                    <TextAreaField
                      name="description"
                      label={t("validation_jobs.new.description_field_label")}
                      marginBottom="small"
                      borderRadius="large"
                    />
                  </PageSection>

                  {/* Data Sources Section */}
                  <ValidationDataSourcesSection
                    setDataSourceDialogOpen={setDataSourceDialogOpen}
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

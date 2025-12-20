import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { useGenerateContext } from "@/hooks/api/rag-service/useGenerateContext";
import { useIndexFile } from "@/hooks/api/rag-service/useIndexFile";
import { useValidationRuleDataSourceMutations } from "@/hooks/api/validation-service/useValidationRuleDataSourceMutations";
import Button, {
  IconButton,
} from "@/react-ui-library/components/buttons/button/Button";
import PageSubsubsection, {
  PageSubsubsectionDisclosureButton,
} from "@/react-ui-library/components/containers/page-subsubsection/PageSubsubsection";
import ThumbnailFileUpload, {
  ThumbnailFileItem,
  ThumbnailFileUploadsContainer,
} from "@/react-ui-library/components/file-upload/thumbnail-file-upload/ThumbnailFileUpload";
import InputFieldWrapper from "@/react-ui-library/components/forms/form-fields/InputFieldWrapper";
import TextAreaField from "@/react-ui-library/components/forms/form-fields/text-area-field/TextAreaField";
import DropdownIcon from "@/react-ui-library/icons/dropdown-icon/DropdownIcon";
import SparklesIcon from "@/react-ui-library/icons/SparklesIcon";

import styles from "./PromptBasedValidationRuleFormContent.module.css";
import validationRulesDialogFormStyles from "./ValidationRulesDialogForm.module.css";

export default function PromptBasedValidationRuleFormContent() {
  const t = useTranslations();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { createValidationRuleDataSource, validationRuleDataSource } =
    useValidationRuleDataSourceMutations();
  const { indexFile } = useIndexFile();
  const { generateContext, contextData } = useGenerateContext();

  const { getValues } = useFormContext();
  // FIXME: Running API call twice
  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        const validationRuleDataSource = await createValidationRuleDataSource(
          file
        );
        indexFile({
          fileUuid: validationRuleDataSource.validationRuleFileRecord.uuid,
          filePath: validationRuleDataSource.validationRuleFileRecord.filePath,
          validationRuleUuid: getValues("validationRuleUuid"),
        });
      } catch (err) {
        console.error("Upload failed", err);
      }
    },
    [createValidationRuleDataSource, indexFile, getValues]
  );

  const handleGenerateContext = async () => {
    try {
      const contextGenerationData = await generateContext({
        jobId: uuidv4(),
        validationRuleUuid: getValues("validationRuleUuid"),
        prompt: getValues("prompt"),
      });
    } catch (err) {
      console.error("Context generation failed", err);
    }
  };

  // console.log("Selected files:", selectedFiles);
  // Validation Rule Data Source is created along with the file upload in the
  // backend.

  return (
    <>
      <TextAreaField
        name="prompt"
        label={t("validation_rules.new.prompt_field_label")}
        rules={{
          required: {
            value: true,
            message: t(
              "common.forms.validation.required_error_message_specific",
              {
                field: t("validation_rules.new.prompt_field_label"),
              }
            ),
          },
        }}
        textAreaClassName={styles.PromptTextArea}
      />

      <InputFieldWrapper
        label={t("validation_rules.new.attachments_field_label")}
        displayOptional={false}
        labelMarginBottom="medium"
      >
        <ul
          className={
            validationRulesDialogFormStyles.ThumbnailFileUploadsContainer
          }
        >
          {selectedFiles.map((fileItem) => (
            <ThumbnailFileItem
              as="li"
              key={fileItem.file.name}
              file={fileItem.file}
              isValid={fileItem.isValid}
            />
          ))}
          <ThumbnailFileUpload
            as="li"
            setSelectedFiles={setSelectedFiles}
            validateFile={() => true}
            onFileValid={handleFileUpload}
            className={styles.ThumbnailFileUploadItem}
          />
        </ul>
      </InputFieldWrapper>

      <PageSubsubsection
        renderTitleBar={() => (
          <div className={styles.ContextTitleBar}>
            <div className={styles.ContextTitle}>
              {t("validation_rules.new.context_pagesubsubsection_title")}
            </div>
            <div className={styles.ContextTitleBarButtonGroup}>
              <IconButton variant="secondary" onClick={handleGenerateContext}>
                <SparklesIcon className={`icon-large`} />
                {t("validation_rules.new.generate_context_button_label")}
              </IconButton>
              <PageSubsubsectionDisclosureButton>
                <DropdownIcon />
              </PageSubsubsectionDisclosureButton>
            </div>
          </div>
        )}
      />

      <div></div>
      {/* <TextAreaField
        name="context"
        label={t("validation_rules.new.context_field_label")}
        rules={{
          required: {
            value: true,
            message: t(
              "common.forms.validation.required_error_message_specific",
              {
                field: t("validation_rules.new.context_field_label"),
              }
            ),
          },
        }}
        renderTextAreaToolbar={renderTextAreaToolbar}
        textAreaClassName={styles.PromptTextArea}
      /> */}
    </>
  );
}

import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { useGenerateContext } from "@/hooks/api/rag-service/useGenerateContext";
import { useIndexFile } from "@/hooks/api/rag-service/useIndexFile";
import { useValidationRuleDataSourceMutations } from "@/hooks/api/validation-service/useValidationRuleDataSourceMutations";
import { useStreamingText } from "@/hooks/useStreamingText";
import Button, {
  IconButton,
} from "@/react-ui-library/components/buttons/button/Button";
import PageSubsubsection, {
  PageSubsubsectionDisclosureButton,
} from "@/react-ui-library/components/containers/page-subsubsection/PageSubsubsection";
import { DialogPaddingLR } from "@/react-ui-library/components/dialogs/Dialog";
import ThumbnailFileUpload, {
  ThumbnailFileItem,
  ThumbnailFileUploadsContainer,
} from "@/react-ui-library/components/file-upload/thumbnail-file-upload/ThumbnailFileUpload";
import InputFieldWrapper from "@/react-ui-library/components/forms/form-fields/InputFieldWrapper";
import TextAreaField from "@/react-ui-library/components/forms/form-fields/text-area-field/TextAreaField";
import {
  FormSection,
  FormSectionSubtitle,
  FormSectionTitle,
  FormVerticalSpacing,
} from "@/react-ui-library/components/forms/Forms";
import TextArea from "@/react-ui-library/components/forms/inputs/text-area/TextArea";
import CircularProgress from "@/react-ui-library/components/progress-bars/circular-progress-bar/CircularProgressBar";
import { useSSE } from "@/react-ui-library/contexts/SSEContext";
import DropdownIcon from "@/react-ui-library/icons/dropdown-icon/DropdownIcon";
import SparklesIcon from "@/react-ui-library/icons/SparklesIcon";

import styles from "./PromptBasedValidationRuleFormContent.module.css";
import validationRulesDialogFormStyles from "./ValidationRulesDialogForm.module.css";

export function PromptFormField() {
  const t = useTranslations();

  return (
    <TextAreaField
      name="prompt_based_validation_rule.prompt"
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
  );
}

export default function PromptBasedValidationRuleFormContent() {
  const t = useTranslations();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { createValidationRuleDataSource, validationRuleDataSource } =
    useValidationRuleDataSourceMutations();
  const { indexFile } = useIndexFile();
  const { generateContext, contextData } = useGenerateContext();

  const [currentJobID, setCurrentJobID] = useState<string | null>(null);

  const { text, isStreaming, error, reset } = useStreamingText(currentJobID);

  const formMethods = useFormContext();
  const { getValues, setValue } = formMethods;

  useEffect(() => {
    if (text !== undefined) {
      setValue("prompt_based_validation_rule.context", text, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  }, [text, setValue]);

  // FIXME: Running API call twice. Something to do with strict mode
  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        // Set progress to 0
        console.log(file);

        const validationRuleDataSource = await createValidationRuleDataSource(
          file
        );
        indexFile({
          fileUuid: validationRuleDataSource.validationRuleFileRecord.uuid,
          filePath: validationRuleDataSource.validationRuleFileRecord.filePath,
          validationRuleUuid: getValues("uuid"),
        });
      } catch (err) {
        console.error("Upload failed", err);
      }
    },
    [createValidationRuleDataSource, indexFile, getValues]
  );

  const handleGenerateContext = async () => {
    try {
      const jobId = uuidv4();
      setCurrentJobID(jobId);
      const contextGenerationData = await generateContext({
        jobId: jobId,
        validationRuleUuid: getValues("uuid"),
        prompt: getValues("prompt_based_validation_rule.prompt"),
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
      <FormSection>
        <DialogPaddingLR>
          {/* <InputFieldWrapper
              label={t("validation_rules.new.attachments_field_label")}
              supportingText={t(
                "validation_rules.new.attachments_field_supporting_text"
              )}
              displayOptional={false}
              // labelMarginBottom="medium"
            > */}
          <FormSectionTitle>
            {t("validation_rules.new.attachments_section_title")}
          </FormSectionTitle>
          <FormSectionSubtitle>
            {t("validation_rules.new.attachments_section_subtitle")}
          </FormSectionSubtitle>
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
                isLoading={fileItem.isLoading}
                progress={fileItem.progress}
                error={fileItem.error}
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
          {/* </InputFieldWrapper> */}
        </DialogPaddingLR>
      </FormSection>

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
      >
        <TextArea
          // placeholder={placeholder}
          // renderTextAreaToolbar={renderTextAreaToolbar}
          reactHookForm={{
            name: "prompt_based_validation_rule.context",
            formMethods: formMethods,
          }}
          // className={`${
          //   borderRadiusClasses[
          //     borderRadius as keyof typeof borderRadiusClasses
          //   ] || ""
          // } ${textAreaClassName}`}
          // style={textAreaStyle}
        />
      </PageSubsubsection>

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

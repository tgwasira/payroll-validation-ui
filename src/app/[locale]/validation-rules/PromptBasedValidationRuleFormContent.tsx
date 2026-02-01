// @ts-nocheck
import Button, {
  FormPageSectionTitle,
  IconButton,
  PageSection,
  PageSectionDisclosureButton,
  PageSectionDisclosurePanel,
  PageSectionHeader,
  PageSectionTitle,
} from "@algion-co/react-ui-library";
import {
  PageSubsubsection,
  PageSubsubsectionDisclosureButton,
} from "@algion-co/react-ui-library";
import { DialogPaddingLR } from "@algion-co/react-ui-library";
import {
  ThumbnailFileItem,
  ThumbnailFileUpload,
  ThumbnailFileUploadsContainer,
} from "@algion-co/react-ui-library";
import { InputFieldWrapper } from "@algion-co/react-ui-library";
import { TextAreaField } from "@algion-co/react-ui-library";
import {
  FormSection,
  FormSectionSubtitle,
  FormSectionTitle,
  FormVerticalSpacing,
} from "@algion-co/react-ui-library";
import { TextArea } from "@algion-co/react-ui-library";
import { CircularProgress } from "@algion-co/react-ui-library";
import { useSSE } from "@algion-co/react-ui-library";
import { DropdownIcon } from "@algion-co/react-ui-library";
import { SparklesIcon } from "@algion-co/react-ui-library";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { useGenerateContext } from "@/hooks/api/rag-service/useGenerateContext";
import { useIndexFile } from "@/hooks/api/rag-service/useIndexFile";
import { useValidationRuleDataSourceMutations } from "@/hooks/api/validation-service/useValidationRuleDataSourceMutations";
import { useStreamingText } from "@/hooks/useStreamingText";

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
            },
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
  const { connect, subscribe } = useSSE();

  const { text, isStreaming, error, reset } = useStreamingText(currentJobID);

  const formMethods = useFormContext();
  const { getValues, setValue } = formMethods;

  // Connect to SSE on mount
  useEffect(() => {
    // TODO: Make the URL configurable
    connect("http://localhost:8001/events/rag");
  }, []);

  useEffect(() => {
    if (text !== undefined) {
      setValue("prompt_based_validation_rule.context", text, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  }, [text, setValue]);

  const updateFileProgress = (uuid: string, progress: number) => {
    setSelectedFiles((prev) =>
      prev.map((item) => (item.uuid === uuid ? { ...item, progress } : item)),
    );
  };

  // FIXME: Running API call twice. Something to do with strict mode
  const handleFileUpload = useCallback(
    async (fileItem) => {
      try {
        const validationRuleDataSource = await createValidationRuleDataSource(
          fileItem.file,
          fileItem.uuid,
        );
        if (validationRuleDataSource) {
          // Update progress
          updateFileProgress(fileItem.uuid, 20);

          indexFile({
            fileUuid: validationRuleDataSource.validationRuleFileRecord.uuid,
            filePath:
              validationRuleDataSource.validationRuleFileRecord.filePath,
            validationRuleUuid: getValues("uuid"),
          });
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    },
    [createValidationRuleDataSource, indexFile, getValues],
  );

  const handleGenerateContext = async () => {
    try {
      const jobId = crypto.randomUUID();
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

  useEffect(() => {
    const unsubscribes = [
      subscribe("indexing_progress", (event) => {
        // TODO: Add logging
        const { validationRuleUuid, fileUuid, progress } = event.payload;

        updateFileProgress(fileUuid, progress);

        // setValidationProgresses((prevMap) => {
        //   const newMap = new Map(prevMap);

        //   const previous = prevMap.get(validationJobId);

        //   newMap.set(validationJobId, {
        //     prevValidationJobProgress: previous?.validationJobProgress,
        //     validationJobProgress,
        //   });

        //   return newMap;
        // });
      }),
    ];

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [subscribe]);

  return (
    <>
      <FormSection>
        <DialogPaddingLR>
          <FormVerticalSpacing>
            <div>
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
            </div>

            <PageSection
              padding="none"
              paddingSize="dialog"
              collapsible={true}
              defaultOpen={false}
              unmount={false}
            >
              {({ open }) => (
                <>
                  <PageSectionHeader
                    as={PageSectionDisclosureButton}
                    padding="all"
                    paddingSize="dialog"
                    dividerBottom={open}
                    // marginBottom="none"
                  >
                    {/* TODO: Can also consider a form subsection or formpagesection title */}
                    <FormPageSectionTitle>
                      {t(
                        "validation_rules.new.context_pagesubsubsection_title",
                      )}
                    </FormPageSectionTitle>
                    <DropdownIcon direction={open ? "up" : "down"} />
                  </PageSectionHeader>

                  <PageSectionDisclosurePanel>
                    <TextArea
                      // placeholder={placeholder}
                      // renderTextAreaToolbar={renderTextAreaToolbar}
                      reactHookForm={{
                        name: "prompt_based_validation_rule.context",
                        formMethods: formMethods,
                      }}
                      plain={true}
                      // className={`${
                      //   borderRadiusClasses[
                      //     borderRadius as keyof typeof borderRadiusClasses
                      //   ] || ""
                      // } ${textAreaClassName}`}
                      // style={textAreaStyle}
                    />
                  </PageSectionDisclosurePanel>
                </>
              )}
            </PageSection>
          </FormVerticalSpacing>
        </DialogPaddingLR>
      </FormSection>

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

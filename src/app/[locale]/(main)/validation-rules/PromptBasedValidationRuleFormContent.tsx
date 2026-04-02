// @ts-nocheck
import {
  Button,
  ButtonGroup,
  DialogBodyPadding,
  FormPageSectionSubtitle,
  FormPageSectionTitle,
  FormPageSectionTitleGroup,
  IconButton,
  PageSection,
  PageSectionDisclosureButton,
  PageSectionDisclosurePanel,
  PageSectionHeader,
  PageSectionSpacing,
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

import { validationServiceApi } from "@/apiConfig";
import { useGenerateContext } from "@/hooks/api/rag-service/useGenerateContext";
import { useIndexFile } from "@/hooks/api/rag-service/useIndexFile";
import { useValidationRuleDataSourceMutations } from "@/hooks/api/validation-service/useValidationRuleDataSourceMutations";
import { useStreamingText } from "@/hooks/useStreamingText";

import styles from "./PromptBasedValidationRuleFormContent.module.css";
import validationRulesDialogFormStyles from "./ValidationRulesDialogForm.module.css";

// export function PromptFormField() {
//   const t = useTranslations();

//   return (
//     <TextAreaField
//       name="prompt_based_validation_rule.prompt"
//       label={t("validation_rules.new.prompt_field_label")}
//       rules={{
//         required: {
//           value: true,
//           message: t(
//             "common.forms.validation.required_error_message_specific",
//             {
//               field: t("validation_rules.new.prompt_field_label"),
//             },
//           ),
//         },
//       }}
//       textAreaClassName={styles.PromptTextArea}
//     />
//   );
// }

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
    connect(
      `${validationServiceApi.baseURL}${validationServiceApi.endpoints.sseRag}`,
    );
  }, []);

  useEffect(() => {
    if (text !== undefined) {
      setValue("prompt_based_validation_rule.context", text, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  }, [text, setValue]);

  const updateFileObject = (uuid: string, key: string, value: any) => {
    setSelectedFiles((prev) =>
      prev.map((item) =>
        item.uuid === uuid ? { ...item, [key]: value } : item,
      ),
    );
  };

  // TODO: Use updateFileObject
  const updateFileProgress = (uuid: string, progress: number) => {
    setSelectedFiles((prev) =>
      prev.map((item) => (item.uuid === uuid ? { ...item, progress } : item)),
    );
  };

  // FIXME: Running API call twice. Something to do with strict mode
  const handleFileUpload = useCallback(
    async (fileItem) => {
      try {
        // Set file as loading
        updateFileObject(fileItem.uuid, "isLoading", true);

        const validationRuleDataSource = await createValidationRuleDataSource(
          fileItem.file,
          fileItem.uuid,
        );
        if (validationRuleDataSource) {
          // Update progress
          updateFileProgress(fileItem.uuid, 20);

          indexFile({
            fileUuid: validationRuleDataSource.validationRuleFileRecord.uuid,
            storagePath:
              validationRuleDataSource.validationRuleFileRecord.storagePath,
            validationRuleUuid: getValues("uuid"),
          });
        }
      } catch (err) {
        // Set file as not loading and set error
        updateFileObject(fileItem.uuid, "isLoading", false);

        // TODO: Translation error
        updateFileObject(
          fileItem.uuid,
          "error",
          err.message || "Upload failed",
        );
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
      }),

      subscribe("indexing_completed", (event) => {
        const { validationRuleUuid, fileUuid } = event.payload;
        updateFileObject(fileUuid, "isCompleted", true);
        updateFileObject(fileUuid, "isLoading", false);
      }),

      subscribe("indexing_error", (event) => {
        // TODO: Add logging
        const { validationRuleUuid, fileUuid, error } = event.payload;
        updateFileObject(fileUuid, "isLoading", false);
        updateFileObject(fileUuid, "error", error);
      }),
    ];

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [subscribe]);

  return (
    <FormSection paddingBottom="none" borderBottom={false}>
      <DialogBodyPadding padding="right bottom left">
        <FormVerticalSpacing spacing="pageSections">
          <PageSection
            padding="none"
            paddingSize="dialog"
            marginBottom="none"
            borderRadius="form"
            collapsible={true}
            focusable={true}
            defaultOpen={true}
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
                    {t("validation_rules.new.prompt_field_label")}
                  </FormPageSectionTitle>
                  <DropdownIcon direction={open ? "up" : "down"} />
                </PageSectionHeader>

                <PageSectionDisclosurePanel>
                  <TextArea
                    // placeholder={placeholder}
                    // renderTextAreaToolbar={renderTextAreaToolbar}
                    reactHookForm={{
                      name: "prompt_based_validation_rule.prompt",
                      rules: {
                        required: {
                          value: true,
                          message: t(
                            "common.forms.validation.required_error_message_specific",
                            {
                              field: t(
                                "validation_rules.new.prompt_field_label",
                              ),
                            },
                          ),
                        },
                      },
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

          <PageSection
            padding="none"
            paddingSize="dialog"
            marginBottom="none"
            borderRadius="form"
            collapsible={true}
            focusable={true}
            defaultOpen={false}
            unmount={false}
          >
            {({ open }) => (
              <>
                <PageSectionHeader
                  as={PageSectionDisclosureButton}
                  padding="all"
                  // paddingSize="dialog"
                  dividerBottom={open}

                  // marginBottom="none"
                >
                  {/* TODO: Can also consider a form subsection or formpagesection title */}
                  <FormPageSectionTitleGroup className="text-left">
                    <FormPageSectionTitle>
                      {t("validation_rules.new.attachments_section_title")}
                    </FormPageSectionTitle>
                    {open && (
                      <FormPageSectionSubtitle>
                        {t("validation_rules.new.attachments_section_subtitle")}
                      </FormPageSectionSubtitle>
                    )}
                  </FormPageSectionTitleGroup>
                  <DropdownIcon direction={open ? "up" : "down"} />
                </PageSectionHeader>

                <PageSectionDisclosurePanel>
                  {/* <InputFieldWrapper
              label={t("validation_rules.new.attachments_field_label")}
              supportingText={t(
                "validation_rules.new.attachments_field_supporting_text"
              )}
              displayOptional={false}
              // labelMarginBottom="medium"
            > */}
                  <PageSectionSpacing
                    padding="all"
                    className={styles.ThumbnailFileUploadsSection}
                    // paddingSize="dialog-tb-extra"
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
                          isLoading={fileItem.isLoading}
                          isCompleted={fileItem.isCompleted}
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
                  </PageSectionSpacing>
                  {/* </InputFieldWrapper> */}
                </PageSectionDisclosurePanel>
              </>
            )}
          </PageSection>

          <PageSection
            padding="none"
            paddingSize="dialog"
            marginBottom="none"
            borderRadius="form"
            collapsible={true}
            focusable={true}
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
                  className={styles.ContextGenerationSectionHeader}
                  // marginBottom="none"
                >
                  {/* TODO: Can also consider a form subsection or formpagesection title */}
                  <FormPageSectionTitle>
                    {t("validation_rules.new.context_pagesubsubsection_title")}
                  </FormPageSectionTitle>
                  <ButtonGroup>
                    <Button
                      as="div"
                      role="button"
                      variant="tertiary"
                      paddingLeftSize={"icon-normal"}
                      onClick={handleGenerateContext}
                      disabled={isStreaming}
                    >
                      <SparklesIcon className={`icon-large`} />
                      {t("validation_rules.new.generate_context_button_label")}
                    </Button>
                    <DropdownIcon direction={open ? "up" : "down"} />
                  </ButtonGroup>
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
      </DialogBodyPadding>
    </FormSection>
  );
}

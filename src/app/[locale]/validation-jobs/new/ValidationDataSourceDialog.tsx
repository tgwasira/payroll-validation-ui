import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { useValidationDataSourceMutations } from "@/hooks/api/validation-service/useValidationDataSourceMutations";
import { useValidationJobFileMutations } from "@/hooks/api/validation-service/useValidationFileRecordMutations";
import Button from "@/react-ui-library/components/buttons/button/Button";
import ButtonGroup from "@/react-ui-library/components/buttons/button-group/ButtonGroupContainer";
import ScrollContainer from "@/react-ui-library/components/containers/scroll-container/ScrollContainer";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  DialogPaddingLR,
  DialogPanel,
  DialogTitle,
} from "@/react-ui-library/components/dialogs/Dialog";
import DialogFooterButtonGroup from "@/react-ui-library/components/dialogs/dialog-footer-button-group/DialogFooterButtonGroup";
import FileUpload from "@/react-ui-library/components/file-upload/FileUpload";
// import FileUpload from "@/react-ui-library/components/file-upload/FileUpload_";
import { Form } from "@/react-ui-library/components/forms/Forms";
import { List, ListItem } from "@/react-ui-library/components/lists/List";
import Tab1 from "@/react-ui-library/components/tabs/Tab1/Tab1";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@/react-ui-library/components/tabs/Tabs";
import MSExcelIcon from "@/react-ui-library/icons/MSExcelIcon";

import FilesList from "./FilesList";
import styles from "./ValidationDataSourceDialog.module.css";

export default function ValidationDataSourceDialog({
  dataSourceDialogOpen,
  setDataSourceDialogOpen,
  setUploadedFiles,
  setValidationDataSourcesTableData,
  appendValidationDataSource,
}) {
  const t = useTranslations();

  const { createValidationFileRecord, loading: uploading } =
    useValidationJobFileMutations();
  const { createValidationDataSource } = useValidationDataSourceMutations();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // This temporarily holds the created ValidationDataSource objects. They will
  // only be added to the table and form when the "Add Data Source" button is
  // clicked to save and close the dialog.
  const [validationDataSources, setValidationDataSources] = useState([]);

  const closeDialog = () => {
    setDataSourceDialogOpen(false);
    /**
     * FIXME: Ideally, the reset should wait a bit until animation for closing
     * dialog is completed. However, just using
     * 'setTimeout(resetVariationForm, 1000);' will result in the form being
     * reset if you quickly closed and clicked a variation item. Find some way
     * to not open dialog until reset is complete? Set a state for reset
     * complete and the await that. Async function.
     */
    // resetVariantForm();
  };

  // =========================
  const replaceFilesOnChange = false;
  const validateFile = useCallback((file: File | null) => {
    if (!file) {
      return false;
    }

    // if (!file.type.startsWith("image/")) {
    //   return false;
    // }

    return true;
  }, []);

  const addUploads = useCallback(
    (files: Array<File | null>) => {
      // If a state setter function is provided, update the selected files
      if (setSelectedFiles) {
        // If replaceFilesOnChange is true, reset the selected files in order to
        // add only the newly selected files
        if (replaceFilesOnChange) {
          setSelectedFiles([]);
        }
        // else {
        // setSelectedFiles((prevFiles) => [
        //   ...prevFiles,
        //   ...Array.from(validFiles),
        // ]);
        // }
      }

      // Validate each file and perform upload logic if valid
      files.map(async (file) => {
        if (validateFile(file)) {
          setSelectedFiles((prevFiles) => [...prevFiles, ...[file]]);
          const result = await createValidationFileRecord(file);

          // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          // TODO: Implement check for whether upload was successful
          // and show changes in
          // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

          if (result) {
            // Create validation job data source using UUID of uploaded file
            const validationDataSourceResult = await createValidationDataSource(
              {
                type: "file",
                validation_file_record_uuid: result.uuid,
              }
            );

            if (validationDataSourceResult) {
              setValidationDataSources((prev) => [
                ...prev,
                validationDataSourceResult,
              ]);
            }
          }

          // If upload was successful, add the returned file record object to
          // state for uploaded files
          // setUploadedFiles((prevFiles) => [...prevFiles, result]);
          // setValidationDataSourcesTableData((prevDataSources) => [
          //   ...prevDataSources,
          //   {
          //     type: "file",
          //     name: result.filename,
          //   },
          // ]);
        }
      });

      // Now run an onChange function provided in props, if any
      // if (typeof onChange === "function") {
      //   onChange(files);
      // }
    },
    [validateFile]
  );

  // === Event Handlers ===
  const handleAddDataSources = () => {
    // Add the created validation data sources to the table data
    setValidationDataSourcesTableData((prev) => [
      ...prev,
      ...validationDataSources,
    ]);

    validationDataSources.forEach((validationDataSource) => {
      appendValidationDataSource(validationDataSource.id);
    });

    // Close the dialog
    closeDialog();
  };

  return (
    <Dialog isOpen={dataSourceDialogOpen} setIsOpen={setDataSourceDialogOpen}>
      <DialogPanel>
        <DialogHeader>
          <DialogTitle>
            {t(
              "validation_jobs.new.data_sources_dialog.data_sources_dialog_title"
            )}
          </DialogTitle>
          <DialogCloseButton onClick={closeDialog} />
        </DialogHeader>

        <DialogBody>
          <TabGroup>
            <DialogPaddingLR>
              <TabList className={styles.TabList}>
                <Tab1>
                  {t("validation_jobs.new.data_sources_dialog.files_tab_title")}
                </Tab1>
              </TabList>
            </DialogPaddingLR>
            <TabPanels>
              <TabPanel>
                {/* TODO: Fix this */}
                <ScrollContainer style={{ maxHeight: "100%" }}>
                  <DialogPaddingLR>
                    <FileUpload
                      instructionsLine1Text={t(
                        "validation_jobs.new.data_sources_dialog.file_upload_formats"
                      )}
                      instructionsLine2Text={t(
                        "validation_jobs.new.data_sources_dialog.file_upload_max_file_size"
                      )}
                      marginBottom={true}
                      multiple={true}
                      accept={".csv, application/vnd.ms-excel"}
                      onFileChange={addUploads}
                    />
                    <FilesList files={selectedFiles} />
                  </DialogPaddingLR>
                </ScrollContainer>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </DialogBody>

        <DialogFooter>
          <DialogFooterButtonGroup>
            <Button variant="tertiary" onClick={closeDialog}>
              {t("common.buttons.cancel_button_label")}
            </Button>
            <Button onClick={handleAddDataSources}>
              {t("validation_jobs.new.data_sources_dialog.submit_button_label")}
            </Button>
          </DialogFooterButtonGroup>
          {/* <div className="group-base align-flex-item-right">
            <Button type="button" variant="tertiary" onClick={closeDialog}>
              {t("common.buttons.cancel_button_label")}
            </Button>
            <Button type="submit">
              {t("common.buttons.submit_button_label")}
            </Button>
          </div> */}
        </DialogFooter>
      </DialogPanel>
    </Dialog>
  );
}

import { useTranslations } from "next-intl";
import React from "react";

import Button from "@/react-ui-library/components/buttons/button/Button";
import ButtonGroup from "@/react-ui-library/components/buttons/button-group/ButtonGroupContainer";
import {
  Dialog,
  DialogPaddingLR,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
} from "@/react-ui-library/components/dialogs/Dialog";
import DialogFooterButtonGroup from "@/react-ui-library/components/dialogs/dialog-footer-button-group/DialogFooterButtonGroup";
import FileUpload from "@/react-ui-library/components/file-upload/FileUpload";
import Tab1 from "@/react-ui-library/components/tabs/Tab1/Tab1";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@/react-ui-library/components/tabs/Tabs";

import styles from "./DataSourceDialog.module.css";

export default function DataSourceDialog({
  dataSourceDialogOpen,
  setDataSourceDialogOpen,
}) {
  const t = useTranslations();
  //   const formMethods = useFormContext();

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

  return (
    <Dialog isOpen={dataSourceDialogOpen} setIsOpen={setDataSourceDialogOpen}>
      <DialogPanel>
        <DialogHeader>
          <DialogTitle>
            {t(
              "validation_jobs.validation_jobs_new.data_source_dialog.data_source_dialog_title"
            )}
          </DialogTitle>
          <DialogCloseButton onClick={closeDialog} />
        </DialogHeader>

        <TabGroup>
          <DialogPaddingLR>
            <TabList className={styles.TabList}>
              <Tab1>
                {t(
                  "validation_jobs.validation_jobs_new.data_source_dialog.file_tab_title"
                )}
              </Tab1>
            </TabList>
            <TabPanels>
              <TabPanel>
                <FileUpload
                  instructionsLine1Text={t(
                    "validation_jobs.validation_jobs_new.data_source_dialog.file_upload_formats"
                  )}
                  instructionsLine2Text={t(
                    "validation_jobs.validation_jobs_new.data_source_dialog.file_upload_max_file_size"
                  )}
                  marginBottom={true}
                />
              </TabPanel>
            </TabPanels>
          </DialogPaddingLR>
        </TabGroup>

        <DialogFooter>
          <DialogFooterButtonGroup>
            <Button variant="tertiary" onClick={closeDialog}>
              {t("common.buttons.cancel_button_label")}
            </Button>
            <Button>{t("common.buttons.save_button_label")}</Button>
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

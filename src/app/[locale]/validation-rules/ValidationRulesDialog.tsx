import { Portal } from "@headlessui/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useValidationRuleMutations } from "@/hooks/api/useValidationService";
import Button from "@/react-ui-library/components/buttons/button/Button";
import ButtonGroup from "@/react-ui-library/components/buttons/button-group/ButtonGroupContainer";
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
import TextAreaField from "@/react-ui-library/components/forms/form-fields/text-area-field/TextAreaField";
import TextInputField from "@/react-ui-library/components/forms/form-fields/text-input-field/TextInputField";
import { Form } from "@/react-ui-library/components/forms/Forms";
import Tab1 from "@/react-ui-library/components/tabs/Tab1/Tab1";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@/react-ui-library/components/tabs/Tabs";

import styles from "./DataSourceDialog.module.css";

export default function ValidationRulesDialog({
  validationRulesDialogOpen,
  setValidationRulesDialogOpen,
  fetchValidationRules,
}) {
  const t = useTranslations();
  //   const formMethods = useFormContext();

  const closeDialog = () => {
    setValidationRulesDialogOpen(false);
    // fetchValidationRules();
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

  // --- API ---
  const { createValidationRule, validationRule, loading, error } =
    useValidationRuleMutations();

  // let toast = null;

  // useEffect(() => {
  //   if (loading) {
  //     toast = toast.loading("Creating validation rule");
  //   }
  // }, [loading]);

  useEffect(() => {
    if (validationRule) {
      // toast.dismiss();
      // toast.update(id, {
      //   render: "Validation rule created",
      //   type: "success",
      // });
      closeDialog();
      fetchValidationRules();
    }
  }, [validationRule]);

  return (
    <Dialog
      isOpen={validationRulesDialogOpen}
      setIsOpen={setValidationRulesDialogOpen}
    >
      {/* Form needs to be within Dialog otherwise submit button will not work */}
      <Form
        onSubmit={(data) => {
          createValidationRule(data);
          // closeDialog();
        }}
      >
        <DialogPanel>
          <DialogHeader>
            <DialogTitle>{t("validation_rules.new.dialog_title")}</DialogTitle>
            <DialogCloseButton onClick={closeDialog} />
          </DialogHeader>

          <DialogBody>
            <DialogPaddingLR>
              <TextInputField
                name="name"
                label={t("validation_rules.new.name_field_label")}
                rules={{
                  required: {
                    value: true,
                    message: t(
                      "forms.validation.required_error_message_specific",
                      { field: t("validation_rules.new.name_field_label") }
                    ),
                  },
                }}
              />
              <TextAreaField
                name="description"
                label={t("validation_rules.new.description_field_label")}
              />
              <TextInputField
                name="range"
                label={t("validation_rules.new.range_field_label")}
                rules={{
                  required: {
                    value: true,
                    message: t(
                      "forms.validation.required_error_message_specific",
                      { field: t("validation_rules.new.range_field_label") }
                    ),
                  },
                }}
              />
              <TextInputField
                name="formula"
                label={t("validation_rules.new.formula_field_label")}
                rules={{
                  required: {
                    value: true,
                    message: t(
                      "forms.validation.required_error_message_specific",
                      { field: t("validation_rules.new.formula_field_label") }
                    ),
                  },
                }}
              />
            </DialogPaddingLR>
          </DialogBody>

          <DialogFooter>
            <DialogFooterButtonGroup>
              <Button variant="tertiary" onClick={closeDialog}>
                {t("common.buttons.cancel_button_label")}
              </Button>
              <Button type="submit">
                {t("common.buttons.save_button_label")}
              </Button>
            </DialogFooterButtonGroup>
          </DialogFooter>
        </DialogPanel>
      </Form>
    </Dialog>
  );
}

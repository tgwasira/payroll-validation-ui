import { Portal } from "@headlessui/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useValidationRuleMutations } from "@/hooks/api/validation-service/useValidationRules";
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
import FileUpload from "@/react-ui-library/components/file-upload/FileUpload_";
import SelectInputField from "@/react-ui-library/components/forms/form-fields/select-input-field/SelectInputField";
import TextAreaField from "@/react-ui-library/components/forms/form-fields/text-area-field/TextAreaField";
import TextInputField from "@/react-ui-library/components/forms/form-fields/text-input-field/TextInputField";
import { Form } from "@/react-ui-library/components/forms/Forms";
import ControlledSelectInput from "@/react-ui-library/components/forms/inputs/select-inputs/ControlledSelectInput";
import Tab1 from "@/react-ui-library/components/tabs/Tab1/Tab1";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@/react-ui-library/components/tabs/Tabs";

import styles from "./ValidationDataSourceDialog.module.css";
import ValidationRulesDialogForm from "./ValidationRulesDialogForm";

export default function ValidationRulesDialog({
  validationRulesDialogOpen,
  setValidationRulesDialogOpen,
  fetchValidationRules,
}) {
  // --- API ---
  const { createValidationRule, validationRule, loading, error } =
    useValidationRuleMutations();

  // let toast = null;

  // useEffect(() => {
  //   if (loading) {
  //     toast = toast.loading("Creating validation rule");
  //   }
  // }, [loading]);

  const closeDialog = () => {
    setValidationRulesDialogOpen(false);
  };

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
          // console.log(data);
          createValidationRule(data);
          closeDialog();
        }}
      >
        <ValidationRulesDialogForm
          setValidationRulesDialogOpen={setValidationRulesDialogOpen}
        />
      </Form>
    </Dialog>
  );
}

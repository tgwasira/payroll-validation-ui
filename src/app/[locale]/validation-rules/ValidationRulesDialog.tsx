import { Portal } from "@headlessui/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
        onSubmit={async (data) => {
          try {
            const { data_type: dataType, criteria } = data;

            // Initialise formula_based_validation_rule object
            // Initialize formula_based_validation_rule object if it doesn't exist
            if (!data.formula_based_validation_rule) {
              data.formula_based_validation_rule = {};
            }
            if (!data.formula_based_validation_rule.formula) {
              data.formula_based_validation_rule.formula = {};
            }

            // TODO: @Harry: Please check that these actually work as intended in the backend
            // Build formula based on data type and criteria
            if (dataType === "number") {
              if (criteria === "is_equal_to") {
                data.formula_based_validation_rule.formula = `${data.range}.eq(${data.value})`;
              } else if (criteria === "is_not_equal_to") {
                data.formula_based_validation_rule.formula = `${data.range}.neq(${data.value})`;
              } else if (criteria === "is_greater_than") {
                data.formula_based_validation_rule.formula = `${data.range}.gt(${data.value})`;
              } else if (criteria === "is_greater_than_or_equal_to") {
                data.formula_based_validation_rule.formula = `${data.range}.ge(${data.value})`;
              } else if (criteria === "is_less_than") {
                data.formula_based_validation_rule.formula = `${data.range}.lt(${data.value})`;
              } else if (criteria === "is_less_than_or_equal_to") {
                data.formula_based_validation_rule.formula = `${data.range}.le(${data.value})`;
              } else if (criteria === "is_between_exclusive") {
                data.formula_based_validation_rule.formula = `(${data.range} > ${data.min_value}) & (${data.range} < ${data.max_value})`;
              } else if (criteria === "is_outside_of_exclusive") {
                data.formula_based_validation_rule.formula = `(${data.range} <= ${data.min_value}) | (${data.range} >= ${data.max_value})`;
              }
            } else if (dataType === "text") {
              if (criteria === "is_equal_to") {
                data.formula_based_validation_rule.formula = `${data.range}.eq('${data.value}')`;
              } else if (criteria === "is_not_equal_to") {
                data.formula_based_validation_rule.formula = `${data.range}.ne('${data.value}')`;
              } else if (criteria === "contains") {
                data.formula_based_validation_rule.formula = `${data.range}.str.contains('${data.value}', na=False)`;
              } else if (criteria === "does_not_contain") {
                data.formula_based_validation_rule.formula = `~${data.range}.str.contains('${data.value}', na=False)`;
              } else if (criteria === "starts_with") {
                data.formula_based_validation_rule.formula = `${data.range}.str.startswith('${data.value}', na=False)`;
              } else if (criteria === "ends_with") {
                data.formula_based_validation_rule.formula = `${data.range}.str.endswith('${data.value}', na=False)`;
              } else if (criteria === "is_empty") {
                data.formula_based_validation_rule.formula = `${data.range}.isna() | (${data.range}.str.strip() == '')`;
              } else if (criteria === "is_not_empty") {
                data.formula_based_validation_rule.formula = `${data.range}.notna() & (${data.range}.str.strip() != '')`;
              } else if (criteria === "matches_pattern") {
                data.formula_based_validation_rule.formula = `${data.range}.str.match('${data.value}', na=False)`;
              }
            }

            // Delete temporary fields that shouldn't be sent to the backend
            delete data.data_type;
            delete data.criteria;
            delete data.value;
            delete data.min_value;
            delete data.max_value;

            const result = await createValidationRule(data);
            closeDialog();
          } catch (err) {
            console.error("Error creating validation rule:", err);
            // Do we need this as toast is handled in the hook
            // toast.error(
            //   err?.response?.data?.message ||
            //     err?.message ||
            //     "Failed to create validation rule"
            // );
          }
        }}
      >
        <ValidationRulesDialogForm
          setValidationRulesDialogOpen={setValidationRulesDialogOpen}
        />
      </Form>
    </Dialog>
  );
}

import { useTranslations } from "next-intl";
import React from "react";
import { useWatch } from "react-hook-form";

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

export default function ValidationRulesDialogForm({
  setValidationRulesDialogOpen,
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

  const type = useWatch({ name: "type" });

  return (
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
                message: t("forms.validation.required_error_message_specific", {
                  field: t("validation_rules.new.name_field_label"),
                }),
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
                message: t("forms.validation.required_error_message_specific", {
                  field: t("validation_rules.new.range_field_label"),
                }),
              },
            }}
          />

          {/* Using input rather than switch etc. just incase we need more fields */}
          <SelectInputField
            as={ControlledSelectInput}
            name="type"
            label={t("validation_rules.new.type_field_label")}
            options={[
              {
                id: "formula",
                value: "formula",
                label: t("validation_rules.new.type_field_options.formula"),
              },
              {
                id: "prompt",
                value: "prompt",
                label: t("validation_rules.new.type_field_options.prompt"),
              }, // disable
            ]}
            isSearchable={false}
            hasSearchInput={false}
            rules={{
              required: {
                value: true,
                message: t("forms.validation.required_error_message_specific", {
                  field: t("validation_rules.new.type_field_label"),
                }),
              },
            }}
            marginBottom="normal"
            className=""
            style={{}}
          />

          {type?.id === "formula" && (
            <TextInputField
              name="formula"
              label={t("validation_rules.new.formula_field_label")}
              rules={{
                required: {
                  value: true,
                  message: t(
                    "forms.validation.required_error_message_specific",
                    {
                      field: t("validation_rules.new.formula_field_label"),
                    }
                  ),
                },
              }}
            />
          )}
        </DialogPaddingLR>
      </DialogBody>

      <DialogFooter>
        <DialogFooterButtonGroup>
          <Button variant="tertiary" onClick={closeDialog}>
            {t("common.buttons.cancel_button_label")}
          </Button>
          <Button type="submit">{t("common.buttons.save_button_label")}</Button>
        </DialogFooterButtonGroup>
      </DialogFooter>
    </DialogPanel>
  );
}

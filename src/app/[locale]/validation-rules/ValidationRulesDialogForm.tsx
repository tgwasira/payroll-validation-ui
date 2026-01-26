import {
  // CalendarIcon,
  HashIcon,
  TextTIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { useValidationRuleMutations } from "@/hooks/api/validation-service/useValidationRules";
import Button from "@algion/react-ui-library/components/buttons/button/Button";
import ButtonGroup from "@algion/react-ui-library/components/buttons/button-group/ButtonGroupContainer";
import ScrollContainer from "@algion/react-ui-library/components/containers/scroll-container/ScrollContainer";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  DialogPaddingLR,
  DialogPanel,
  DialogTabGroup,
  DialogTabList,
  DialogTitle,
} from "@algion/react-ui-library/components/dialogs/Dialog";
import DialogFooterButtonGroup from "@algion/react-ui-library/components/dialogs/dialog-footer-button-group/DialogFooterButtonGroup";
import FileUpload from "@algion/react-ui-library/components/file-upload/file-upload/FileUpload_";
import ThumbnailFileUpload from "@algion/react-ui-library/components/file-upload/thumbnail-file-upload/ThumbnailFileUpload";
import { HorizontalFormFieldGroup } from "@algion/react-ui-library/components/forms/form-fields/form-field-groups/FormFieldGroups";
import NumericInputField from "@algion/react-ui-library/components/forms/form-fields/numeric-input-field/NumericInputField";
import SelectInputField from "@algion/react-ui-library/components/forms/form-fields/select-input-field/SelectInputField";
import TextAreaField from "@algion/react-ui-library/components/forms/form-fields/text-area-field/TextAreaField";
import TextInputField from "@algion/react-ui-library/components/forms/form-fields/text-input-field/TextInputField";
import {
  Form,
  FormSection,
  FormVerticalSpacing,
} from "@algion/react-ui-library/components/forms/Forms";
import ControlledSelectInput from "@algion/react-ui-library/components/forms/inputs/select-inputs/ControlledSelectInput";
import SelectInput from "@algion/react-ui-library/components/forms/inputs/select-inputs/SelectInput";
import Tab1 from "@algion/react-ui-library/components/tabs/Tab1/Tab1";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@algion/react-ui-library/components/tabs/Tabs";
import {
  Tab3,
  TabList3,
} from "@algion/react-ui-library/components/tabs/tabs3/Tabs3";
import CalendarIcon from "@algion/react-ui-library/icons/CalendarIcon";
import TypeIcon from "@algion/react-ui-library/icons/TypeIcon";

import NumberFields from "./data-type-specific-fields/NumberFields";
import FormulaBasedValidationRuleFormContent from "./FormulaBasedValidationRuleFormContent";
import PromptBasedValidationRuleFormContent, {
  PromptFormField,
} from "./PromptBasedValidationRuleFormContent";
import styles from "./ValidationRulesDialogForm.module.css";

export default function ValidationRulesDialogForm({
  setValidationRulesDialogOpen,
}) {
  const t = useTranslations();
  const { setValue } = useFormContext();

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

  // Do before first setting of value
  const type = useWatch({ name: "type" });

  useEffect(() => {
    // set default value only once on mount
    setValue("type", "formula_based");
  }, [setValue]);

  const renderCommonFormContentTop = () => (
    <>
      <TextInputField
        name="slug"
        label={t("validation_rules.new.slug_field_label")}
        rules={{
          required: {
            value: true,
            message: t(
              "common.forms.validation.required_error_message_specific",
              {
                field: t("validation_rules.new.slug_field_label"),
              },
            ),
          },
        }}
      />
      <TextAreaField
        name="description"
        label={t("validation_rules.new.description_field_label")}
      />

      <SelectInputField
        as={ControlledSelectInput}
        name="level"
        label={t("validation_rules.new.level_field_label")}
        options={[
          {
            id: "info",
            value: "info",
            label: t("validation_rules.levels.info"),
          },
          {
            id: "warning",
            value: "warning",
            label: t("validation_rules.levels.warning"),
          },
          {
            id: "error",
            value: "error",
            label: t("validation_rules.levels.error"),
          },
        ]}
        isSearchable={false}
        hasSearchInput={false}
        rules={{
          required: {
            value: true,
            message: t(
              "common.forms.validation.required_error_message_specific",
              {
                field: t("validation_rules.new.level_field_label"),
              },
            ),
          },
        }}
        marginBottom="normal"
      />

      <TextInputField
        name="range"
        label={t("validation_rules.new.range_field_label")}
        rules={{
          required: {
            value: true,
            message: t(
              "common.forms.validation.required_error_message_specific",
              {
                field: t("validation_rules.new.range_field_label"),
              },
            ),
          },
        }}
      />
    </>
  );

  const renderCommonFormContentBottom = () => (
    <TextAreaField
      name="message"
      label={t("validation_rules.new.message_field_label")}
    />
  );

  return (
    <DialogPanel>
      <DialogHeader>
        <DialogTitle>{t("validation_rules.new.dialog_title")}</DialogTitle>
        <DialogCloseButton onClick={closeDialog} />
      </DialogHeader>

      <DialogBody padding="top" paddingTopSize="tabs">
        {/* No padding bottom as we want it to disappear behind footer */}
        <ScrollContainer scrollX={false} scrollY={true}>
          <TabGroup>
            <DialogTabList className={styles.DialogTabList}>
              <Tab3 onClick={() => setValue("type", "formula_based")}>
                {t("validation_rules.new.formula_based_tab_label")}
              </Tab3>
              <Tab3 onClick={() => setValue("type", "prompt_based")}>
                {t("validation_rules.new.prompt_based_tab_label")}
              </Tab3>
            </DialogTabList>

            <TabPanels>
              <TabPanel>
                <FormSection borderBottom={false}>
                  <DialogPaddingLR>
                    <FormVerticalSpacing>
                      {renderCommonFormContentTop()}
                      <FormulaBasedValidationRuleFormContent />
                      {renderCommonFormContentBottom()}
                    </FormVerticalSpacing>
                  </DialogPaddingLR>
                </FormSection>
              </TabPanel>
              <TabPanel>
                <FormSection>
                  <DialogPaddingLR>
                    <FormVerticalSpacing>
                      {renderCommonFormContentTop()}
                      <PromptFormField />
                    </FormVerticalSpacing>
                  </DialogPaddingLR>
                </FormSection>
                <PromptBasedValidationRuleFormContent />
                {/* <FormSection borderBottom={false}>
                  <DialogPaddingLR>
                    <FormVerticalSpacing>
                      {renderCommonFormContentBottom()}
                    </FormVerticalSpacing>
                  </DialogPaddingLR>
                </FormSection> */}
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </ScrollContainer>
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

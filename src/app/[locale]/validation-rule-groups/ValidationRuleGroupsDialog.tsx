import { Portal } from "@headlessui/react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";

import Button from "@/react-ui-library/components/buttons/button/Button";
import ButtonGroup from "@/react-ui-library/components/buttons/button-group/ButtonGroupContainer";
import RightAlignedContent from "@/react-ui-library/components/containers/right-aligned-content/RightAlignedContent";
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
import {
  Form,
  FormSection,
  FormSectionTitle,
} from "@/react-ui-library/components/forms/Forms";
import ControlledSelect from "@/react-ui-library/components/inputs/select-inputs/ControlledSelect";
import Select from "@/react-ui-library/components/inputs/select-inputs/Select";
import { List, ListItem } from "@/react-ui-library/components/lists/List";
import Tab1 from "@/react-ui-library/components/tabs/Tab1/Tab1";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@/react-ui-library/components/tabs/Tabs";

import styles from "./ValidationRuleGroupsDialog.module.css";
import ValidationRuleItem from "./ValidationRuleItem";
import ValidationRuleItems from "./ValidationRuleItems";

export default function ValidationRuleGroupsDialog({
  validationRuleGroupsDialogOpen,
  setValidationRuleGroupsDialogOpen,
}) {
  const t = useTranslations();
  //   const formMethods = useFormContext();

  const closeDialog = () => {
    setValidationRuleGroupsDialogOpen(false);
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
    <Dialog
      isOpen={validationRuleGroupsDialogOpen}
      setIsOpen={setValidationRuleGroupsDialogOpen}
    >
      <Form
        onSubmit={(data) => {
          console.log(data);
        }}
      >
        <DialogPanel>
          <DialogHeader>
            <DialogTitle>
              {t("validation_rule_groups.new.dialog_title")}
            </DialogTitle>
            <DialogCloseButton onClick={closeDialog} />
          </DialogHeader>

          <DialogBody>
            <DialogPaddingLR>
              <FormSection>
                <TextInputField
                  name="name"
                  label={t("validation_rule_groups.new.name_field_label")}
                  rules={{
                    required: {
                      value: true,
                      message: t(
                        "validation_rule_groups.new.name_required_error_message"
                      ),
                    },
                  }}
                />
                <TextAreaField
                  name="description"
                  label={t(
                    "validation_rule_groups.new.description_field_label"
                  )}
                />
              </FormSection>
            </DialogPaddingLR>

            <FormSection>
              <DialogPaddingLR>
                <FormSectionTitle>
                  {t(
                    "validation_rule_groups.new.validation_rules_form_section_title"
                  )}
                </FormSectionTitle>
              </DialogPaddingLR>
              <ValidationRuleItems />
            </FormSection>
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

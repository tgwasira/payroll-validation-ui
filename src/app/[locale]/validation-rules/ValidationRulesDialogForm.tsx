import {
  // CalendarIcon,
  HashIcon,
  TextTIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { useValidationRuleMutations } from "@/hooks/api/validation-service/useValidationRules";
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
  DialogTabGroup,
  DialogTabList,
  DialogTitle,
} from "@/react-ui-library/components/dialogs/Dialog";
import DialogFooterButtonGroup from "@/react-ui-library/components/dialogs/dialog-footer-button-group/DialogFooterButtonGroup";
import FileUpload from "@/react-ui-library/components/file-upload/FileUpload_";
import SelectInputField from "@/react-ui-library/components/forms/form-fields/select-input-field/SelectInputField";
import TextAreaField from "@/react-ui-library/components/forms/form-fields/text-area-field/TextAreaField";
import TextInputField from "@/react-ui-library/components/forms/form-fields/text-input-field/TextInputField";
import { Form } from "@/react-ui-library/components/forms/Forms";
import ControlledSelectInput from "@/react-ui-library/components/forms/inputs/select-inputs/ControlledSelectInput";
import SelectInput from "@/react-ui-library/components/forms/inputs/select-inputs/SelectInput";
import Tab1 from "@/react-ui-library/components/tabs/Tab1/Tab1";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@/react-ui-library/components/tabs/Tabs";
import { Tab3, TabList3 } from "@/react-ui-library/components/tabs/tabs3/Tabs3";
import CalendarIcon from "@/react-ui-library/icons/CalendarIcon";
import TypeIcon from "@/react-ui-library/icons/TypeIcon";

import NumberFields from "./data-type-specific-fields/NumberFields";
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

  // const type = useWatch({ name: "type" });
  const [dataType, setDataType] = useState(null);
  const [criteria, setCriteria] = useState(null);

  const criteriaOptionsMap = {
    number: [
      {
        id: "is_equal_to",
        value: "is_equal_to",
        label: t("validation_rules.new.criteria_field_options.is_equal_to"),
      },
      {
        id: "is_greater_than",
        value: "is_greater_than",
        label: t("validation_rules.new.criteria_field_options.is_greater_than"),
      },
      {
        id: "is_greater_than_or_equal_to",
        value: "is_greater_than_or_equal_to",
        label: t(
          "validation_rules.new.criteria_field_options.is_greater_than_or_equal_to"
        ),
      },
      {
        id: "is_less_than",
        value: "is_less_than",
        label: t("validation_rules.new.criteria_field_options.is_less_than"),
      },
      {
        id: "is_less_than_or_equal_to",
        value: "is_less_than_or_equal_to",
        label: t(
          "validation_rules.new.criteria_field_options.is_less_than_or_equal_to"
        ),
      },
    ],
    text: [],
    date: [],
  };

  useEffect(() => {
    // set default value only once on mount
    setValue("type", "formula_based");
  }, [setValue]);

  return (
    <DialogPanel>
      <DialogHeader>
        <DialogTitle>{t("validation_rules.new.dialog_title")}</DialogTitle>
        <DialogCloseButton onClick={closeDialog} />
      </DialogHeader>

      <DialogBody padding="top">
        {/* No padding bottom as we want it to disappear behind footer */}
        <ScrollContainer>
          <DialogPaddingLR>
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
                  <TextInputField
                    name="name"
                    label={t("validation_rules.new.name_field_label")}
                    rules={{
                      required: {
                        value: true,
                        message: t(
                          "common.forms.validation.required_error_message_specific",
                          {
                            field: t("validation_rules.new.name_field_label"),
                          }
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
                          "common.forms.validation.required_error_message_specific",
                          {
                            field: t("validation_rules.new.range_field_label"),
                          }
                        ),
                      },
                    }}
                  />

                  <SelectInputField
                    as={SelectInput}
                    name="data_type"
                    value={dataType}
                    setValue={setDataType}
                    label={t("validation_rules.new.data_type_field_label")}
                    options={[
                      {
                        id: "number",
                        value: "number",
                        label: t(
                          "validation_rules.new.data_type_field_options.number"
                        ),
                        renderLabelOption: () => (
                          <div className={styles.DataTypeOptionLabel}>
                            <HashIcon
                              weight="bold"
                              className="icon-medium icon-secondary"
                            />
                            {t(
                              "validation_rules.new.data_type_field_options.number"
                            )}
                          </div>
                        ),
                      },
                      {
                        id: "text",
                        value: "text",
                        label: t(
                          "validation_rules.new.data_type_field_options.text"
                        ),
                        renderLabelOption: () => (
                          <div className={styles.DataTypeOptionLabel}>
                            <TypeIcon className="icon-medium icon-secondary" />
                            {t(
                              "validation_rules.new.data_type_field_options.text"
                            )}
                          </div>
                        ),
                      },
                      {
                        id: "date",
                        value: "date",
                        label: t(
                          "validation_rules.new.data_type_field_options.date"
                        ),
                        renderLabelOption: () => (
                          <div className={styles.DataTypeOptionLabel}>
                            <CalendarIcon className="icon-medium icon-secondary" />
                            {t(
                              "validation_rules.new.data_type_field_options.date"
                            )}
                          </div>
                        ),
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
                            field: t(
                              "validation_rules.new.data_type_field_label"
                            ),
                          }
                        ),
                      },
                    }}
                    marginBottom="normal"
                  />

                  <SelectInputField
                    as={SelectInput}
                    name="criteria"
                    value={criteria}
                    setValue={setCriteria}
                    label={t("validation_rules.new.criteria_field_label")}
                    options={[
                      ...(criteriaOptionsMap[dataType?.id] ?? []),
                      {
                        id: "custom_formula",
                        value: "custom_formula",
                        label: t(
                          "validation_rules.new.criteria_field_options.custom_formula"
                        ),
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
                            field: t(
                              "validation_rules.new.criteria_field_label"
                            ),
                          }
                        ),
                      },
                    }}
                    marginBottom="normal"
                  />

                  {dataType?.id === "number" && (
                    <NumberFields criteria={criteria} />
                  )}

                  {criteria?.id === "custom_formula" && (
                    <TextInputField
                      name="formula_based_validation_rule.formula"
                      label={t("validation_rules.new.formula_field_label")}
                      rules={{
                        required: {
                          value: true,
                          message: t(
                            "common.forms.validation.required_error_message_specific",
                            {
                              field: t(
                                "validation_rules.new.formula_field_label"
                              ),
                            }
                          ),
                        },
                      }}
                    />
                  )}

                  <SelectInputField
                    as={ControlledSelectInput}
                    name="level"
                    label={t("validation_rules.new.level_field_label")}
                    options={[
                      {
                        id: "info",
                        value: "info",
                        label: t("validation_rules.level_options.info"),
                      },
                      {
                        id: "warning",
                        value: "warning",
                        label: t("validation_rules.level_options.warning"),
                      },
                      {
                        id: "error",
                        value: "error",
                        label: t("validation_rules.level_options.error"),
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
                          }
                        ),
                      },
                    }}
                    marginBottom="normal"
                  />

                  <TextAreaField
                    name="message"
                    label={t("validation_rules.new.message_field_label")}
                  />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </DialogPaddingLR>
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

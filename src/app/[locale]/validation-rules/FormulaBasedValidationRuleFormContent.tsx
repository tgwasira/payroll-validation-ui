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
import FileUpload from "@/react-ui-library/components/file-upload/file-upload/FileUpload_";
import { HorizontalFormFieldGroup } from "@/react-ui-library/components/forms/form-fields/form-field-groups/FormFieldGroups";
import NumericInputField from "@/react-ui-library/components/forms/form-fields/numeric-input-field/NumericInputField";
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

export default function FormulaBasedValidationRuleFormContent() {
  const t = useTranslations();
  const dataTypeId = useWatch({ name: "data_type" });
  const criteriaId = useWatch({ name: "criteria" });
  // const [dataType, setDataType] = useState(null);
  // const [criteria, setCriteria] = useState(null);

  const criteriaOptionsMap = {
    number: [
      {
        id: "is_equal_to",
        value: "is_equal_to",
        label: t("validation_rules.new.criteria_field_options.is_equal_to"),
      },
      {
        id: "is_not_equal_to",
        value: "is_not_equal_to",
        label: t("validation_rules.new.criteria_field_options.is_not_equal_to"),
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
      {
        id: "is_between_exclusive",
        value: "is_between_exclusive",
        label: t(
          "validation_rules.new.criteria_field_options.is_between_exclusive"
        ),
      },
      {
        id: "is_outside_of_exclusive",
        value: "is_outside_of_exclusive",
        label: t(
          "validation_rules.new.criteria_field_options.is_outside_of_exclusive"
        ),
      },
    ],
    text: [
      {
        id: "is_equal_to",
        value: "is_equal_to",
        label: t("validation_rules.new.criteria_field_options.is_equal_to"),
      },
      {
        id: "is_not_equal_to",
        value: "is_not_equal_to",
        label: t("validation_rules.new.criteria_field_options.is_not_equal_to"),
      },
      {
        id: "contains",
        value: "contains",
        label: t("validation_rules.new.criteria_field_options.contains"),
      },
      {
        id: "does_not_contain",
        value: "does_not_contain",
        label: t(
          "validation_rules.new.criteria_field_options.does_not_contain"
        ),
      },
      {
        id: "starts_with",
        value: "starts_with",
        label: t("validation_rules.new.criteria_field_options.starts_with"),
      },
      {
        id: "ends_with",
        value: "ends_with",
        label: t("validation_rules.new.criteria_field_options.ends_with"),
      },
      {
        id: "is_empty",
        value: "is_empty",
        label: t("validation_rules.new.criteria_field_options.is_empty"),
      },
      {
        id: "is_not_empty",
        value: "is_not_empty",
        label: t("validation_rules.new.criteria_field_options.is_not_empty"),
      },
      {
        id: "matches_pattern",
        value: "matches_pattern",
        label: t("validation_rules.new.criteria_field_options.matches_pattern"),
      },
    ],
    date: [],
  };

  return (
    <>
      {/* We are registering then so that we can get validation from react-hook-form. We'll compute the formula on submit and then delete these fields. */}
      <SelectInputField
        as={ControlledSelectInput}
        name="data_type"
        label={t("validation_rules.new.data_type_field_label")}
        options={[
          {
            id: "number",
            value: "number",
            label: t("validation_rules.new.data_type_field_options.number"),
            renderLabelOption: () => (
              <div className={styles.DataTypeOptionLabel}>
                <HashIcon
                  weight="bold"
                  className="icon-medium icon-secondary"
                />
                {t("validation_rules.new.data_type_field_options.number")}
              </div>
            ),
          },
          {
            id: "text",
            value: "text",
            label: t("validation_rules.new.data_type_field_options.text"),
            renderLabelOption: () => (
              <div className={styles.DataTypeOptionLabel}>
                <TypeIcon className="icon-medium icon-secondary" />
                {t("validation_rules.new.data_type_field_options.text")}
              </div>
            ),
          },
          {
            id: "date",
            value: "date",
            label: t("validation_rules.new.data_type_field_options.date"),
            renderLabelOption: () => (
              <div className={styles.DataTypeOptionLabel}>
                <CalendarIcon className="icon-medium icon-secondary" />
                {t("validation_rules.new.data_type_field_options.date")}
              </div>
            ),
          },
        ]}
        hasSearchInput={false}
        rules={{
          required: {
            value: true,
            message: t(
              "common.forms.validation.required_error_message_specific",
              {
                field: t("validation_rules.new.data_type_field_label"),
              }
            ),
          },
        }}
        marginBottom="normal"
      />

      <SelectInputField
        as={ControlledSelectInput}
        name="criteria"
        isSearchable={true}
        label={t("validation_rules.new.criteria_field_label")}
        options={[
          ...(criteriaOptionsMap[dataTypeId] ?? []),
          {
            id: "custom_formula",
            value: "custom_formula",
            label: t(
              "validation_rules.new.criteria_field_options.custom_formula"
            ),
          },
        ]}
        hasSearchInput={false}
        rules={{
          required: {
            value: true,
            message: t(
              "common.forms.validation.required_error_message_specific",
              {
                field: t("validation_rules.new.criteria_field_label"),
              }
            ),
          },
        }}
        marginBottom="normal"
      />

      {/* Define these as regular fields so that they can be validated with react-hook-form and then determine the formula on submit the delete these fields. */}
      {/* Number fields that require a numeric value */}
      {dataTypeId === "number" &&
        (criteriaId === "is_equal_to" ||
          criteriaId === "is_not_equal_to" ||
          criteriaId === "is_greater_than" ||
          criteriaId === "is_greater_than_or_equal_to" ||
          criteriaId === "is_less_than" ||
          criteriaId === "is_less_than_or_equal_to") && (
          <NumericInputField
            name="value"
            label={t("validation_rules.new.value_field_label")}
            rules={{
              required: {
                value: true,
                message: t(
                  "common.forms.validation.required_error_message_specific",
                  {
                    field: t("validation_rules.new.value_field_label"),
                  }
                ),
              },
            }}
          />
        )}

      {/* Text fields that require a text value */}
      {dataTypeId === "text" &&
        (criteriaId === "is_equal_to" ||
          criteriaId === "is_not_equal_to" ||
          criteriaId === "contains" ||
          criteriaId === "does_not_contain" ||
          criteriaId === "starts_with" ||
          criteriaId === "ends_with" ||
          criteriaId === "matches_pattern") && (
          <TextInputField
            name="value"
            label={t("validation_rules.new.value_field_label")}
            rules={{
              required: {
                value: true,
                message: t(
                  "common.forms.validation.required_error_message_specific",
                  {
                    field: t("validation_rules.new.value_field_label"),
                  }
                ),
              },
            }}
          />
        )}

      {dataTypeId === "number" &&
        (criteriaId === "is_between_exclusive" ||
          criteriaId === "is_outside_of_exclusive") && (
          <HorizontalFormFieldGroup>
            <NumericInputField
              name="min_value"
              label={t("validation_rules.new.min_value_field_label")}
              rules={{
                required: {
                  value: true,
                  message: t(
                    "common.forms.validation.required_error_message_specific",
                    {
                      field: t("validation_rules.new.min_value_field_label"),
                    }
                  ),
                },
              }}
              stretch
            />

            <div className="flex-center text-semibold">
              {t("common.general.and")}
            </div>
            <NumericInputField
              name="max_value"
              label={t("validation_rules.new.max_value_field_label")}
              rules={{
                required: {
                  value: true,
                  message: t(
                    "common.forms.validation.required_error_message_specific",
                    {
                      field: t("validation_rules.new.max_value_field_label"),
                    }
                  ),
                },
              }}
              stretch
            />
          </HorizontalFormFieldGroup>
        )}

      {criteriaId === "custom_formula" && (
        <TextInputField
          name="formula_based_validation_rule.formula"
          label={t("validation_rules.new.formula_field_label")}
          rules={{
            required: {
              value: true,
              message: t(
                "common.forms.validation.required_error_message_specific",
                {
                  field: t("validation_rules.new.formula_field_label"),
                }
              ),
            },
          }}
        />
      )}
    </>
  );
}

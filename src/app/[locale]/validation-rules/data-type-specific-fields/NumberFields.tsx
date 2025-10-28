import { useTranslations } from "next-intl";
import React from "react";

import NumericInputField from "@/react-ui-library/components/forms/form-fields/numeric-input-field/NumericInputField";
import TextInputField from "@/react-ui-library/components/forms/form-fields/text-input-field/TextInputField";

export default function NumberFields({ criteria }) {
  const t = useTranslations();

  // TODO: Set formula field value

  return (
    <NumericInputField
      name="formula_based_validation_rule.formula"
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
  );
}

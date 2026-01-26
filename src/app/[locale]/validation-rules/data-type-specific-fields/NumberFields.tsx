import { useTranslations } from "next-intl";
import React from "react";

import NumericInputField from "@algion/react-ui-library/components/forms/form-fields/numeric-input-field/NumericInputField";
import TextInputField from "@algion/react-ui-library/components/forms/form-fields/text-input-field/TextInputField";

export default function NumberFields({ criteria }) {
  const t = useTranslations();
  const criteriaId = criteria?.id;

  // TODO: Set formula field value
}

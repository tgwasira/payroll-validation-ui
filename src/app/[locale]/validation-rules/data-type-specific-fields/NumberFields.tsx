// @ts-nocheck
import { NumericInputField } from "@algion-co/react-ui-library/components/forms/form-fields/numeric-input-field/NumericInputField";
import { TextInputField } from "@algion-co/react-ui-library/components/forms/form-fields/text-input-field/TextInputField";
import { useTranslations } from "next-intl";
import React from "react";

export default function NumberFields({ criteria }) {
  const t = useTranslations();
  const criteriaId = criteria?.id;

  // TODO: Set formula field value
}

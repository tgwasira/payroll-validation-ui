import { useTranslations } from "next-intl";
import React from "react";

import Button from "@/react-ui-library/components/buttons/button/Button";

export default function NewValidationRuleButton({ onClick }) {
  const t = useTranslations();

  return (
    <Button onClick={onClick}>
      <div className="text-as-icon-large">+</div>
      {t("validation_rules.list.new_validation_rule_button_label")}
    </Button>
  );
}

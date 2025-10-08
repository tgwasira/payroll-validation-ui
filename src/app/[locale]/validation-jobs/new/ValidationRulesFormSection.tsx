import { useTranslations } from "next-intl";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { useValidationRules } from "@/hooks/api/validation-service/useValidationRules";
import Button from "@/react-ui-library/components/buttons/button/Button";
import PageSection, {
  PageSectionPadding,
} from "@/react-ui-library/components/containers/page-section/PageSection";
import PageSectionHeader from "@/react-ui-library/components/containers/page-section/PageSectionHeader";
import { List, ListItem } from "@/react-ui-library/components/lists/List";
import { Menu } from "@/react-ui-library/components/menu/Menu";
import { MenuButton } from "@/react-ui-library/components/menu/MenuButton";
import { MenuDropdown } from "@/react-ui-library/components/menu/MenuDropdown";
import MenuItemsList from "@/react-ui-library/components/menu/MenuItemsList";
import PageSectionTitle from "@/react-ui-library/components/text/page-section-title/PageSectionTitle";
import PlusIcon from "@/react-ui-library/icons/PlusIcon";

export default function ValidationRulesFormSection() {
  const t = useTranslations();

  const { control } = useFormContext();
  // TODO: Store the ID and have another separate state for the object. And then
  // remove weird process you have to extract IDs on submit.
  const { fields, append, remove } = useFieldArray({
    name: "validationRules",
    rules: { required: true },
    control,
  });

  const { validationRules, loading, error, fetchValidationRules } =
    useValidationRules();
  const display = "name";

  return (
    <PageSection padding="top bottom">
      <PageSectionPadding padding="left right">
        <PageSectionHeader>
          <PageSectionTitle>
            {t("validation_jobs.new.validation_rules_section_title")}
          </PageSectionTitle>
        </PageSectionHeader>
      </PageSectionPadding>

      <PageSectionPadding
        hasPaddingTop={false}
        hasPaddingBottom={false}
        paddingSize="half"
      >
        <List>
          {fields.map((item, index) => {
            return (
              <ListItem
                key={item.id}
                bgHover={true}
                hasSeparator={true}
                removeButton={true}
                onRemove={() => remove(index)}
                padding="page-section-half"
              >
                <div>{item[display]}</div>
              </ListItem>
            );
          })}
          {/* <ValidationRuleItem>Validation rule item</ValidationRuleItem>
                <ValidationRuleItem>Validation rule item</ValidationRuleItem>
                <ValidationRuleItem>Validation rule item</ValidationRuleItem> */}
        </List>

        <Menu placement="bottom-end" dropdownWidth="container">
          <MenuButton as={Button} variant="tertiary" padding="text-icon-left">
            <PlusIcon />
            {t("validation_rule_groups.new.add_validation_rule_button_label")}
          </MenuButton>
          {/* TODO: CSS variable? */}
          <MenuDropdown>
            <MenuItemsList
              options={validationRules}
              display={display}
              searchable={true}
              onMenuItemClick={(option) => append(option)}
            />
          </MenuDropdown>
        </Menu>
      </PageSectionPadding>
    </PageSection>
  );
}

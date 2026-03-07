// @ts-nocheck
import { Button } from "@algion-co/react-ui-library";
import { PageSection, PageSectionSpacing } from "@algion-co/react-ui-library";
import {
  PageSectionContentsSpacing,
  PageSectionHeader,
} from "@algion-co/react-ui-library";
import { EmptyState1 } from "@algion-co/react-ui-library";
import { List, ListItem } from "@algion-co/react-ui-library";
import { Menu } from "@algion-co/react-ui-library";
import { MenuButton } from "@algion-co/react-ui-library";
import { MenuDropdown } from "@algion-co/react-ui-library";
import { MenuItemsList } from "@algion-co/react-ui-library";
import { PageSectionTitle } from "@algion-co/react-ui-library";
import { PlusIcon } from "@algion-co/react-ui-library";
import { useTranslations } from "next-intl";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  ValidationRulesList,
  ValidationRulesListPaddingLR,
} from "@/components/validation-rules-list/ValidationRulesList";
import { useValidationRules } from "@/hooks/api/validation-service/useValidationRules";

import ValidationRuleItems from "../../validation-rule-groups/ValidationRuleItems";

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
  const display = "slug";

  return (
    <PageSection padding="top bottom">
      <PageSectionSpacing padding="left right">
        <PageSectionHeader>
          <PageSectionTitle>
            {t("validation_jobs.new.validation_rules_section_title")}
          </PageSectionTitle>
        </PageSectionHeader>
      </PageSectionSpacing>

      {/* <PageSectionSpacing padding={"none"} paddingSize="half"> */}
      {/* Give an equal margin as page section header */}
      {/* TODO: Consider making this a component for page section content spacing the have small, large, etc. and even specifics */}

      {/* <EmptyState1
        heading={t(
          "validation_jobs.new.validation_rules_page_section.empty_state_heading"
        )}
        align="left"
      /> */}

      <ValidationRulesList validationRules={fields} />

      {/* <List>
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
      {/* </List> */}
      {/* TODO: Combine with ContentsSpacing */}
      <PageSectionSpacing padding="left right" margin="top" marginSize="small">
        <Menu placement="bottom-end" dropdownWidth="container">
          <MenuButton as={Button} variant="secondary" padding="text-icon-left">
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
      </PageSectionSpacing>
    </PageSection>
  );
}

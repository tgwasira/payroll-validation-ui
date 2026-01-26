import { XIcon } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Button from "@algion/react-ui-library/components/buttons/button/Button";
import RightAlignedContent from "@algion/react-ui-library/components/containers/right-aligned-content/RightAlignedContent";
import { DialogPaddingLR } from "@algion/react-ui-library/components/dialogs/Dialog";
import SearchableSelect from "@algion/react-ui-library/components/forms/inputs/select-forms/inputs/SearchableSelect";
import Select from "@algion/react-ui-library/components/forms/inputs/select-forms/inputs/Select";
import { List, ListItem } from "@algion/react-ui-library/components/lists/List";
import { Menu } from "@algion/react-ui-library/components/menu/Menu";
import { MenuButton } from "@algion/react-ui-library/components/menu/MenuButton";
import { MenuDropdown } from "@algion/react-ui-library/components/menu/MenuDropdown";
import MenuItemsList from "@algion/react-ui-library/components/menu/MenuItemsList";

import styles from "./ValidationRuleItems.module.css";

export default function ValidationRuleItems() {
  const t = useTranslations();

  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "validation_rules",
    rules: { required: true },
    control,
  });

  //   const [value, setValue] = useState(null);

  return (
    <>
      <List className={styles.ValidationRuleItems}>
        {fields.map((item, index) => {
          return (
            <ListItem
              key={item.id}
              bgHover={true}
              removeButton={true}
              onRemove={() => remove(index)}
            >
              <div>{item.label}</div>
            </ListItem>
          );
        })}
        {/* <ValidationRuleItem>Validation rule item</ValidationRuleItem>
                <ValidationRuleItem>Validation rule item</ValidationRuleItem>
                <ValidationRuleItem>Validation rule item</ValidationRuleItem> */}
      </List>
      <DialogPaddingLR>
        <Menu placement="bottom-end" dropdownWidth="container">
          <RightAlignedContent
            className={styles.AddValidationRuleButtonContainer}
          >
            <MenuButton as={Button} variant="secondary">
              <div className="text-as-icon-large">+</div>
              {t("validation_rule_groups.new.add_validation_rule_button_label")}
            </MenuButton>
          </RightAlignedContent>
          <MenuDropdown>
            <MenuItemsList
              options={[
                { id: "abc", label: "ABC" },
                { id: "def", label: "DEF" },
              ]}
              searchable={true}
              onMenuItemClick={(option) => append(option)}
            />
          </MenuDropdown>
        </Menu>
      </DialogPaddingLR>
    </>
  );
}

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { CaretRightIcon } from "@phosphor-icons/react";
import React from "react";

import IconOnlyButton from "@/react-ui-library/components/buttons/icon-only-button/IconOnlyButton";
import { List, ListItem } from "@/react-ui-library/components/lists/List";
import Tag from "@/react-ui-library/components/tags/tag/Tag";

import ValidationRuleTag from "../validation-rule-tag/ValidationRuleTag";
import styles from "./ValidationRulesList.module.css";

export function ValidationRulesListPaddingLR({ children }) {
  return <div className={styles.ValidationRulesListPaddingLR}>{children}</div>;
}

export default function ValidationRulesList({ validationRules }) {
  return (
    <ul className={`${styles.ValidationRulesList}`}>
      {validationRules?.map((item, index) => {
        return (
          <li key={item.id}>
            {/* TODO: Make icon fill height of container i.e. matching tag */}
            {item.type === "validation-rule-group" ? (
              <Disclosure>
                <div
                  className={`${styles.ValidationRuleListRow} ${styles.ValidationRule}`}
                >
                  <DisclosureButton
                    as={IconOnlyButton}
                    variant="tertiary"
                    className={`bg-hover ${styles.DropdownButton}`}
                  >
                    <CaretRightIcon className="icon-dropdown" weight="bold" />
                  </DisclosureButton>

                  <ValidationRuleTag type="group" name={item["name"]} />
                </div>
                <DisclosurePanel
                  as="ul"
                  className={styles.ValidationRuleSinglesList}
                >
                  <div
                    className={`${styles.ValidationRuleListRow} ${styles.ValidationRuleSingleWrapper}`}
                  >
                    <div className={styles.HorizontalSeparator} />
                    <ValidationRuleTag
                      name={item["name"]}
                      className={styles.ValidationRule}
                    />
                  </div>
                  <div
                    className={`${styles.ValidationRuleListRow} ${styles.ValidationRuleSingleWrapper}`}
                  >
                    <div className={styles.HorizontalSeparator} />
                    <ValidationRuleTag
                      name={item["name"]}
                      className={styles.ValidationRule}
                    />
                  </div>
                </DisclosurePanel>
              </Disclosure>
            ) : (
              <div
                className={`${styles.ValidationRuleListRow} ${styles.ValidationRuleSingleWrapperNoDisclosure}`}
              >
                <ValidationRuleTag
                  name={item["name"]}
                  className={styles.ValidationRule}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

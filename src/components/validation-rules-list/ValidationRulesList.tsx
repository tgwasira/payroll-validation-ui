import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { CaretRightIcon } from "@phosphor-icons/react";
import React from "react";

import IconOnlyButton from "@algion/react-ui-library/components/buttons/icon-only-button/IconOnlyButton";
import { List, ListItem } from "@algion/react-ui-library/components/lists/List";
import Tag from "@algion/react-ui-library/components/tags/tag/Tag";

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
                    <DropdownIcon direction="right" />
                  </DisclosureButton>

                  <ValidationRuleTag type="group" slug={item["slug"]} />
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
                      slug={item["slug"]}
                      className={styles.ValidationRule}
                    />
                  </div>
                  <div
                    className={`${styles.ValidationRuleListRow} ${styles.ValidationRuleSingleWrapper}`}
                  >
                    <div className={styles.HorizontalSeparator} />
                    <ValidationRuleTag
                      slug={item["slug"]}
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
                  slug={item["slug"]}
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

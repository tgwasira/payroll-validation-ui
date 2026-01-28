import { XIcon } from "@phosphor-icons/react/dist/ssr";
import React from "react";

import { ListItem } from "@algion-co/react-ui-library/components/lists/List";

import styles from "./ValidationRuleItem.module.css";

export default function ValidationRuleItem({ className = "", children }) {
  return (
    <ListItem
      removeButton={true}
      bgHover={true}
      className={`${styles.ValidationRuleItem} ${className}`}
    >
      {children}
    </ListItem>
  );
}

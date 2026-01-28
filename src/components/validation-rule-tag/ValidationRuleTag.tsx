import { Tag } from "@algion-co/react-ui-library/components/tags/tag/Tag";
import { StackIcon } from "@phosphor-icons/react";
import React from "react";

// import FunctionIcon from "@algion-co/react-ui-library/icons/FunctionIcon";
import styles from "./ValidationRuleTag.module.css";

export function ValidationRuleTag({
  as = "div",
  slug,
  type = "",
  className = "",
  style = {},
}) {
  return (
    <Tag
      as={as}
      className={`${styles.ValidationRuleTag} ${className}`}
      style={style}
    >
      {type === "group" && (
        <div>
          <StackIcon className="icon-base" />
        </div>
      )}

      <div className={styles.Text}>{slug}</div>
    </Tag>
  );
}

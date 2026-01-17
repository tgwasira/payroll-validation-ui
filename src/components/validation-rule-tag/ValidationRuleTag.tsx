import { StackIcon } from "@phosphor-icons/react";
import React from "react";

import Tag from "@/react-ui-library/components/tags/tag/Tag";
import FunctionIcon from "@/react-ui-library/icons/FunctionIcon";

import styles from "./ValidationRuleTag.module.css";

export default function ValidationRuleTag({
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

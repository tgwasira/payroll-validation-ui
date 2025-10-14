import { StackIcon } from "@phosphor-icons/react";
import React from "react";

import Tag from "@/react-ui-library/components/tags/tag/Tag";

import styles from "./ValidationRuleTag.module.css";

export default function ValidationRuleTag({
  as = "div",
  name,
  type = "single",
  className = "",
}) {
  return (
    <Tag as={as} className={`${styles.ValidationRuleTag} ${className}`}>
      {type === "group" && (
        <div>
          <StackIcon className="icon-base" />
        </div>
      )}
      <div>{name}</div>
    </Tag>
  );
}

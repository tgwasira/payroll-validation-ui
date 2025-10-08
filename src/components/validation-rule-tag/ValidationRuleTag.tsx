import { StackIcon } from "@phosphor-icons/react";
import React from "react";

import Tag from "@/react-ui-library/components/tags/tag/Tag";

export default function ValidationRuleTag({ name, type }) {
  return (
    <Tag>
      {type === "validation-rule-group" && (
        <StackIcon className="icon-medium" />
      )}
      {name}
    </Tag>
  );
}

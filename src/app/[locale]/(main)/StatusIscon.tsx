// @ts-nocheck
import {
  CheckCircleIcon,
  StackIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";

import styles from "./StatusIcon.module.css";

const statusIconMap = {
  "validation-error": {
    Icon: WarningCircleIcon,
    className: styles.ValidationErrorIcon,
  },
  "validation-warning": {
    Icon: WarningCircleIcon,
    className: styles.ValidationWarningIcon,
  },
  cancelled: {
    Icon: XCircleIcon,
    className: styles.CancelledIcon,
  },
  success: {
    Icon: CheckCircleIcon,
    className: styles.SuccessIcon,
  },
};

export default function StatusIcon({ status }) {
  const statusConfig = statusIconMap[status];
  if (!statusConfig) return null;

  const { Icon, className } = statusConfig;

  return (
    <div className={styles.StatusIconContainer}>
      <Icon weight="fill" className={`icon-large ${className}`} />
    </div>
  );
}

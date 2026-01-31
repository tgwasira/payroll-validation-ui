// @ts-nocheck
import { Sidebar } from "@algion-co/react-ui-library/components/sidebar/Sidebar";
import { SidebarBranding } from "@algion-co/react-ui-library/components/sidebar/SidebarBranding";
import { SidebarTabGroup } from "@algion-co/react-ui-library/components/sidebar/SidebarTabGroup";
import {
  FileMagnifyingGlassIcon,
  ListChecksIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import React from "react";

import { BrandingLight } from "@/components/BrandingLight";

import routes from "../routes";
import styles from "./AppSidebar.module.css";

/**
 *
 * A wrapper component that for a Sidebar its child components.
 */
export default function AppSidebar() {
  const t = useTranslations("sidebar");

  const sidebarTabs = [
    {
      id: "validation-jobs", // do not use numbers as they are difficult to manage
      label: t("validation_jobs_tab_label"),
      icon: <FileMagnifyingGlassIcon className="icon-large" />, // instantiate here to pass any props specific to the icon
      href: routes.validationJobs.list,
    },
    {
      id: "validation-rules-and-rule-groups",
      label: t("validation_rules_and_rule_groups_tab_label"),
      icon: <ListChecksIcon className="icon-large" />,
      sidebarSecondaryTabs: [
        // {
        //   id: "validation-rule-groups",
        //   label: t("validation_rule_groups_tab_label"),
        //   href: routes.validationRuleGroups.list,
        // },
        {
          id: "validation-rules",
          label: t("validation_rules_tab_label"),
          href: routes.validationRules.list,
        },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarTabGroup sidebarTabs={sidebarTabs} />
    </Sidebar>
  );
}

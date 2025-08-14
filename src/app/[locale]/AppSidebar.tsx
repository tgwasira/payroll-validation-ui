import {
  FileMagnifyingGlassIcon,
  ListChecksIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import React from "react";

import Sidebar from "@/react-ui-library/components/sidebar/Sidebar";
import SidebarTabGroup from "@/react-ui-library/components/sidebar/SidebarTabGroup";

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
      icon: <FileMagnifyingGlassIcon className="icon-base" />, // instantiate here to pass any props specific to the icon
      href: "/en",
      sidebarSecondaryTabs: [
        {
          id: "validation-jobs-history",
          label: "Validation Jobs History",
          href: "/en",
        },
        {
          id: "validation-jobs-create",
          label: "Create Validation Job",
          href: "/",
        },
      ],
    },
    {
      id: "validation-rules",
      label: t("validation_rules_tab_label"),
      icon: <ListChecksIcon className="icon-base" />,
      // href: '',
    },
  ];

  return (
    <Sidebar>
      <SidebarTabGroup sidebarTabs={sidebarTabs} />
    </Sidebar>
  );
}

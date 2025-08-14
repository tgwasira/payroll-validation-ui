import { useTranslations } from "next-intl";
import React from "react";

import Searchbar from "@/react-ui-library/components/searchbar/Searchbar";
import Topbar from "@/react-ui-library/components/topbar/Topbar";

import styles from "./AppTopbar.module.css";

export default function AppTopbar() {
  const t = useTranslations("topbar");

  return (
    <Topbar>
      <Searchbar
        placeholder={t("search_placeholder")}
        className={styles.AppTopbar__Searchbar}
      />
    </Topbar>
  );
}

import { useTranslations } from "next-intl";
import React from "react";

import SearchInput from "@/react-ui-library/components/inputs/search-input/SearchInput";
import SidebarBranding from "@/react-ui-library/components/sidebar/SidebarBranding";
import SidebarHeader from "@/react-ui-library/components/sidebar/sidebar-header/SidebarHeader";
import Topbar, {
  TopbarMainContent,
} from "@/react-ui-library/components/topbar/Topbar";

import logogram from "../../../public/logogram.png";
import styles from "./AppTopbar.module.css";

export default function AppTopbar() {
  const t = useTranslations("topbar");

  return (
    <Topbar>
      <SidebarHeader logogram={logogram} name={"Algion"} />
      <TopbarMainContent>
        <SearchInput
          placeholder={t("search_placeholder")}
          className={styles.AppTopbar__Searchbar}
        />
      </TopbarMainContent>
    </Topbar>
  );
}

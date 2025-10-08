"use client";

import { useTranslations } from "next-intl";
import React from "react";

import Avatar from "@/react-ui-library/components/avatars/Avatar";
import Button from "@/react-ui-library/components/buttons/button/Button";
import SearchInput from "@/react-ui-library/components/inputs/search-input/SearchInput";
import { Menu } from "@/react-ui-library/components/menu/Menu";
import { MenuButton } from "@/react-ui-library/components/menu/MenuButton";
import { MenuDropdown } from "@/react-ui-library/components/menu/MenuDropdown";
import { MenuItem } from "@/react-ui-library/components/menu/MenuItem";
import MenuItems from "@/react-ui-library/components/menu/MenuItems";
import SidebarHeader from "@/react-ui-library/components/sidebar/sidebar-header/SidebarHeader";
import SidebarBranding from "@/react-ui-library/components/sidebar/SidebarBranding";
import Topbar, {
  TopbarMainContent,
} from "@/react-ui-library/components/topbar/Topbar";
import DropdownIcon from "@/react-ui-library/icons/dropdown-icon/DropdownIcon";

import logogram from "../../../public/logogram.png";
import styles from "./AppTopbar.module.css";

export default function AppTopbar() {
  const t = useTranslations("topbar");

  return (
    <Topbar>
      <SidebarHeader logogram={logogram} name={"Algion"} />
      <TopbarMainContent className={styles.MainContent}>
        <SearchInput
          placeholder={t("search_placeholder")}
          className={styles.AppTopbar__Searchbar}
        />
        <Menu placement="bottom-end">
          <MenuButton as={Button} variant="tertiary">
            <Avatar text="T" />
            <DropdownIcon />
          </MenuButton>
          <MenuDropdown>
            <MenuItems>
              <MenuItem>Hgkgyuhgyo8y76i78t65f6g76g876g8g666i</MenuItem>
            </MenuItems>
          </MenuDropdown>
        </Menu>
      </TopbarMainContent>
    </Topbar>
  );
}

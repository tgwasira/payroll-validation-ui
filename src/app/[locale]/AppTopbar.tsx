// @ts-nocheck
"use client";

import { Avatar } from "@algion-co/react-ui-library";
import { Button } from "@algion-co/react-ui-library";
import { DropdownIcon } from "@algion-co/react-ui-library/DropdownIcon";
import { Menu } from "@algion-co/react-ui-library/Menu";
import { MenuButton } from "@algion-co/react-ui-library/MenuButton";
import { MenuDropdown } from "@algion-co/react-ui-library/MenuDropdown";
import { MenuItem } from "@algion-co/react-ui-library/MenuItem";
import { MenuItems } from "@algion-co/react-ui-library/MenuItems";
import { SearchInput } from "@algion-co/react-ui-library/SearchInput";
import { SidebarBranding } from "@algion-co/react-ui-library/SidebarBranding";
import { SidebarHeader } from "@algion-co/react-ui-library/SidebarHeader";
import { Topbar, TopbarMainContent } from "@algion-co/react-ui-library/Topbar";
import { useTranslations } from "next-intl";
import React from "react";

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

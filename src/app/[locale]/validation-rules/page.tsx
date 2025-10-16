"use client";

import "react-loading-skeleton/dist/skeleton.css";

import { StackIcon } from "@phosphor-icons/react/dist/ssr";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import routes from "@/app/routes";
import NewValidationRuleButton from "@/components/buttons/NewValidationRuleButton";
import { useValidationRules } from "@/hooks/api/validation-service/useValidationRules";
import Button from "@/react-ui-library/components/buttons/button/Button";
import Checkbox from "@/react-ui-library/components/checkboxes/Checkbox";
import PageContent from "@/react-ui-library/components/containers/page-content/PageContent";
import PageSection from "@/react-ui-library/components/containers/page-section/PageSection";
import ScrollContainer from "@/react-ui-library/components/containers/scroll-container/ScrollContainer";
import Input from "@/react-ui-library/components/forms/inputs/Input";
import SearchInput from "@/react-ui-library/components/forms/inputs/search-input/SearchInput";
import MenuItemsList from "@/react-ui-library/components/menu/MenuItemsList";
import PageHeader from "@/react-ui-library/components/page-elements/page-header/PageHeader";
import Table from "@/react-ui-library/components/tables/table/Table";
import TableSearchbar from "@/react-ui-library/components/tables/table-searchbar/TableSearchbar";
import TableToolbar from "@/react-ui-library/components/tables/table-toolbar/TableToolbar";
import getActionsColumn from "@/react-ui-library/components/tables/utils/getActionsColumn";
import getCheckboxColumn from "@/react-ui-library/components/tables/utils/getCheckboxColumn";
import Tag from "@/react-ui-library/components/tags/tag/Tag";
import TagGroup from "@/react-ui-library/components/tags/tag-group/TagGroup";
import PageTitle from "@/react-ui-library/components/text/page-title/PageTitle";
import { useApi } from "@/react-ui-library/hooks/useApi";
import MSExcelIcon from "@/react-ui-library/icons/MSExcelIcon";
import type { ValidationRule } from "@/types/validationServiceTypes";

import ValidationRulesDialog from "./ValidationRulesDialog";

/**
 * Validation rules list page.
 */
export default function ValidationRules() {
  const t = useTranslations();

  const handleNewValidationRuleButtonClick = () => {
    setValidationRulesDialogOpen(true);
  };

  // --- Tables ---
  // Validation rules table
  const columnHelper = createColumnHelper<ValidationRule>();
  const columns = [
    getCheckboxColumn("checkbox", columnHelper),
    columnHelper.accessor("name", {
      header: t("validation_rules.list.table.name_column_label"),
      meta: {
        style: { width: "30%" },
      },
    }),
    columnHelper.accessor("description", {
      header: t("validation_rules.list.table.description_column_label"),
      meta: {
        // loadingCell: () => <Skeleton count={2} />,
        style: { width: "70%" },
      },
    }),
    getActionsColumn("actions", columnHelper, () => (
      <MenuItemsList
        options={[
          {
            id: "edit",
            label: "Edit",
            onClick: (option) => {
              console.log(option);
            },
          },
          {
            id: "delete",
            label: "Delete",
            onClick: (option) => {
              console.log(option);
            },
          },
        ]}
        padded={true}
      />
    )),
  ];

  // --- Dialogs ---
  const [validationRulesDialogOpen, setValidationRulesDialogOpen] =
    useState(false);

  // --- Data fetching ---
  const { validationRules, loading, error, fetchValidationRules } =
    useValidationRules();

  const parentRef = useRef(null);
  const childRef = useRef(null);

  useEffect(() => {
    function resize() {
      if (parentRef.current && childRef.current) {
        const parentHeight = parentRef.current.offsetHeight;
        childRef.current.style.height = `${parentHeight}px`;
      }
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <PageContent
      style={{
        // position: "relative",
        display: "flex",
        flexDirection: "column",
        // overflow: "hidden",
        height: "100%",
        // top: 0,
        // bottom: 0,
      }}
    >
      <PageHeader>
        <PageTitle>{t("validation_rules.list.list_page_title")}</PageTitle>
        <NewValidationRuleButton onClick={handleNewValidationRuleButtonClick} />
      </PageHeader>
      {/* <div
        style={{
          // flex: "1 1 auto",
          // minHeight: 0,
          overflow: "hidden",
          backgroundColor: "blue",
        }}
      > */}
      {/* <div> */}
      {/* <div
          ref={childRef}
          style={{
            background: "purple",
            border: "3px solid black",
            overflow: "hidden",
          }}
        > */}
      <PageSection
        padding="none"
        style={{
          height: "auto",
          //maxHeight: "200px", // needs height for scroll container to work
          // background: "yellow",

          // height: "100%",
          // maxHeight: "100%",
          // backgroundColor: "blue",
          // flex: "1 1 auto",
          // maxHeight: "100%",
          // overflow: "auto",
          // minHeight: 0,
          // flexShrink: "1 !important",
          // flexBasis: "0 !important",
          // maxHeight: "100%",
          // position: "absolute",
          // top: "0",
          // bottom: "0",
          // display: "flex",
          // flexDirection: "column",
          // width: "100%",
          // overflow: "auto",
          // height: "100%",
          // minHeight: 0,
          // height: parentHeight,
        }}
      >
        {/* <div ref={childRef}> */}
        {/* <div style={{ position: "relative", height: "100%", top: "0" }}> */}
        {/* Table Toolbar */}
        <TableToolbar
          searchbarPlaceholder={t(
            "validation_rules.list.validation_rules_search_placeholder"
          )}
        />

        {/* Validation Jobs Table */}
        {/* <ScrollContainer ref={childRef}> */}
        {/* <div style={{ height: "200px" }}> */}
        <Table
          data={validationRules}
          columns={columns}
          emptyStateHeading={t(
            "validation_rules.list.table.empty_state_heading"
          )}
          emptyStateSupportingText={t(
            "validation_rules.list.table.empty_state_supporting_text"
          )}
          renderButton1={() => (
            <NewValidationRuleButton
              onClick={handleNewValidationRuleButtonClick}
            />
          )}
          //
          loading={loading}
          loadingRows={40}
          error={error}
          scrollable={true}
          // scrollTableWrapperStyle={{
          //   maxHeight: "100%",
          // backgroundColor: "green",
          // height: "100%",
          // flexGrow: 1,
          // height: "100%",
          // flexGrow: 1,
          // position: "absolute",
          // height: "100%",
          // width: "100%",
          // }}
        />
        {/* </div> */}
        {/* Pagination */}
        {/* <Pagination /> */}
        {/* </div> */}
        {/* </ScrollContainer> */}
        {/* </div> */}
      </PageSection>
      {/* </div> */}
      {/* </div> */}
      <ValidationRulesDialog
        validationRulesDialogOpen={validationRulesDialogOpen}
        setValidationRulesDialogOpen={setValidationRulesDialogOpen}
        fetchValidationRules={fetchValidationRules}
      />
    </PageContent>
  );
}

"use client";

// import "react-loading-skeleton/dist/skeleton.css";

import { StackIcon } from "@phosphor-icons/react/dist/ssr";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import routes from "@/app/routes";
import NewValidationRuleButton from "@/components/buttons/NewValidationRuleButton";
import { LOADING_ROWS } from "@/constants";
import { useValidationRules } from "@/hooks/api/validation-service/useValidationRules";
import Button from "@algion-co/react-ui-library/components/buttons/button/Button";
import Checkbox from "@algion-co/react-ui-library/components/checkboxes/Checkbox";
import PageContent from "@algion-co/react-ui-library/components/containers/page-content/PageContent";
import PageSection from "@algion-co/react-ui-library/components/containers/page-section/PageSection";
import ScrollContainer from "@algion-co/react-ui-library/components/containers/scroll-container/ScrollContainer";
import Input from "@algion-co/react-ui-library/components/forms/inputs/Input";
import SearchInput from "@algion-co/react-ui-library/components/forms/inputs/search-input/SearchInput";
import MenuItemsList from "@algion-co/react-ui-library/components/menu/MenuItemsList";
import PageHeader from "@algion-co/react-ui-library/components/page-elements/page-header/PageHeader";
import Table from "@algion-co/react-ui-library/components/tables/table/Table";
import TablePagination from "@algion-co/react-ui-library/components/tables/table-pagination/TablePagination";
import TableSearchbar from "@algion-co/react-ui-library/components/tables/table-searchbar/TableSearchbar";
import TableToolbar from "@algion-co/react-ui-library/components/tables/table-toolbar/TableToolbar";
import getActionsColumn from "@algion-co/react-ui-library/components/tables/utils/getActionsColumn";
import getCheckboxColumn from "@algion-co/react-ui-library/components/tables/utils/getCheckboxColumn";
import Tag from "@algion-co/react-ui-library/components/tags/tag/Tag";
import TagGroup from "@algion-co/react-ui-library/components/tags/tag-group/TagGroup";
import PageTitle from "@algion-co/react-ui-library/components/text/page-title/PageTitle";
import { useApi } from "@algion-co/react-ui-library/hooks/useApi";
import FunctionIcon from "@algion-co/react-ui-library/icons/FunctionIcon";
import MSExcelIcon from "@algion-co/react-ui-library/icons/MSExcelIcon";
import SparklesIcon from "@algion-co/react-ui-library/icons/SparklesIcon";
import { capitalize } from "@algion-co/react-ui-library/utils/stringUtils";
import type { ValidationRule } from "@/types/validationServiceTypes";

import ValidationRulesDialog from "./ValidationRulesDialog";

/**
 * Validation rules list page.
 */
export default function ValidationRules() {
  const t = useTranslations();

  // --- Tables ---
  // Validation rules table
  const columnHelper = createColumnHelper<ValidationRule>();
  const columns = [
    getCheckboxColumn("checkbox", columnHelper),
    columnHelper.accessor("type", {
      header: "",
      cell: (info) => {
        const type = info.getValue();
        if (type === "formula_based") {
          return <FunctionIcon className={`icon-medium icon-secondary`} />;
        } else if (type === "prompt_based") {
          return <SparklesIcon className={`icon-large icon-secondary`} />;
        } else {
          return <></>;
        }
      },
      meta: {
        // style: { width: "30%" },
      },
    }),
    columnHelper.accessor("slug", {
      header: t("validation_rules.list.table.name_column_label"),
      meta: {
        style: { width: "30%" },
      },
    }),
    columnHelper.accessor("description", {
      header: t("validation_rules.list.table.description_column_label"),
      meta: {
        // loadingCell: () => <Skeleton count={2} />,
        style: { width: "40%" },
      },
    }),
    columnHelper.accessor("level", {
      header: t("validation_rules.list.table.level_column_label"),
      //No need to style the value because it's not actually showing a status
      cell: (info) => {
        const level = info.getValue();
        if (level === "info")
          return <Tag type="info">{t("validation_rules.levels.info")}</Tag>;
        else if (level === "warning")
          return (
            <Tag type={"warning"}>{t("validation_rules.levels.warning")}</Tag>
          );
        else if (level === "error")
          return <Tag type={"error"}>{t("validation_rules.levels.error")}</Tag>;
        // const types = {
        //   info: "normal",
        //   error: "danger",
        //   warning: "warning",
        // };
        // const values = {
        //   info: t("validation_rules.levels.info"),
        //   error: t("validation_rules.levels.error"),
        //   warning: t("validation_rules.levels.warning"),
        // };
        // return (
        //   <Tag type={types[info.getValue() as keyof typeof types] || "normal"}>
        //     {values[info.getValue() as keyof typeof values] || info.getValue()}
        //   </Tag>
        // );
      },
      meta: {
        // loadingCell: () => <Skeleton count={2} />,
        style: { width: "30%" },
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
  const { validationRules, loading, error, fetchValidationRules, pagination } =
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

  const hasValidationRules = validationRules && validationRules.length > 0;

  const renderAddValidationRuleButton = () => (
    <Button onClick={() => setValidationRulesDialogOpen(true)}>
      <div className="text-as-icon-large">+</div>
      {t("validation_rules.list.new_validation_rule_button_label")}
    </Button>
  );
  const disabled = loading || !hasValidationRules;

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
        {renderAddValidationRuleButton()}
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
      {/* //TODO Consider making a page section for table or a table wrapper with all these styles. TableContainer? Shouldpotentially be includable in a PageSection. Then you can have different styling options for it as standalone. Or consider using as prop to render it as a page section or a sub section */}
      <PageSection
        padding="none"
        // Important to set flex and flexDirection here because scroll container sets its height to 100% which needs flex to not take parent's height when other siblings are present.
        flex={true}
        flexDirection="column"
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
            "validation_rules.list.validation_rules_search_placeholder",
          )}
          disabled={disabled}
        />

        {/* Validation Jobs Table */}
        {/* <ScrollContainer ref={childRef}> */}
        {/* <div style={{ height: "200px" }}> */}
        {/* TODO: Text is disappearing at bottom. Seems to need some padding or something. */}
        <Table
          data={validationRules}
          columns={columns}
          emptyStateHeading={t(
            "validation_rules.list.table.empty_state_heading",
          )}
          emptyStateSupportingText={t(
            "validation_rules.list.table.empty_state_supporting_text",
          )}
          emptyStateRenderButton1={renderAddValidationRuleButton}
          //
          loading={loading}
          // TODO: Make this a variable
          loadingRows={LOADING_ROWS}
          error={error}
          scrollable={true}
          disabled={disabled}
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

        {(loading || hasValidationRules) && (
          <TablePagination
            currentPage={pagination.currentPage}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={(page) => fetchValidationRules(page)}
            onItemsPerPageChange={(itemsPerPage) => {
              fetchValidationRules(1, itemsPerPage);
            }}
            isLoading={loading}
          />
        )}
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

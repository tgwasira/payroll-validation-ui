"use client";

import { StackIcon } from "@phosphor-icons/react/dist/ssr";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";

import routes from "@/app/routes";
import { useValidationRuleGroups } from "@/hooks/api/validation-service/useValidationRuleGroups";
import Button from "@/react-ui-library/components/buttons/button/Button";
import Checkbox from "@/react-ui-library/components/checkboxes/Checkbox";
import PageContent from "@/react-ui-library/components/containers/page-content/PageContent";
import PageSection from "@/react-ui-library/components/containers/page-section/PageSection";
import PageHeader from "@/react-ui-library/components/page-elements/page-header/PageHeader";
import Input from "@/react-ui-library/components/forms/inputs/Input";
import SearchInput from "@/react-ui-library/components/forms/inputs/search-input/SearchInput";
import Table from "@/react-ui-library/components/tables/table/Table";
import TablePagination from "@/react-ui-library/components/tables/table-pagination/TablePagination";
import TableSearchbar from "@/react-ui-library/components/tables/table-searchbar/TableSearchbar";
import TableToolbar from "@/react-ui-library/components/tables/table-toolbar/TableToolbar";
import getCheckboxColumn from "@/react-ui-library/components/tables/utils/getCheckboxColumn";
import Tag from "@/react-ui-library/components/tags/tag/Tag";
import TagGroup from "@/react-ui-library/components/tags/tag-group/TagGroup";
import PageTitle from "@/react-ui-library/components/text/page-title/PageTitle";
import MSExcelIcon from "@/react-ui-library/icons/MSExcelIcon";
import type { ValidationRuleGroup } from "@/types/validationServiceTypes";

import ValidationRuleGroupsDialog from "./ValidationRuleGroupsDialog";

export default function ValidationRuleGroups() {
  const t = useTranslations();

  const { validationRuleGroups, loading, error, fetchValidationRuleGroups, pagination } =
    useValidationRuleGroups();

  const columnHelper = createColumnHelper<ValidationRuleGroup>();

  const dataSourceIcons = {};

  const columns = [
    getCheckboxColumn("checkbox", columnHelper),
    columnHelper.accessor("name", {
      header: t(
        "validation_rule_groups.list.validation_rule_groups_table.name_column_label"
      ),
      meta: {
        style: { width: "40%" },
      },
    }),
    columnHelper.accessor("description", {
      header: t(
        "validation_rule_groups.list.validation_rule_groups_table.description_column_label"
      ),
      meta: {
        style: { width: "60%" },
      },
    }),
  ];

  const hasValidationRuleGroups = validationRuleGroups && validationRuleGroups.length > 0;
  const disabled = loading || !hasValidationRuleGroups;
  const [validationRuleGroupsDialogOpen, setValidationRuleGroupsDialogOpen] =
    useState(false);

  return (
    <PageContent>
      <PageHeader>
        <PageTitle>
          {t("validation_rule_groups.list.list_page_title")}
        </PageTitle>
        <Button onClick={() => setValidationRuleGroupsDialogOpen(true)}>
          <div className="text-as-icon-large">+</div>
          {t(
            "validation_rule_groups.list.new_validation_rule_group_button_label"
          )}
        </Button>
      </PageHeader>
      <PageSection>
        {/* Table Toolbar */}
        <TableToolbar
          searchbarPlaceholder={t(
            "validation_rule_groups.list.validation_rule_groups_search_placeholder"
          )}
          disabled={disabled}
        />

        {/* Validation Rule Groups Table */}
        <Table 
          data={validationRuleGroups} 
          columns={columns} 
          loading={loading}
          error={error}
          disabled={disabled}
          emptyStateHeading={t("common.tables.empty_state_default_heading", {
            item_name_plural: "Validation Rule Groups",
          })}
          emptyStateSupportingText={t(
            "common.tables.empty_state_default_supporting_text",
            { item_name: "validation rule group" }
          )}
        />

        {/* Pagination */}
        {(loading || hasValidationRuleGroups) && (
          <TablePagination 
            currentPage={pagination.currentPage}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={(page) => fetchValidationRuleGroups(page)}
            onItemsPerPageChange={(itemsPerPage) => {
              fetchValidationRuleGroups(1, itemsPerPage);
            }}
            isLoading={loading}
          />
        )}
      </PageSection>
      <ValidationRuleGroupsDialog
        validationRuleGroupsDialogOpen={validationRuleGroupsDialogOpen}
        setValidationRuleGroupsDialogOpen={setValidationRuleGroupsDialogOpen}
      />
    </PageContent>
  );
}

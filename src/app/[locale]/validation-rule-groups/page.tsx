"use client";

import { StackIcon } from "@phosphor-icons/react/dist/ssr";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";

import routes from "@/app/routes";
import Button from "@/react-ui-library/components/buttons/button/Button";
import Checkbox from "@/react-ui-library/components/checkboxes/Checkbox";
import PageContent from "@/react-ui-library/components/containers/page-content/PageContent";
import PageSection from "@/react-ui-library/components/containers/page-section/PageSection";
import PageHeader from "@/react-ui-library/components/page-elements/page-header/PageHeader";
import Input from "@/react-ui-library/components/forms/inputs/Input";
import SearchInput from "@/react-ui-library/components/forms/inputs/search-input/SearchInput";
import Table from "@/react-ui-library/components/tables/table/Table";
import TableSearchbar from "@/react-ui-library/components/tables/table-searchbar/TableSearchbar";
import TableToolbar from "@/react-ui-library/components/tables/table-toolbar/TableToolbar";
import getCheckboxColumn from "@/react-ui-library/components/tables/utils/getCheckboxColumn";
import Tag from "@/react-ui-library/components/tags/tag/Tag";
import TagGroup from "@/react-ui-library/components/tags/tag-group/TagGroup";
import PageTitle from "@/react-ui-library/components/text/page-title/PageTitle";
import MSExcelIcon from "@/react-ui-library/icons/MSExcelIcon";

import ValidationRuleGroupsDialog from "./ValidationRuleGroupsDialog";

type ValidationRuleGroup = {
  name: string;
  description?: string;
  validationRules: any[];
  age: number;
  visits: number;
  status: string;
  progress: number;
};

export default function ValidationRuleGroups() {
  const t = useTranslations();

  const defaultData: ValidationRuleGroup[] = [
    {
      name: "No Empty Cells",
      description: "A validation rule group that checks for empty cells.",
      validationRules: [
        { id: 2, name: "id-is-required", type: "validation-rule" },
      ],
    },
    {
      name: [{ id: 20, type: "ms-excel", name: "File 2.xls" }],
      validationRules: [
        { id: 2, name: "id-is-required", type: "validation-rule" },
      ],
      status: "validation-warning",
    },
  ];

  const columnHelper = createColumnHelper<ValidationRuleGroup>();

  const dataSourceIcons = {};

  const columns = [
    getCheckboxColumn("checkbox", columnHelper),
    columnHelper.accessor("name", {
      header: t(
        "validation_rule_groups.list.validation_rule_groups_table.name_column_label"
      ),
      meta: {
        style: { width: "30%" },
      },
    }),
    columnHelper.accessor("description", {
      header: t(
        "validation_rule_groups.list.validation_rule_groups_table.description_column_label"
      ),
      meta: {
        style: { width: "30%" },
      },
    }),
    columnHelper.accessor("validationRules", {
      header: t(
        "validation_rule_groups.list.validation_rule_groups_table.validation_rules_column_label"
      ),
      cell: (info) => {
        const validationRules = info.getValue();

        return (
          <TagGroup>
            {validationRules.map((validationRule) => (
              <Tag key={validationRule.id}>{validationRule.name}</Tag>
            ))}
          </TagGroup>
        );
      },
      meta: {
        style: { width: "40%" },
      },
    }),
  ];

  const [data, setData] = useState(() => [...defaultData]);
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
        />

        {/* Validation Jobs Table */}
        <Table data={data} columns={columns} />

        {/* Pagination */}
        {/* <Pagination /> */}
      </PageSection>
      <ValidationRuleGroupsDialog
        validationRuleGroupsDialogOpen={validationRuleGroupsDialogOpen}
        setValidationRuleGroupsDialogOpen={setValidationRuleGroupsDialogOpen}
      />
    </PageContent>
  );
}

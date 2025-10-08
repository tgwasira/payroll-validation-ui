import { useTranslations } from "next-intl";
import React from "react";

import { List, ListItem } from "@/react-ui-library/components/lists/List";
import MSExcelIcon from "@/react-ui-library/icons/MSExcelIcon";
import {
  formatFileSize,
  getFileExtension,
} from "@/react-ui-library/utils/fileUtils";

import styles from "./FilesList.module.css";

// TODO: Move to library?
type FileType = {
  name: string;
  size: number;
  // Add other properties if needed
};

interface FilesListProps {
  files: FileType[];
}

export default function FilesList({ files }: FilesListProps) {
  const t = useTranslations();

  return (
    <List>
      {/* TODO: Add hover effect for remove button */}
      {files.map((file, index) => {
        const fileExtension = getFileExtension(file);
        let iconElement;
        if (fileExtension === "xlsx" || fileExtension === "xls") {
          iconElement = <MSExcelIcon className="icon-xxxlarge" />;
        } else if (fileExtension === "csv") {
          // TODO: Fix these
          iconElement = <div className="icon-xxxlarge">CSV</div>;
        } else {
          iconElement = <div className="icon-xxxlarge">FILE</div>;
        }

        return (
          <ListItem
            key={index}
            hasBorder={true}
            removeButton={true}
            padding="large"
            borderRadius="large"
            marginBottom="large"
          >
            <div className={styles.IconNameAndSize}>
              {iconElement}
              <div className={styles.NameAndSize}>
                <div>{file.name}</div>
                <div className={styles.Size}>{formatFileSize(file.size)}</div>
              </div>
            </div>
          </ListItem>
        );
      })}
    </List>
  );
}

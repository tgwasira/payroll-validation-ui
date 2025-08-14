import React from "react";

import styles from "./Pagination.module.css";

export default function Pagination() {
  return (
    <div className={styles.PaginationContainer}>
      {/* Pagination component content goes here */}
      <p>1 - 10 of 300</p>
      <div>Rows per page:</div>
    </div>
  );
}

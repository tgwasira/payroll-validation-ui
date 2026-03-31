// @ts-nocheck
import { Toaster } from "@algion-co/react-ui-library";
import { Topbar } from "@algion-co/react-ui-library";

import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import { ValidationProgressProvider } from "./validation-jobs/ValidationProgressContext";

export default function MainLayout({ children }) {
  return (
    <ValidationProgressProvider>
      <div className="body-wrapper">
        <AppTopbar />
        <div className="page-wrapper">
          <AppSidebar />
          <div className="page-content">{children}</div>
          <Toaster />
        </div>
      </div>
    </ValidationProgressProvider>
  );
}

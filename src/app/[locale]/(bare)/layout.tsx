import { Toaster } from "@algion-co/react-ui-library";
import { Topbar } from "@algion-co/react-ui-library";

import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import { ValidationProgressProvider } from "./validation-jobs/ValidationProgressContext";

export default function BareLayout({ children }) {
  return (
    <>
      <div className="page-content">{children}</div>
      <Toaster variant="urgent" />
    </>
  );
}

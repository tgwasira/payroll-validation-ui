import { Toaster } from "@algion-co/react-ui-library";

export default function BareLayout({ children }) {
  return (
    <>
      <div className="page-content">{children}</div>
      <Toaster variant="urgent" />
    </>
  );
}

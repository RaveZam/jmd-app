import { ReactElement, ReactNode } from "react";
export function ModalPanel({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <div className="pointer-events-auto w-full max-w-lg rounded-2xl border bg-background shadow-xl">
      {children}
    </div>
  );
}

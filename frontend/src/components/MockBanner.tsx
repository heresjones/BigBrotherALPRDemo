import type { ReactNode } from "react";

export function MockBanner({ children }: { children: ReactNode }) {
  return (
    <div className="alert alert-warning d-flex align-items-start" role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2 mt-1"></i>
      <div>{children}</div>
    </div>
  );
}

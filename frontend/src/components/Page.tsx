import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="app-content-header">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-sm-6">
            <h1 className="mb-0 fs-3">{title}</h1>
            {lead && <p className="text-body-secondary mb-0 mt-1">{lead}</p>}
          </div>
          <div className="col-sm-6">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {title}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageContent({ children }: { children: ReactNode }) {
  return (
    <div className="app-content">
      <div className="container-fluid">{children}</div>
    </div>
  );
}

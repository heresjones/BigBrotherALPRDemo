import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface SmallBoxProps {
  value: string;
  label: string;
  icon: string;
  variant: "primary" | "success" | "warning" | "danger" | "secondary" | "info";
  to?: string;
  linkText?: string;
  chart?: ReactNode;
}

export function SmallBox({ value, label, icon, variant, to, linkText = "More info", chart }: SmallBoxProps) {
  return (
    <div className="col-lg-3 col-6">
      <div className={`small-box text-bg-${variant}`}>
        <div className="inner">
          <h3>{value}</h3>
          <p>
            <i className={`bi bi-${icon} me-1`} aria-hidden="true"></i>
            {label}
          </p>
        </div>
        {chart ? (
          <div className="small-box-chart">{chart}</div>
        ) : (
          <i className={`small-box-icon bi bi-${icon}`} aria-hidden="true"></i>
        )}
        {to && (
          <Link
            to={to}
            className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
          >
            {linkText} <i className="bi bi-arrow-right-circle"></i>
          </Link>
        )}
      </div>
    </div>
  );
}

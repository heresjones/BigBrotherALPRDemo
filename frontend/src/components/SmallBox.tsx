import { Link } from "react-router-dom";

interface SmallBoxProps {
  value: string;
  label: string;
  icon: string;
  variant: "primary" | "success" | "warning" | "danger" | "secondary";
  to?: string;
  linkText?: string;
}

export function SmallBox({ value, label, icon, variant, to, linkText = "More info" }: SmallBoxProps) {
  return (
    <div className="col-lg-3 col-6">
      <div className={`small-box text-bg-${variant}`}>
        <div className="inner">
          <h3>{value}</h3>
          <p>{label}</p>
        </div>
        <i className={`small-box-icon bi bi-${icon}`} aria-hidden="true"></i>
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

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageHeader, PageContent } from "./Page";
import { scenarioBySlug } from "../data/scenarios";

export function ConcernCallout({ children }: { children: ReactNode }) {
  return (
    <div className="alert alert-info d-flex align-items-start mb-4" role="alert">
      <i className="bi bi-info-circle-fill me-2 mt-1"></i>
      <div>
        <strong>Public concern.</strong> {children}
      </div>
    </div>
  );
}

export function RevealQuote({ children, show = true }: { children: ReactNode; show?: boolean }) {
  if (!show) return null;
  return (
    <div className="card bg-dark text-white mt-4">
      <div className="card-body d-flex align-items-center gap-3">
        <i className="bi bi-quote fs-1 opacity-50"></i>
        <blockquote className="mb-0 fs-5 fst-italic">{children}</blockquote>
      </div>
    </div>
  );
}

export interface SafeguardItem {
  id: string;
  label: string;
  description?: string;
}

export function SafeguardPanel({
  title,
  items,
  enabled,
  onToggle,
}: {
  title: string;
  items: SafeguardItem[];
  enabled: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body">
        {items.map((item) => (
          <div className="form-check form-switch mb-2" key={item.id}>
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id={`safeguard-${item.id}`}
              checked={enabled[item.id] ?? false}
              onChange={() => onToggle(item.id)}
            />
            <label className="form-check-label" htmlFor={`safeguard-${item.id}`}>
              {item.label}
              {item.description && <div className="text-body-secondary small">{item.description}</div>}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScenarioPage({
  slug,
  revealed = true,
  children,
}: {
  slug: string;
  revealed?: boolean;
  children: ReactNode;
}) {
  const meta = scenarioBySlug(slug);
  if (!meta) return null;
  return (
    <>
      <PageHeader title={meta.title} />
      <PageContent>
        <Link to="/demos" className="btn btn-outline-secondary btn-sm mb-3">
          <i className="bi bi-arrow-left me-1"></i>
          Back to Scenario Library
        </Link>
        <ConcernCallout>{meta.concern}</ConcernCallout>
        {children}
        <RevealQuote show={revealed}>{meta.reveal}</RevealQuote>
      </PageContent>
    </>
  );
}

export function ScenarioCard({
  slug,
  index,
  title,
  concern,
  reveal,
}: {
  slug: string;
  index: number;
  title: string;
  concern: string;
  reveal: string;
}) {
  return (
    <div className="col-md-6 col-xl-4">
      <Link to={`/demos/${slug}`} className="text-decoration-none">
        <div className="card mb-4 h-100">
          <div className="card-body d-flex flex-column">
            <span className="badge text-bg-secondary align-self-start mb-2">Scenario {index}</span>
            <h5 className="text-body-emphasis mb-2">{title}</h5>
            <p className="text-body-secondary small flex-grow-1">{concern}</p>
            <p className="fst-italic small mb-0">&ldquo;{reveal}&rdquo;</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

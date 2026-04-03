import React from "react";

export default function PlaceholderPage({ title, subtitle }) {
  return (
    <main className="page-container py-10">
      <div className="section-card">
        <div className="section-card-body space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {title}
          </h1>
          {subtitle ? <p className="text-sm muted">{subtitle}</p> : null}
          <p className="text-sm muted">
            This page is currently a placeholder in the merged UI.
          </p>
        </div>
      </div>
    </main>
  );
}


"use client";

import { SearchX } from "lucide-react";

export default function LearnEmpty({ search }) {
  return (
    <div className="empty">
      <div className="empty__icon-wrapper">
        <SearchX size={26} strokeWidth={1.4} className="empty__icon" />
      </div>
      <h3 className="empty__title">No articles found</h3>
      <p className="empty__desc">
        {search
          ? `No results for "${search}". Try a different keyword or adjust the filters.`
          : "No articles match the selected filters. Try adjusting or clearing them."}
      </p>

      <style jsx>{`
        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 24px;
          gap: 14px;
          max-width: 400px;
          margin: 0 auto;
        }

        .empty__icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          margin-bottom: 4px;
        }

        .empty__icon {
          color: var(--text-3);
        }

        .empty__title {
          font-family: "DM Serif Display", Georgia, serif;
          font-size: 1.25rem;
          font-weight: 400;
          color: var(--text-2);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .empty__desc {
          font-size: 0.875rem;
          color: var(--text-3);
          line-height: 1.65;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
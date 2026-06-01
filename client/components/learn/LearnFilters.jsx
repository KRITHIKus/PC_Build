"use client";

import { Search, X } from "lucide-react";

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

export default function LearnFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  categories,
}) {
  const allCategories = ["All", ...categories];

  return (
    <div className="filters">
      {/* Search */}
      <div className="filters__search-wrapper">
        <Search size={14} className="filters__search-icon" strokeWidth={1.8} />
        <input
          type="text"
          placeholder="Search by title, summary or tag…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="filters__search"
        />
        {search && (
          <button
            className="filters__clear"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <X size={13} strokeWidth={2.2} />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="filters__row">
        <div className="filters__group">
          <span className="filters__label">Category</span>
          <div className="filters__chips">
            {allCategories.map((cat) => (
              <button
                key={cat}
                className={`filters__chip ${selectedCategory === cat ? "filters__chip--active" : ""}`}
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="filters__divider" />

        <div className="filters__group">
          <span className="filters__label">Difficulty</span>
          <div className="filters__chips">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                className={`filters__chip ${selectedDifficulty === diff ? "filters__chip--active" : ""}`}
                onClick={() => onDifficultyChange(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .filters {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 0 24px 40px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        /* Search */
        .filters__search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          max-width: 480px;
        }

        .filters__search-icon {
          position: absolute;
          left: 13px;
          color: var(--text-3);
          pointer-events: none;
          flex-shrink: 0;
        }

        .filters__search {
          width: 100%;
          background: var(--surface-1);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 38px 9px 38px;
          font-size: 0.84rem;
          color: var(--text-1);
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          box-sizing: border-box;
        }

        .filters__search::placeholder {
          color: var(--text-3);
        }

        .filters__search:focus {
          border-color: var(--red-border);
          box-shadow: 0 0 0 3px rgba(255, 59, 31, 0.07);
        }

        .filters__clear {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: var(--text-3);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.15s ease;
        }

        .filters__clear:hover {
          color: var(--text-1);
        }

        /* Filters row */
        .filters__row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0;
          padding: 10px 14px;
          background: var(--surface-1);
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        /* Vertical divider */
        .filters__divider {
          width: 1px;
          height: 24px;
          background: var(--border);
          flex-shrink: 0;
          margin: 0 16px;
        }

        /* Groups */
        .filters__group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          flex: 1;
          min-width: 0;
        }

        .filters__label {
          font-size: 0.67rem;
          font-weight: 600;
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .filters__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .filters__chip {
          padding: 3px 11px;
          border-radius: 6px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-3);
          font-size: 0.775rem;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
          font-weight: 400;
          white-space: nowrap;
          line-height: 1.6;
        }

        .filters__chip:hover {
          background: var(--surface-2);
          color: var(--text-2);
          border-color: var(--border);
        }

        .filters__chip--active {
          background: var(--red-muted);
          border-color: var(--red-border);
          color: var(--red);
          font-weight: 500;
        }

        .filters__chip--active:hover {
          background: var(--red-muted);
          border-color: var(--red);
          color: var(--red);
        }

        @media (max-width: 768px) {
          .filters__search-wrapper {
            max-width: 100%;
          }

          .filters__row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            padding: 12px 14px;
          }

          .filters__divider {
            width: 100%;
            height: 1px;
            margin: 0;
          }

          .filters__group {
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .filters {
            padding: 0 16px 32px;
          }
        }
      `}</style>
    </div>
  );
}
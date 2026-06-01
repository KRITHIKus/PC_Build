"use client";

import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowRight } from "lucide-react";

const DIFFICULTY_COLORS = {
  Beginner:     { color: "#22c55e", bg: "rgba(34,197,94,0.07)",  border: "rgba(34,197,94,0.22)"  },
  Intermediate: { color: "#f59e0b", bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.22)" },
  Advanced:     { color: "#ef4444", bg: "rgba(239,68,68,0.07)",  border: "rgba(239,68,68,0.22)"  },
};

export default function LearnCard({ article }) {
  const { title, slug, summary, category, difficulty, tags, coverImageUrl } = article;
  const diffStyle = DIFFICULTY_COLORS[difficulty] || {
    color: "var(--text-3)",
    bg: "var(--surface-2)",
    border: "var(--border)",
  };

  return (
    <article className="card">
      {/* Image */}
      <div className="card__image-wrapper">
        {coverImageUrl ? (
          <>
            <Image
              src={coverImageUrl}
              alt={title}
              fill
              className="card__image"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="card__image-overlay" />
          </>
        ) : (
          <div className="card__image-placeholder">
            <div className="card__placeholder-grid" aria-hidden="true" />
          </div>
        )}

        <div className="card__badges">
          {category && (
            <span className="card__badge card__badge--cat">{category}</span>
          )}
          {difficulty && (
            <span
              className="card__badge"
              style={{
                color:       diffStyle.color,
                background:  diffStyle.bg,
                borderColor: diffStyle.border,
              }}
            >
              {difficulty}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="card__body">
        <h2 className="card__title">{title}</h2>

        {summary && <p className="card__summary">{summary}</p>}

        {tags && tags.length > 0 && (
          <div className="card__tags">
            <Tag size={10} strokeWidth={1.6} className="card__tags-icon" />
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="card__tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="card__footer">
          <Link href={`/learn/${slug}`} className="card__cta">
            <span>Read article</span>
            <ArrowRight size={13} strokeWidth={1.8} className="card__cta-arrow" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        /* ── Shell ─────────────────────────────────────────────── */
        .card {
          background: var(--surface-1);
          border: 1px solid var(--border);
          border-radius: 2px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          transition:
            border-color 0.24s ease,
            box-shadow   0.24s ease,
            transform    0.24s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .card:hover {
          border-color: rgba(255, 59, 31, 0.32);
          box-shadow:
            0 0 0 1px rgba(255, 59, 31, 0.08),
            0 12px 40px rgba(0, 0, 0, 0.5),
            0 2px 8px rgba(0, 0, 0, 0.3);
          transform: translateY(-3px);
        }

        /* Bottom accent line on hover */
        .card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: var(--red);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .card:hover::after { transform: scaleX(1); }

        /* ── Image ─────────────────────────────────────────────── */
        .card__image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: var(--surface-2);
          overflow: hidden;
          flex-shrink: 0;
        }
        .card__image {
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .card:hover .card__image { transform: scale(1.05); }

        .card__image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10, 10, 14, 0.78) 0%,
            rgba(10, 10, 14, 0.1)  52%,
            transparent            100%
          );
        }

        /* Placeholder */
        .card__image-placeholder {
          position: absolute;
          inset: 0;
          background: var(--surface-2);
        }
        .card__placeholder-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 59, 31, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 59, 31, 0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* ── Badges ─────────────────────────────────────────────── */
        .card__badges {
          position: absolute;
          bottom: 12px;
          left: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          z-index: 1;
        }
        .card__badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 8px;
          border-radius: 2px;
          font-family: 'Courier New', monospace;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          border: 1px solid transparent;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .card__badge--cat {
          color: rgba(255, 255, 255, 0.78);
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(255, 255, 255, 0.16);
        }

        /* ── Body ───────────────────────────────────────────────── */
        .card__body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 20px 20px 22px;
          gap: 10px;
        }

        /* Title */
        .card__title {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-1);
          margin: 0;
          line-height: 1.55;
          letter-spacing: 0.01em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s ease;
        }
        .card:hover .card__title { color: #fff; }

        /* Summary */
        .card__summary {
          font-size: 0.8rem;
          color: var(--text-3);
          line-height: 1.7;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          letter-spacing: 0.01em;
        }

        /* Tags */
        .card__tags {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 1px;
        }
        .card__tags-icon { color: var(--text-3); flex-shrink: 0; }
        .card__tag {
          font-family: 'Courier New', monospace;
          font-size: 0.6rem;
          color: var(--text-3);
          background: var(--surface-3);
          border: 1px solid var(--border);
          border-radius: 1px;
          padding: 2px 7px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .card:hover .card__tag {
          border-color: rgba(255, 59, 31, 0.2);
          color: var(--text-2);
        }

        /* Footer */
        .card__footer {
          margin-top: auto;
          padding-top: 6px;
          border-top: 1px solid var(--border);
        }
        .card__cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0;
          background: none;
          border: none;
          color: var(--text-3);
          font-family: 'Courier New', monospace;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.18s ease;
        }
        .card__cta:hover { color: var(--red); }
        .card__cta-arrow {
          transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .card__cta:hover .card__cta-arrow { transform: translateX(3px); }

        /* ── Responsive ─────────────────────────────────────────── */
        @media (max-width: 640px) {
          .card__image-wrapper { aspect-ratio: 16 / 8; }
          .card__body { padding: 16px 16px 18px; }
          .card__title { font-size: 0.88rem; }
        }
      `}</style>
    </article>
  );
}
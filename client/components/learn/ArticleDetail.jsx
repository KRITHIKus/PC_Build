"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Tag, Clock, CalendarDays, ChevronUp, BookOpen } from "lucide-react";

const DIFFICULTY_META = {
  Beginner:     { color: "#4ade80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.2)",  dot: "#4ade80"  },
  Intermediate: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)",  dot: "#fbbf24"  },
  Advanced:     { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", dot: "#f87171"  },
};

function estimateReadTime(text) {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function ArticleDetail({ article }) {
  const router = useRouter();
  const contentRef = useRef(null);
  const [scrollProgress, setScrollProgress]   = useState(0);
  const [showScrollTop, setShowScrollTop]       = useState(false);
  const [heroLoaded, setHeroLoaded]             = useState(false);
  const [mounted, setMounted]                   = useState(false);

  const {
    title,
    summary,
    category,
    difficulty,
    tags,
    coverImageUrl,
    content,
    createdAt,
  } = article;

  const diffKey  = difficulty
    ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
    : "";
  const diffMeta = DIFFICULTY_META[diffKey] || {
    color: "var(--text-3)",
    bg: "var(--surface-2)",
    border: "var(--border)",
    dot: "var(--text-3)",
  };

  const readTime      = estimateReadTime(content);
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, progress));
      setShowScrollTop(scrollTop > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* ── Reading Progress Bar ── */}
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* ── Hero ── */}
      <div className={`hero ${heroLoaded ? "hero--loaded" : ""}`}>
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="hero__img"
            onLoad={() => setHeroLoaded(true)}
          />
        ) : (
          <div className="hero__placeholder" />
        )}

        <div className="hero__gradient" />

        {/* Back button */}
        <button className="back-btn" onClick={() => router.push("/learn")} aria-label="Back to Learn">
          <ArrowLeft size={15} strokeWidth={2} />
          <span>Back</span>
        </button>

        {/* Badges top-right */}
        <div className="hero__meta">
          {category && <span className="hero__category">{category}</span>}
          {diffKey && (
            <span
              className="hero__difficulty"
              style={{ color: diffMeta.color, background: diffMeta.bg, borderColor: diffMeta.border }}
            >
              <span className="hero__difficulty-dot" style={{ background: diffMeta.dot }} />
              {diffKey}
            </span>
          )}
        </div>

        {/* Title + stats */}
        <div className="hero__content">
          <h1 className="hero__title">{title}</h1>
          <div className="hero__stats">
            {formattedDate && (
              <span className="hero__stat">
                <CalendarDays size={12} strokeWidth={1.8} />
                {formattedDate}
              </span>
            )}
            <span className="hero__stat">
              <Clock size={12} strokeWidth={1.8} />
              {readTime} min read
            </span>
          </div>
        </div>
      </div>

      {/* ── Article Body ── */}
      <div className={`article-shell ${mounted ? "article-shell--in" : ""}`}>
        <div className="article-inner">

          {/* ── Summary Card ── */}
          {summary && (
            <div className="article-lead">
              <div className="article-lead__header">
                <BookOpen size={13} strokeWidth={2} className="article-lead__icon" />
                <span className="article-lead__label">Article Summary</span>
              </div>
              <p className="article-lead__text">{summary}</p>
            </div>
          )}

          {/* ── Ornamental Separator ── */}
          <div className="article-sep">
            <span className="article-sep__line" />
            <span className="article-sep__glyph">✦</span>
            <span className="article-sep__line" />
          </div>

          {/* ── HTML Content — rendered, not raw string ── */}
          {content && (
            <div
              className="article-prose"
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {/* ── Tags ── */}
          {tags && tags.length > 0 && (
            <div className="article-tags">
              <Tag size={11} strokeWidth={1.8} className="article-tags__icon" />
              <div className="article-tags__list">
                {tags.map((tag) => (
                  <span key={tag} className="article-tag">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Footer Back ── */}
          <div className="article-back-footer">
            <button className="back-footer-btn" onClick={() => router.push("/learn")}>
              <ArrowLeft size={14} strokeWidth={2} />
              Back to all articles
            </button>
          </div>
        </div>
      </div>

      {/* ── Scroll To Top ── */}
      <button
        className={`scroll-top ${showScrollTop ? "scroll-top--visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ChevronUp size={17} strokeWidth={2.5} />
      </button>

      <style jsx>{`
        /* ════════════════════════════════════════════════
           PROGRESS BAR
        ════════════════════════════════════════════════ */
        .progress-bar {
          position: fixed;
          top: 0; left: 0;
          height: 2.5px;
          background: linear-gradient(90deg, var(--red) 0%, #ff6b6b 60%, #ffb347 100%);
          z-index: 999;
          transition: width 0.08s linear;
          border-radius: 0 2px 2px 0;
          box-shadow: 0 0 8px rgba(220,38,38,0.45);
        }

        /* ════════════════════════════════════════════════
           HERO
        ════════════════════════════════════════════════ */
        .hero {
          position: relative;
          width: 100%;
          height: min(75vh, 600px);
          min-height: 340px;
          background: var(--surface-1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .hero__img {
          object-fit: cover;
          object-position: center;
          transition: transform 7s ease, opacity 0.7s ease;
          opacity: 0;
          transform: scale(1.05);
        }
        .hero--loaded .hero__img {
          opacity: 1;
          transform: scale(1);
        }
        .hero__placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%);
        }
        .hero__gradient {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom,
              rgba(10,14,26,0.40) 0%,
              rgba(10,14,26,0.00) 28%,
              rgba(10,14,26,0.00) 44%,
              rgba(10,14,26,0.72) 68%,
              rgba(10,14,26,0.98) 100%
            );
          pointer-events: none;
        }

        /* Back */
        .back-btn {
          position: absolute;
          top: 24px; left: 28px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 15px 7px 11px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(10,14,26,0.52);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: rgba(255,255,255,0.82);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, color 0.18s;
          z-index: 10;
          letter-spacing: 0.01em;
        }
        .back-btn:hover {
          background: rgba(220,38,38,0.22);
          border-color: var(--red-border);
          color: #fff;
        }

        /* Badges */
        .hero__meta {
          position: absolute;
          top: 24px; right: 28px;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 10;
        }
        .hero__category {
          padding: 4px 13px;
          border-radius: 100px;
          background: rgba(10,14,26,0.58);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .hero__difficulty {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 13px;
          border-radius: 100px;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          border: 1px solid transparent;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .hero__difficulty-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Title block */
        .hero__content {
          position: relative;
          z-index: 5;
          padding: 0 clamp(20px, 6vw, 120px) 44px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 1000px;
        }
        .hero__title {
          font-family: "DM Serif Display", Georgia, "Times New Roman", serif;
          font-size: clamp(1.75rem, 4.5vw, 3.2rem);
          font-weight: 400;
          color: #fff;
          line-height: 1.16;
          letter-spacing: -0.03em;
          margin: 0;
          text-shadow: 0 2px 28px rgba(0,0,0,0.45);
        }
        .hero__stats {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .hero__stat {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.775rem;
          color: rgba(255,255,255,0.52);
          letter-spacing: 0.02em;
        }

        /* ════════════════════════════════════════════════
           ARTICLE SHELL
        ════════════════════════════════════════════════ */
        .article-shell {
          background: var(--bg);
          position: relative;
          z-index: 2;
          padding-bottom: 100px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
        }
        .article-shell--in {
          opacity: 1;
          transform: translateY(0);
        }
        .article-inner {
          max-width: 720px;
          margin: 0 auto;
          padding: 52px 24px 0;
        }

        /* ════════════════════════════════════════════════
           SUMMARY CARD
        ════════════════════════════════════════════════ */
        .article-lead {
          position: relative;
          padding: 22px 26px 24px;
          background: var(--surface-1);
          border-radius: 12px;
          border: 1px solid var(--border);
          border-left: 3px solid var(--red);
          margin-bottom: 36px;
          overflow: hidden;
        }
        .article-lead::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--red) 0%, transparent 60%);
          opacity: 0.4;
        }
        .article-lead__header {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 14px;
        }
        .article-lead__icon {
          color: var(--red);
          flex-shrink: 0;
        }
        .article-lead__label {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--red);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .article-lead__text {
          font-size: 1.0375rem;
          color: var(--text-2);
          line-height: 1.78;
          margin: 0;
          font-style: italic;
          letter-spacing: 0.01em;
        }

        /* ════════════════════════════════════════════════
           SEPARATOR
        ════════════════════════════════════════════════ */
        .article-sep {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 0 0 40px;
        }
        .article-sep__line {
          flex: 1;
          height: 1px;
          background: var(--border);
          opacity: 0.6;
        }
        .article-sep__glyph {
          font-size: 0.7rem;
          color: var(--text-3);
          opacity: 0.5;
          flex-shrink: 0;
        }

        /* ════════════════════════════════════════════════
           PROSE — Full typography system for TipTap HTML
           TipTap outputs: h1–h3, p, ul, ol, li, li>p,
           strong, em, mark, a, nested ul/ol
        ════════════════════════════════════════════════ */
        .article-prose {
          color: var(--text-2);
          font-size: 1.0125rem;
          line-height: 1.85;
          letter-spacing: 0.01em;
          word-break: break-word;
          animation: fadeUp 0.55s ease both;
          animation-delay: 0.15s;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Headings */
        :global(.article-prose h1) {
          font-family: "DM Serif Display", Georgia, serif;
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          font-weight: 400;
          color: var(--text-1);
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin: 2.2em 0 0.6em;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border);
        }
        :global(.article-prose h2) {
          font-family: "DM Serif Display", Georgia, serif;
          font-size: clamp(1.2rem, 2.8vw, 1.55rem);
          font-weight: 400;
          color: var(--text-1);
          line-height: 1.28;
          letter-spacing: -0.025em;
          margin: 2em 0 0.6em;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        :global(.article-prose h2::before) {
          content: '';
          display: inline-block;
          width: 3px;
          height: 1.1em;
          background: var(--red);
          border-radius: 2px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        :global(.article-prose h3) {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-1);
          line-height: 1.4;
          letter-spacing: -0.015em;
          margin: 1.7em 0 0.5em;
        }

        /* Paragraph */
        :global(.article-prose p) {
          margin: 0 0 1em;
          color: var(--text-2);
        }
        :global(.article-prose p:last-child) {
          margin-bottom: 0;
        }

        /* Inline */
        :global(.article-prose strong) {
          font-weight: 650;
          color: var(--text-1);
        }
        :global(.article-prose em) {
          font-style: italic;
          color: var(--text-2);
        }
        :global(.article-prose mark) {
          background: rgba(220,38,38,0.14);
          color: var(--text-1);
          border-radius: 3px;
          padding: 0 3px;
        }
        :global(.article-prose a) {
          color: var(--red);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
          transition: opacity 0.15s ease;
        }
        :global(.article-prose a:hover) {
          opacity: 0.75;
        }

        /* ── Unordered list ── */
        :global(.article-prose ul) {
          list-style: none;
          padding-left: 0;
          margin: 0.6em 0 1.1em;
        }
        :global(.article-prose ul > li) {
          position: relative;
          padding-left: 1.5em;
          margin-bottom: 0.45em;
          color: var(--text-2);
        }
        :global(.article-prose ul > li::before) {
          content: '';
          position: absolute;
          left: 0;
          top: 0.68em;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--red);
          opacity: 0.75;
        }

        /* ── Ordered list ── */
        :global(.article-prose ol) {
          list-style: none;
          padding-left: 0;
          margin: 0.6em 0 1.1em;
          counter-reset: ol-counter;
        }
        :global(.article-prose ol > li) {
          position: relative;
          padding-left: 2em;
          margin-bottom: 0.45em;
          color: var(--text-2);
          counter-increment: ol-counter;
        }
        :global(.article-prose ol > li::before) {
          content: counter(ol-counter);
          position: absolute;
          left: 0;
          top: 0.08em;
          width: 1.4em;
          height: 1.4em;
          border-radius: 50%;
          background: var(--red-muted);
          border: 1px solid var(--red-border);
          color: var(--red);
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          letter-spacing: 0;
        }

        /* ── li > p fix: TipTap wraps li content in <p> ── */
        :global(.article-prose li > p) {
          margin: 0;
          display: inline;
        }

        /* ── Nested lists ── */
        :global(.article-prose ul ul),
        :global(.article-prose ol ul) {
          margin: 0.35em 0 0.35em;
          padding-left: 0.5em;
          border-left: 2px solid var(--border);
          margin-left: 0.25em;
        }
        :global(.article-prose ul ul > li::before) {
          width: 4px;
          height: 4px;
          background: var(--text-3);
          opacity: 0.5;
        }
        :global(.article-prose ol ol),
        :global(.article-prose ul ol) {
          margin: 0.35em 0 0.35em;
          padding-left: 0.5em;
        }

        /* ════════════════════════════════════════════════
           TAGS
        ════════════════════════════════════════════════ */
        .article-tags {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 52px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }
        .article-tags__icon {
          color: var(--text-3);
          margin-top: 4px;
          flex-shrink: 0;
        }
        .article-tags__list {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .article-tag {
          font-size: 0.73rem;
          color: var(--text-3);
          background: var(--surface-1);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 4px 11px;
          letter-spacing: 0.03em;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
          cursor: default;
        }
        .article-tag:hover {
          color: var(--red);
          border-color: var(--red-border);
          background: var(--red-muted);
        }

        /* ════════════════════════════════════════════════
           FOOTER BACK
        ════════════════════════════════════════════════ */
        .article-back-footer {
          margin-top: 48px;
          display: flex;
          align-items: center;
        }
        .back-footer-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-3);
          font-size: 0.8375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, color 0.18s;
          letter-spacing: 0.01em;
        }
        .back-footer-btn:hover {
          background: var(--red-muted);
          border-color: var(--red-border);
          color: var(--red);
        }

        /* ════════════════════════════════════════════════
           SCROLL TO TOP
        ════════════════════════════════════════════════ */
        .scroll-top {
          position: fixed;
          bottom: 32px; right: 28px;
          width: 42px; height: 42px;
          border-radius: 50%;
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text-2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 50;
          opacity: 0;
          transform: translateY(14px);
          pointer-events: none;
          transition: opacity 0.25s, transform 0.25s, background 0.18s, border-color 0.18s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.35);
        }
        .scroll-top--visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .scroll-top:hover {
          background: var(--red-muted);
          border-color: var(--red-border);
          color: var(--red);
        }

        /* ════════════════════════════════════════════════
           RESPONSIVE
        ════════════════════════════════════════════════ */
        @media (max-width: 768px) {
          .hero { height: min(60vh, 420px); min-height: 300px; }
          .hero__content { padding: 0 20px 32px; }
          .hero__meta { top: 20px; right: 16px; }
          .back-btn { top: 20px; left: 16px; }
          .article-inner { padding: 36px 20px 0; }
          .article-lead { padding: 18px 20px 20px; }
        }
        @media (max-width: 480px) {
          .hero { height: min(55vh, 360px); }
          .hero__title { font-size: 1.55rem; }
          .hero__meta { flex-direction: column; align-items: flex-end; }
          .scroll-top { bottom: 20px; right: 16px; }
        }
      `}</style>
    </>
  );
}
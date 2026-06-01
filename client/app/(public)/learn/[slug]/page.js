"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetArticleBySlugQuery } from "@/services/admin/learningApi";
import ArticleDetail from "@/components/learn/ArticleDetail";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function ArticlePage() {
  const { slug } = useParams();
  const router = useRouter();

  const { data: article, isLoading, isError } = useGetArticleBySlugQuery(slug);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="page-skeleton">
        {/* Hero skeleton */}
        <div className="skeleton-hero">
          <div className="skeleton-hero__inner">
            <div className="skeleton-pill" style={{ width: 72, height: 24 }} />
            <div className="skeleton-pill" style={{ width: 56, height: 24 }} />
          </div>
          <div className="skeleton-hero__text">
            <div className="skeleton-line" style={{ width: "72%", height: 36 }} />
            <div className="skeleton-line" style={{ width: "48%", height: 36, marginTop: 10 }} />
            <div className="skeleton-line" style={{ width: "32%", height: 16, marginTop: 18, opacity: 0.5 }} />
          </div>
        </div>

        {/* Body skeleton */}
        <div className="skeleton-body">
          {/* Summary block */}
          <div className="skeleton-summary-block">
            <div className="skeleton-line" style={{ width: 120, height: 13, marginBottom: 14 }} />
            <div className="skeleton-line" style={{ width: "100%", height: 14 }} />
            <div className="skeleton-line" style={{ width: "88%", height: 14, marginTop: 8 }} />
            <div className="skeleton-line" style={{ width: "76%", height: 14, marginTop: 8 }} />
          </div>

          {/* Separator */}
          <div className="skeleton-sep">
            {[0, 1, 2].map(i => (
              <span key={i} className="skeleton-sep__dot" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>

          {/* Content lines */}
          {[100, 92, 85, 78, 95, 68, 88, 72, 60].map((w, i) => (
            <div
              key={i}
              className="skeleton-line"
              style={{
                width: `${w}%`,
                height: 14,
                marginBottom: i === 3 ? 28 : 10,
                animationDelay: `${i * 0.06}s`,
              }}
            />
          ))}
        </div>

        <style jsx>{`
          .page-skeleton {
            min-height: 100vh;
            background: var(--bg);
          }

          /* Hero */
          .skeleton-hero {
            position: relative;
            width: 100%;
            height: min(72vh, 560px);
            min-height: 320px;
            background: var(--surface-1);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            overflow: hidden;
          }
          .skeleton-hero::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to bottom,
              transparent 40%,
              var(--surface-1) 75%,
              var(--bg) 100%
            );
          }
          .skeleton-hero__inner {
            position: absolute;
            top: 24px;
            right: 28px;
            display: flex;
            gap: 8px;
            z-index: 2;
          }
          .skeleton-hero__text {
            position: relative;
            z-index: 2;
            padding: 0 clamp(20px, 6vw, 120px) 44px;
          }

          /* Body */
          .skeleton-body {
            max-width: 720px;
            margin: 0 auto;
            padding: 48px 24px 0;
          }

          /* Summary */
          .skeleton-summary-block {
            padding: 24px 28px;
            background: var(--surface-1);
            border-radius: 10px;
            border: 1px solid var(--border);
            border-left: 4px solid var(--surface-3);
            margin-bottom: 36px;
          }

          /* Separator */
          .skeleton-sep {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 36px;
          }
          .skeleton-sep__dot {
            display: block;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: var(--surface-3);
            animation: skPulse 1.4s ease-in-out infinite;
          }

          /* Shared skeleton elements */
          .skeleton-line,
          .skeleton-pill {
            background: var(--surface-2);
            border-radius: 6px;
            animation: skPulse 1.4s ease-in-out infinite;
          }
          .skeleton-pill { border-radius: 100px; }

          @keyframes skPulse {
            0%, 100% { opacity: 0.45; }
            50%       { opacity: 0.9; }
          }

          @media (max-width: 768px) {
            .skeleton-hero { height: min(58vh, 400px); }
            .skeleton-body { padding: 36px 20px 0; }
          }
        `}</style>
      </div>
    );
  }

  /* ── Error ── */
  if (isError || !article) {
    return (
      <div className="page-state">
        <div className="page-state__icon-ring">
          <AlertCircle size={22} strokeWidth={1.5} style={{ color: "var(--red)" }} />
        </div>
        <p className="page-state__title">Article not found</p>
        <p className="page-state__desc">
          This article may have been moved or doesn&apos;t exist.
        </p>
        <button
          className="page-state__back"
          onClick={() => router.push("/learn")}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to Learn
        </button>

        <style jsx>{`
          .page-state {
            min-height: 100vh;
            background: var(--bg);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 24px;
            text-align: center;
            animation: fadeIn 0.4s ease both;
          }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          .page-state__icon-ring {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--red-muted);
            border: 1px solid var(--red-border);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 4px;
          }
          .page-state__title {
            font-family: "DM Serif Display", Georgia, serif;
            font-size: 1.25rem;
            color: var(--text-1);
            margin: 0;
            font-weight: 400;
          }
          .page-state__desc {
            font-size: 0.875rem;
            color: var(--text-3);
            margin: 0;
            max-width: 320px;
            line-height: 1.6;
          }
          .page-state__back {
            margin-top: 8px;
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 9px 18px;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: transparent;
            color: var(--text-2);
            font-size: 0.8375rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
          }
          .page-state__back:hover {
            background: var(--red-muted);
            border-color: var(--red-border);
            color: var(--red);
          }
        `}</style>
      </div>
    );
  }

  /* ── Success ── */
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <ArticleDetail article={article} />
    </main>
  );
}
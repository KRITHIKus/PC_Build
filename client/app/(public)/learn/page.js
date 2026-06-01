"use client";

import { useState, useMemo } from "react";
import { useGetAllArticlesQuery } from "@/services/admin/learningApi";
import LearnHeader from "@/components/learn/LearnHeader";
import LearnFilters from "@/components/learn/LearnFilters";
import LearnGrid from "@/components/learn/LearnGrid";
import LearnEmpty from "@/components/learn/LearnEmpty";
import { Loader2 } from "lucide-react";

export default function LearnPage() {
  const { data: articles = [], isLoading, isError } = useGetAllArticlesQuery();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const categories = useMemo(() => {
    const cats = articles.map((a) => a.category).filter(Boolean);
    return [...new Set(cats)].sort();
  }, [articles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return articles.filter((article) => {
      if (q) {
        const inTitle = article.title?.toLowerCase().includes(q);
        const inSummary = article.summary?.toLowerCase().includes(q);
        const inTags = article.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inSummary && !inTags) return false;
      }

      if (selectedCategory !== "All" && article.category !== selectedCategory) {
        return false;
      }

      if (selectedDifficulty !== "All" && article.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [articles, search, selectedCategory, selectedDifficulty]);

  if (isLoading) {
    return (
      <div className="page-state">
        <Loader2 size={26} strokeWidth={1.5} className="spinner" />
        <span className="page-state__text">Loading articles…</span>
        <style jsx>{`
          .page-state {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .spinner {
            color: var(--red);
            animation: spin 0.9s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .page-state__text {
            font-size: 0.84rem;
            color: var(--text-3);
            letter-spacing: 0.01em;
          }
        `}</style>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-state">
        <p className="page-state__error">Failed to load articles. Please try again later.</p>
        <style jsx>{`
          .page-state {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .page-state__error {
            font-size: 0.875rem;
            color: var(--text-3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="learn-page">
      <div className="learn-page__header">
        <LearnHeader />
      </div>

      <div className="learn-page__filters">
        <LearnFilters
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          categories={categories}
        />
      </div>

      <div className="learn-page__grid">
        {filtered.length > 0 ? (
          <LearnGrid articles={filtered} />
        ) : (
          <LearnEmpty search={search} />
        )}
      </div>

      <style jsx>{`
        .learn-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-1);
        }

        .learn-page__header {
          border-bottom: 1px solid var(--border);
          margin-bottom: 40px;
        }

        .learn-page__filters {
          margin-bottom: 8px;
        }

        .learn-page__grid {
          /* intentionally left clean — spacing handled inside LearnGrid */
        }

        @media (max-width: 640px) {
          .learn-page__header {
            margin-bottom: 28px;
          }
        }
      `}</style>
    </main>
  );
}
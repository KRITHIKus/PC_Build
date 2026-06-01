"use client";

import LearnCard from "./LearnCard";

export default function LearnGrid({ articles }) {
  return (
    <div className="grid-wrapper">
      <div className="grid">
        {articles.map((article) => (
          <LearnCard key={article._id} article={article} />
        ))}
      </div>

      <style jsx>{`
        .grid-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 120px;
          width: 100%;
          box-sizing: border-box;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .grid-wrapper {
            padding: 0 16px 80px;
          }

          .grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
      `}</style>
    </div>
  );
}
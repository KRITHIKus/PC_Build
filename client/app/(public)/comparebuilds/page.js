"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { CompareBuildCard } from "@/components/compare-build/CompareBuildCard";
import { CompareTray } from "@/components/compare-build/CompareTray";
import { CompareBuildsHeader } from "@/components/compare-build/CompareBuildsHeader";
import { useGetMyBuildsQuery } from "@/services/buildsApi";

export default function CompareBuildsPage() {
  const router = useRouter();
  const [selectedBuilds, setSelectedBuilds] = useState([]);
  const { data, isLoading, error } = useGetMyBuildsQuery({
    page: 1,
    limit: 20,
  });

  const builds = data?.data || [];

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg)' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
        >
          {/* Spinning ring */}
          <div style={{ position: 'relative', width: 32, height: 32 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1px solid var(--border)',
            }} />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1px solid transparent',
              borderTopColor: 'var(--red)',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 10,
            color: 'var(--text-3)', letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>
            Loading builds
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg)' }}
      >
        <div style={{
          padding: '12px 20px', borderRadius: 10,
          background: 'rgba(255,59,31,0.07)',
          border: '1px solid var(--red-border)',
          fontFamily: 'var(--font-display)', fontSize: 13,
          color: 'var(--red)', letterSpacing: '0.02em',
        }}>
          Failed to load builds
        </div>
      </div>
    );
  }

  const prices = builds.map((b) => b.totalEstimatedPrice || 0);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const toggleSelect = (id) => {
    setSelectedBuilds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const handleClear = () => {
    setSelectedBuilds([]);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <CompareBuildsHeader buildCount={selectedBuilds.length} />

      {/* ── Grid section ── */}
      <div style={{
        maxWidth: '80rem', margin: '0 auto',
        padding: 'clamp(1.5rem,4vw,2.5rem) clamp(1rem,4vw,1.5rem)',
      }}>

        {builds.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              paddingTop: '5rem', paddingBottom: '5rem', gap: 12,
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
            }}>
              <span style={{ color: 'var(--text-3)', fontSize: 18, lineHeight: 1 }}>—</span>
            </div>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 13,
              color: 'var(--text-3)', margin: 0,
            }}>
              No builds found
            </p>
          </motion.div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: '1rem',
        }}>
          {builds.map((build, index) => (
            <CompareBuildCard
              key={build._id}
              build={build}
              compat={build.compatibilityResult}
              index={index}
              isCheapest={build.totalEstimatedPrice === minPrice}
              isMostExpensive={build.totalEstimatedPrice === maxPrice}
              isSelected={selectedBuilds.includes(build._id)}
              onSelect={() => toggleSelect(build._id)}
            />
          ))}
        </div>
      </div>

      <CompareTray
        selected={selectedBuilds}
        onClear={handleClear}
      />
    </div>
  );
}
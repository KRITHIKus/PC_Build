'use client'

import { Cpu, ArrowRight } from 'lucide-react'

export function BuildLabHeader({ onStartBuild }) {
  return (
    <div
      className="relative py-12 sm:py-16 overflow-hidden"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* Bg glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,59,31,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="container-app relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">

          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
                style={{
                  background: 'rgba(255,59,31,0.1)',
                  border:     '1px solid rgba(255,59,31,0.25)',
                  color:      'var(--red)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                <Cpu size={11} />
                Build Lab
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl font-bold mb-3 leading-none"
              style={{
                fontFamily:    'var(--font-display)',
                letterSpacing: '-0.03em',
                color:         'var(--text-1)',
              }}
            >
              Build Your{' '}
              <span style={{ color: 'var(--red)', textShadow: '0 0 36px rgba(255,59,31,0.4)' }}>
                Machine
              </span>
            </h1>

            <p className="text-base sm:text-lg" style={{ color: 'var(--text-2)' }}>
              Start from scratch or use a prebuilt template. Pick parts, check compatibility, save your build.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={onStartBuild}
            className="self-start sm:self-auto inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg,#ff4d33,#ff3b1f,#e11d2e)',
              color:      '#fff',
              fontFamily: 'var(--font-display)',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(255,59,31,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
          >
            Start from Scratch
            <ArrowRight size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  )
}
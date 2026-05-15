'use client'

import { useState } from 'react'
import { Star, StarOff } from 'lucide-react'
import {
  useGetBuildsQuery,
  useUpdateBuildMetaMutation,
  useDeleteBuildMutation,
  useToggleFeaturedMutation,
} from '@/services/admin/buildsApi'
import DeleteConfirmModal from './DeleteConfirmModal'

/* ── Shared style tokens ─────────────────────────────────────── */
const TH = {
  color:        'var(--text-3)',
  borderBottom: '1px solid var(--border)',
  background:   'var(--surface-2)',
  fontFamily:   'var(--font-display)',
  fontSize:     '10px',
  textTransform:'uppercase',
  letterSpacing:'0.07em',
  fontWeight:   700,
  padding:      '10px 16px',
  whiteSpace:   'nowrap',
}

const TD = {
  padding:      '12px 16px',
  color:        'var(--text-1)',
  fontSize:     '13px',
  borderBottom: '1px solid var(--border)',
  verticalAlign:'middle',
}

const inputBase = {
  background: 'var(--bg)',
  color:      'var(--text-1)',
  border:     '1px solid var(--border)',
  borderRadius:'8px',
  padding:    '4px 10px',
  fontSize:   '13px',
  outline:    'none',
  width:      '100%',
  fontFamily: 'var(--font-display)',
}

/* ── Flash banner ────────────────────────────────────────────── */
function Flash({ message }) {
  if (!message.text) return null
  const success = message.type === 'success'
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm mb-5"
      style={{
        background: success ? 'rgba(34,197,94,0.1)'  : 'rgba(220,38,38,0.1)',
        border:     success ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(220,38,38,0.25)',
        color:      success ? '#22c55e' : '#dc2626',
        fontFamily: 'var(--font-display)',
      }}
    >
      <span className="text-xs font-semibold uppercase tracking-wider">
        {success ? 'Success' : 'Error'}
      </span>
      <span style={{ color: 'var(--text-2)' }}>{message.text}</span>
    </div>
  )
}

/* ── Status badge ────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const published = status === 'published'
  return (
    <span
      className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
      style={{
        background: published ? 'rgba(34,197,94,0.1)'  : 'rgba(234,179,8,0.1)',
        color:      published ? '#22c55e'               : '#eab308',
        border:     published ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(234,179,8,0.2)',
        fontFamily: 'var(--font-display)',
      }}
    >
      {status}
    </span>
  )
}

export default function BuildsTable() {

  const [page, setPage] = useState(1);
const limit = 10;
  /* ── API — identical hooks ───────────────────────────────── */
const { data: response, isLoading, isError } = useGetBuildsQuery({
  page,
  limit,
});
 const builds = response?.data || [];
const meta = response?.meta || {};

  const [updateBuildMeta,   { isLoading: updating }]   = useUpdateBuildMetaMutation()
  const [deleteBuild,       { isLoading: deleting }]   = useDeleteBuildMutation()
  const [toggleisFeatured]                              = useToggleFeaturedMutation()  // ✦ bug fix: was called as toggleFeatured

  /* ── Local state ─────────────────────────────────────────── */
  const [editTarget,   setEditTarget]   = useState(null)
  const [editForm,     setEditForm]     = useState({ title: '', journeyStatus: '' })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [activeToggle, setActiveToggle] = useState(null)
  const [message,      setMessage]      = useState({ type: '', text: '' })
  

  const flash = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3500)
  }

  const openEdit = (build) => {
    setEditTarget(build)
    setEditForm({ title: build.title, journeyStatus: build.journeyStatus })
  }

  /* ── Handlers — identical payloads ──────────────────────── */
  const handleUpdate = async () => {
    try {
      await updateBuildMeta({ id: editTarget._id, data: editForm }).unwrap()
      setEditTarget(null)
      flash('success', 'Build updated successfully.')
    } catch {
      flash('error', 'Failed to update build.')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteBuild(deleteTarget._id).unwrap()
      setDeleteTarget(null)
      flash('success', 'Build deleted.')
    } catch {
      flash('error', 'Failed to delete build.')
    }
  }

  const handleToggle = async (build) => {
    setActiveToggle(build._id)
    try {
      await toggleisFeatured({ id: build._id, isFeatured: !build.isFeatured }).unwrap()  // ✦ bug fix
      flash('success', `Build ${!build.isFeatured ? 'featured' : 'unfeatured'}.`)
    } catch {
      flash('error', 'Failed to toggle featured.')
    } finally {
      setActiveToggle(null)
    }
  }

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div>

      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight mb-0.5"
          style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
        >
          Builds
        </h1>
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>
          Manage user builds, featured items, and status.
        </p>
      </div>

      <Flash message={message} />

      {/* States */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>Loading builds…</p>
        </div>
      )}
      {isError && (
        <div
          className="py-4 px-4 rounded-xl text-sm"
          style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          Failed to load builds.
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse" style={{ minWidth: '680px' }}>
              <thead>
                <tr>
                  {['Title', 'Price', 'Status', 'Featured', 'Actions'].map(h => (
                    <th key={h} style={TH} className="text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!builds.length ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-sm"
                      style={{ color: 'var(--text-3)', background: 'var(--surface-1)' }}
                    >
                      No builds found.
                    </td>
                  </tr>
                ) : builds.map(b => (
                  <tr
                    key={b._id}
                    style={{ background: 'var(--surface-1)' }}
                    onMouseEnter={e => { if (editTarget?._id !== b._id) e.currentTarget.style.background = 'var(--surface-2)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-1)' }}
                  >
                    {/* Title — editable */}
                    <td style={{ ...TD, maxWidth: '220px' }}>
                      {editTarget?._id === b._id ? (
                        <input
                          value={editForm.title}
                          onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                          style={inputBase}
                        />
                      ) : (
                        <span className="truncate block font-medium" title={b.title}>{b.title}</span>
                      )}
                    </td>

                    {/* Price */}
                    <td style={{ ...TD, color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
                      ₹{Number(b.totalEstimatedPrice).toLocaleString('en-IN')}
                    </td>

                    {/* Status — editable */}
                    <td style={TD}>
                      {editTarget?._id === b._id ? (
                        <select
                          value={editForm.journeyStatus}
                          onChange={e => setEditForm(p => ({ ...p, journeyStatus: e.target.value }))}
                          style={{ ...inputBase, width: 'auto', paddingRight: '24px' }}
                        >
                          <option value="planning">palnning</option>
                          <option value="in-progress">in-progress</option>
                          <option value="completed">completed</option>
                          <option value="on-hold">on-hold</option>
                        </select>
                      ) : (
                        <StatusBadge status={b.journeyStatus} />
                      )}
                    </td>

                    {/* Featured */}
                    <td style={TD}>
                      <span
                        className="text-xs font-semibold"
                        style={{
                          color:      b.isFeatured ? '#f59e0b' : 'var(--text-3)',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {b.isFeatured ? '★ Featured' : '—'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={TD}>
                      <div className="flex items-center gap-2 flex-wrap">
                        {editTarget?._id === b._id ? (
                          <>
                            <button
                              onClick={handleUpdate}
                              disabled={updating}
                              className="h-8 px-3 rounded-lg text-xs font-semibold text-white transition-opacity"
                              style={{ background: '#16a34a', opacity: updating ? 0.7 : 1 }}
                            >
                              {updating ? 'Saving…' : 'Save'}
                            </button>
                            <button
                              onClick={() => setEditTarget(null)}
                              disabled={updating}
                              className="h-8 px-3 rounded-lg text-xs font-medium transition-colors"
                              style={{ background: 'var(--surface-2)', color: 'var(--text-1)', border: '1px solid var(--border)' }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => openEdit(b)}
                            className="h-8 px-3 rounded-lg text-xs font-medium transition-colors"
                            style={{ background: 'var(--surface-2)', color: 'var(--text-1)', border: '1px solid var(--border)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,59,31,0.4)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="h-8 px-3 rounded-lg text-xs font-medium text-white transition-opacity"
                          style={{ background: '#dc2626' }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => handleToggle(b)}
                          disabled={activeToggle === b._id}
                          className="h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-opacity"
                          style={{
                            background: b.isFeatured ? 'rgba(234,179,8,0.1)'   : 'rgba(99,102,241,0.1)',
                            color:      b.isFeatured ? '#eab308'                : '#818cf8',
                            border:     b.isFeatured ? '1px solid rgba(234,179,8,0.25)' : '1px solid rgba(99,102,241,0.25)',
                            opacity:    activeToggle === b._id ? 0.6 : 1,
                            cursor:     activeToggle === b._id ? 'not-allowed' : 'pointer',
                            fontFamily: 'var(--font-display)',
                          }}
                        >
                          {activeToggle === b._id
                            ? '…'
                            : b.isFeatured
                              ? <><StarOff size={11} />Unfeature</>
                              : <><Star    size={11} />Feature</>
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
{/* ── Pagination Controls ─────────────────────────────── */}
<div className="flex items-center justify-between mt-4 px-2">

  <p className="text-xs" style={{ color: "var(--text-3)" }}>
    Page {meta.page || 1} of {meta.totalPages || 1}
  </p>

  <div className="flex gap-2">

    <button
      onClick={() => setPage((p) => Math.max(p - 1, 1))}
      disabled={!meta.hasPrevPage}
      className="h-8 px-3 rounded-lg text-xs font-medium border"
      style={{
        background: "var(--surface-2)",
        color: "var(--text-1)",
        border: "1px solid var(--border)",
        opacity: !meta.hasPrevPage ? 0.5 : 1,
        cursor: !meta.hasPrevPage ? "not-allowed" : "pointer",
      }}
    >
      Previous
    </button>

    <button
      onClick={() => setPage((p) => p + 1)}
      disabled={!meta.hasNextPage}
      className="h-8 px-3 rounded-lg text-xs font-medium border"
      style={{
        background: "var(--surface-2)",
        color: "var(--text-1)",
        border: "1px solid var(--border)",
        opacity: !meta.hasNextPage ? 0.5 : 1,
        cursor: !meta.hasNextPage ? "not-allowed" : "pointer",
      }}
    >
      Next
    </button>

  </div>
</div>
      {/* Delete modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          title={deleteTarget.title}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
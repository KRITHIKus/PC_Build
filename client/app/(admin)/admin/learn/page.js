'use client'

import { useState } from 'react'
import { useGetAllArticlesQuery, useDeleteArticleMutation, useLazyGetArticleBySlugQuery,} from '@/services/admin/learningApi'
import { LearnHeader }          from '@/components/admin/learn/LearnHeader'
import { LearnTable }           from '@/components/admin/learn/LearnTable'
import { LearnForm }            from '@/components/admin/learn/LearnForm'
import { DeleteConfirmModal }   from '@/components/admin/learn/DeleteConfirmModal'
import { EmptyState }           from '@/components/admin/learn/EmptyState'

/* ── Inline spinner (no extra file) ─────────────────────────── */
function PageSpinner() {
  return (
    <>
      <style>{`@keyframes alp-spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, padding:'5rem 0' }}>
        <div style={{ position:'relative', width:32, height:32 }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid var(--border)' }} />
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid transparent',
            borderTopColor:'var(--red)', animation:'alp-spin 0.75s linear infinite' }} />
        </div>
        <span style={{ fontFamily:'var(--font-display)', fontSize:10, color:'var(--text-3)',
          letterSpacing:'0.18em', textTransform:'uppercase' }}>Loading articles</span>
      </div>
    </>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
export default function AdminLearnPage() {
  const [formOpen,     setFormOpen]     = useState(false)
  const [editArticle,  setEditArticle]  = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading, error, refetch } = useGetAllArticlesQuery()
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation()
const [getArticleBySlug] = useLazyGetArticleBySlugQuery()
  const articles = data ?? []

  /* handlers */
  const handleCreate = () => { setEditArticle(null);  setFormOpen(true) }
  const handleEdit = async (a) => {
  try {
    const fullArticle = await getArticleBySlug(a.slug).unwrap()

    setEditArticle(fullArticle)
    setFormOpen(true)

  } catch (err) {
    console.error('Failed to fetch full article', err)
  }
}
  const handleDeleteRequest = (a) => setDeleteTarget(a)

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteArticle(deleteTarget._id).unwrap()
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditArticle(null)
    refetch()
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      <LearnHeader onCreateClick={handleCreate} />

      <main style={{
        maxWidth:'80rem', margin:'0 auto',
        padding:'clamp(1.5rem,4vw,2.5rem) clamp(1rem,4vw,1.5rem)',
      }}>
        {isLoading && <PageSpinner />}

        {error && !isLoading && (
          <div style={{
            padding:'1rem 1.5rem', borderRadius:10,
            background:'rgba(255,59,31,0.07)', border:'1px solid var(--red-border)',
            color:'var(--red)', fontFamily:'var(--font-display)', fontSize:13,
          }}>
            Failed to load articles — please refresh and try again.
          </div>
        )}

        {!isLoading && !error && articles.length === 0 && (
          <EmptyState onCreateClick={handleCreate} />
        )}

        {!isLoading && !error && articles.length > 0 && (
          <LearnTable
            articles={articles}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        )}
      </main>

      {formOpen && (
        <LearnForm
          article={editArticle}
          
          onClose={() => { setFormOpen(false); setEditArticle(null) }}
          onSuccess={handleFormSuccess}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          article={deleteTarget}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
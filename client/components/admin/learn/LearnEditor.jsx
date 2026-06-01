'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit }   from '@tiptap/starter-kit'
import { Highlight }    from '@tiptap/extension-highlight'
import { Link }         from '@tiptap/extension-link'
import { useEffect, useCallback, useRef } from 'react'
import {
  Bold, Italic, Highlighter, Link2, List, ListOrdered,
  Heading1, Heading2, Heading3,
} from 'lucide-react'

/* ── Toolbar button ─────────────────────────────────────────── */
function ToolBtn({ onClick, active, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, borderRadius: 6, cursor: 'pointer', border: 'none',
        background: active ? 'rgba(255,59,31,0.14)' : 'transparent',
        color:      active ? 'var(--red)' : 'var(--text-2)',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.color = 'var(--text-1)'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-2)'
        }
      }}
    >
      {children}
    </button>
  )
}

/* ── Divider ────────────────────────────────────────────────── */
function ToolDiv() {
  return (
    <div style={{
      width: 1, height: 18,
      background: 'var(--border)',
      flexShrink: 0,
      margin: '0 2px',
    }} />
  )
}

/* ── Normalize TipTap HTML ──────────────────────────────────────
   TipTap represents an empty document as '<p></p>', not ''.
   Without this, '' !== '<p></p>' causes false-positive syncs
   that fight against the user's typing and reset cursor position.
─────────────────────────────────────────────────────────────── */
function normalizeHTML(html) {
  if (!html) return ''
  const trimmed = html.trim()
  return trimmed === '<p></p>' ? '' : trimmed
}

/* ── Main export ────────────────────────────────────────────── */
export function LearnEditor({ value, onChange }) {

  /*
   * isInternalUpdate ref
   * ─────────────────────
   * When the user TYPES, onUpdate → onChange(html) → parent sets value prop.
   * Without this guard the sync effect would see value !== getHTML() and call
   * setContent again — resetting cursor position mid-typing.
   * We flip this flag around every programmatic setContent so onUpdate knows
   * not to echo the change back to the parent.
   */
  const isInternalUpdate = useRef(false)

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        link: false, // prevent duplicate — Link extension added separately
      }),

      Highlight.configure({
        multicolor: false,
      }),

      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          style: 'color:var(--red);text-decoration:underline;',
        },
      }),
    ],

    content: value || '',

    editorProps: {
      attributes: {
        class: 'le-editor-area',
        'aria-label': 'Article content editor',
      },
    },

    onUpdate: ({ editor }) => {
      // Skip propagation when we triggered the change ourselves (setContent)
      if (!isInternalUpdate.current) {
        onChange?.(editor.getHTML())
      }
    },
  })

  /*
   * Sync external value → editor
   * ─────────────────────────────
   * Fires when:
   *   (a) editor first becomes ready — catches the case where LearnForm's
   *       prefill useEffect already ran and value is the full article HTML
   *       before the editor instance existed.
   *   (b) value prop changes         — catches article switching.
   *
   * The normalizeHTML() call strips the '<p></p>' ↔ '' mismatch so we only
   * call setContent when the content is genuinely different.
   */
  useEffect(() => {
    if (!editor) return

    const incoming = normalizeHTML(value)
    const current  = normalizeHTML(editor.getHTML())

    if (incoming === current) return   // already in sync, nothing to do

    isInternalUpdate.current = true
    editor.commands.setContent(value || '', false)
    isInternalUpdate.current = false

  }, [value, editor])

  /* Link insertion */
  const handleLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href ?? ''
    const url  = window.prompt('Enter URL', prev)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <>
      <style>{`
        /* ── Editor canvas ── */
        .le-editor-area {
          min-height: 240px;
          padding: 16px 18px;
          outline: none;
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.78;
          color: var(--text-1);
          caret-color: var(--red);
        }

        /* Placeholder */
        .le-editor-area p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: var(--text-3);
          pointer-events: none;
          float: left;
          height: 0;
        }

        /* Headings */
        .le-editor-area h1 { font-size:1.55rem; font-weight:800; font-family:var(--font-display); color:var(--text-1); margin:1.2em 0 0.4em; letter-spacing:-0.03em; line-height:1.2; }
        .le-editor-area h2 { font-size:1.2rem;  font-weight:700; font-family:var(--font-display); color:var(--text-1); margin:1em 0 0.4em;  letter-spacing:-0.02em; line-height:1.25; }
        .le-editor-area h3 { font-size:1rem;    font-weight:600; font-family:var(--font-display); color:var(--text-1); margin:0.9em 0 0.3em; line-height:1.3; }

        /* Paragraph */
        .le-editor-area p { margin:0 0 0.75em; }

        /* Inline */
        .le-editor-area strong { font-weight: 700; color: var(--text-1); }
        .le-editor-area em     { font-style: italic; }
        .le-editor-area mark   { background:rgba(255,59,31,0.18); color:var(--text-1); border-radius:2px; padding:0 2px; }
        .le-editor-area a      { color:var(--red); text-decoration:underline; }
        .le-editor-area a:hover { opacity: 0.8; }

        /* ── Unordered list ── */
        .le-editor-area ul {
          list-style: none;
          padding-left: 0;
          margin: 0.5em 0 0.85em;
        }
        .le-editor-area ul > li {
          position: relative;
          padding-left: 1.4em;
          margin-bottom: 0.3em;
        }
        .le-editor-area ul > li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--red);
          opacity: 0.7;
        }

        /* ── Ordered list ── */
        .le-editor-area ol {
          list-style: none;
          padding-left: 0;
          margin: 0.5em 0 0.85em;
          counter-reset: le-ol-counter;
        }
        .le-editor-area ol > li {
          position: relative;
          padding-left: 2em;
          margin-bottom: 0.3em;
          counter-increment: le-ol-counter;
        }
        .le-editor-area ol > li::before {
          content: counter(le-ol-counter);
          position: absolute;
          left: 0;
          top: 0.1em;
          width: 1.35em;
          height: 1.35em;
          border-radius: 50%;
          background: rgba(255,59,31,0.1);
          border: 1px solid rgba(255,59,31,0.22);
          color: var(--red);
          font-size: 0.68rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* ── li > p fix: TipTap wraps list items in <p> ── */
        .le-editor-area li > p {
          margin: 0;
          display: inline;
        }

        /* ── Nested lists ── */
        .le-editor-area ul ul,
        .le-editor-area ol ul {
          margin: 0.3em 0 0.3em 0.3em;
          padding-left: 0.5em;
          border-left: 2px solid var(--border);
        }
        .le-editor-area ul ul > li::before {
          width: 4px; height: 4px;
          background: var(--text-3);
          opacity: 0.5;
          top: 0.68em;
        }
        .le-editor-area ol ol,
        .le-editor-area ul ol {
          margin: 0.3em 0 0.3em 0.3em;
        }

        /* ── Toolbar ── */
        .le-toolbar-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          padding: 8px 10px;
          border-bottom: 1px solid var(--border);
        }

        @media (max-width: 480px) {
          .le-editor-area { min-height: 180px; font-size: 13px; }
        }
      `}</style>

      <div style={{
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--surface-1)',
      }}>

        {/* ── Toolbar ── */}
        <div className="le-toolbar-wrap" style={{ background: 'var(--surface-2)' }}>

          <ToolBtn
            title="Bold"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={13} />
          </ToolBtn>

          <ToolBtn
            title="Italic"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={13} />
          </ToolBtn>

          <ToolDiv />

          <ToolBtn
            title="Heading 1"
            active={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 size={13} />
          </ToolBtn>

          <ToolBtn
            title="Heading 2"
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={13} />
          </ToolBtn>

          <ToolBtn
            title="Heading 3"
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 size={13} />
          </ToolBtn>

          <ToolDiv />

          {/* Bullet list */}
          <ToolBtn
            title="Bullet List"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={13} />
          </ToolBtn>

          {/* Ordered list */}
          <ToolBtn
            title="Numbered List"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={13} />
          </ToolBtn>

          <ToolDiv />

          <ToolBtn
            title="Highlight"
            active={editor.isActive('highlight')}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter size={13} />
          </ToolBtn>

          <ToolBtn
            title="Insert Link"
            active={editor.isActive('link')}
            onClick={handleLink}
          >
            <Link2 size={13} />
          </ToolBtn>

        </div>

        {/* ── Editor area ── */}
        <EditorContent
          editor={editor}
          placeholder="Start writing your article..."
        />
      </div>
    </>
  )
}
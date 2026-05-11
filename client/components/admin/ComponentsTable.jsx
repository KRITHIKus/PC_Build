"use client";

import { useState } from "react";

import {
  useGetComponentsQuery,
  useCreateComponentMutation,
  useUpdateComponentMutation,
  useDeleteComponentMutation,
} from "@/services/admin/componentsApi";

import ComponentForm from "./ComponentForm";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function ComponentsTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Query
  const { data: response, isLoading, isError } = useGetComponentsQuery({ page, limit });

  // API data
  const components = response?.data || [];
  const meta = response?.meta;

  // Mutations
  const [createComponent, { isLoading: creating }] = useCreateComponentMutation();
  const [updateComponent, { isLoading: updating }] = useUpdateComponentMutation();
  const [deleteComponent, { isLoading: deleting }] = useDeleteComponentMutation();

  // Local state
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3500);
  };

  const handleCreate = async (payload) => {
    try {
      await createComponent(payload).unwrap();
      setShowForm(false);
      flash("success", "Component created successfully.");
    } catch (err) {
      console.error(err);
      flash("error", err?.data?.message || "Failed to create component.");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateComponent({ id: editTarget._id, data: payload }).unwrap();
      setEditTarget(null);
      flash("success", "Component updated successfully.");
    } catch (err) {
      console.error(err);
      flash("error", err?.data?.message || "Failed to update component.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComponent(deleteTarget._id).unwrap();
      setDeleteTarget(null);
      flash("success", "Component deleted.");
    } catch (err) {
      console.error(err);
      flash("error", err?.data?.message || "Failed to delete component.");
    }
  };

  const rowStyle = { borderBottom: "1px solid var(--border)", color: "var(--text-1)" };
  const thStyle = { color: "var(--text-2)", borderBottom: "1px solid var(--border)", background: "var(--surface-1)" };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-1)" }}>Components</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded text-sm text-white" style={{ background: "#2563eb" }}>
          Add Component
        </button>
      </div>

      {/* Flash message */}
      {message.text && (
        <p className="text-sm mb-4 px-3 py-2 rounded" style={{ background: message.type === "success" ? "#dcfce7" : "#fee2e2", color: message.type === "success" ? "#166534" : "#991b1b" }}>
          {message.text}
        </p>
      )}

      {/* Loading */}
      {isLoading && <p className="text-sm" style={{ color: "var(--text-2)" }}>Loading components…</p>}

      {/* Error */}
      {isError && <p className="text-sm text-red-500">Failed to load components.</p>}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm border-collapse min-w-[540px]">
          <thead>
  <tr>
    {["Name", "Brand", "Type", "Price", "Stock", "Actions"].map((h) => (
      <th
        key={h}
        className="text-left px-3 py-2 font-medium text-sm"
        style={thStyle}
      >
        {h}
      </th>
    ))}
  </tr>
</thead>
<tbody>
  {!components.length ? (
    <tr>
      <td colSpan={6} className="px-3 py-6 text-center text-sm" style={{ color: "var(--text-2)" }}>
        No components found.
      </td>
    </tr>
  ) : (
    components.map((c) => (
      <tr key={c._id} style={rowStyle}>
        <td className="px-3 py-2">{c.name}</td>
        <td className="px-3 py-2">{c.brand}</td>
        <td className="px-3 py-2">{c.type}</td>

        {/* Price as read-only label */}
        <td className="px-3 py-2">
          <span
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{ background: "#fef3c7", color: "#b45309" }}
            title="Price is read-only; update via pricing section"
          >
            ₹{Number(c.estimatedPrice || 0).toLocaleString("en-IN")}
          </span>
        </td>

        <td className="px-3 py-2">{c.inStock}</td>

        <td className="px-3 py-2">
          <div className="flex gap-2">
            <button
              onClick={() => setEditTarget(c)}
              className="px-3 py-1 rounded text-xs"
              style={{ background: "var(--bg)", color: "var(--text-1)", border: "1px solid var(--border)" }}
            >
              Edit
            </button>
            <button
              onClick={() => setDeleteTarget(c)}
              className="px-3 py-1 rounded text-xs text-white"
              style={{ background: "#dc2626" }}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm" style={{ color: "var(--text-2)" }}>
                Showing {(page - 1) * limit + 1}-{Math.min(page * limit, meta.total)} of {meta.total}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => p - 1)} disabled={!meta.hasPrevPage} className="px-3 py-1 rounded text-sm" style={{ background: "var(--bg)", color: "var(--text-1)", border: "1px solid var(--border)", opacity: !meta.hasPrevPage ? 0.5 : 1 }}>Previous</button>
                <button onClick={() => setPage((p) => p + 1)} disabled={!meta.hasNextPage} className="px-3 py-1 rounded text-sm text-white" style={{ background: "#2563eb", opacity: !meta.hasNextPage ? 0.5 : 1 }}>Next</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showForm && <ComponentForm initial={null} onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={creating} />}
      {editTarget && <ComponentForm initial={editTarget} onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} loading={updating} />}
      {deleteTarget && <DeleteConfirmModal title={deleteTarget?.name} loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
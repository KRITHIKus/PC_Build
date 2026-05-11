import ComponentsTable from "@/components/admin/ComponentsTable";

export const metadata = {
  title: "Components — Admin",
};

export default function ComponentsPage() {
  return (
    <div
      className="p-4 md:p-6 min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      <ComponentsTable />
    </div>
  );
}
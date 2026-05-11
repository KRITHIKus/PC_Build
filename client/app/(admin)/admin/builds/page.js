import BuildsTable from "@/components/admin/BuildsTable";

export const metadata = {
  title: "Builds — Admin",
};

export default function BuildsPage() {
  return (
    <div
      className="p-4 md:p-6 min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      <BuildsTable />
    </div>
  );
}
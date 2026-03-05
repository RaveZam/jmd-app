import Sidebar from "@/app/features/dashboard/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <section className="flex min-w-0 flex-1 flex-col">{children}</section>
    </div>
  );
}

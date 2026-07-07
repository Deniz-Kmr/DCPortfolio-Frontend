import { AdminPanel, AdminStatusBadge, AdminWindow } from '../../components/admin/vintage';

type AdminPlaceholderPageProps = {
  title: string;
  description: string;
};

export function AdminPlaceholderPage({
  title,
  description,
}: AdminPlaceholderPageProps) {
  return (
    <AdminWindow
      title={`${title} Module`}
      subtitle="Local control panel placeholder"
      actions={
        <div className="flex flex-wrap gap-2">
          <AdminStatusBadge tone="warning">under construction</AdminStatusBadge>
          <AdminStatusBadge tone="neutral">crud later</AdminStatusBadge>
        </div>
      }
    >
      <AdminPanel>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
          Admin Panel
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#102A43]">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">{description}</p>

        <div className="mt-6 border border-[#9AA4B2] bg-[#E9EDF4] p-4 text-sm leading-7 text-[#334155] shadow-[inset_1px_1px_0_#ffffff]">
          Bu modülün CRUD ekranı sonraki admin promptlarında eklenecek. Bu sayfa şimdilik route,
          layout ve local control panel temelini doğrulamak için hazır tutuluyor.
        </div>
      </AdminPanel>
    </AdminWindow>
  );
}

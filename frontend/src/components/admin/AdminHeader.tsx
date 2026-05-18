interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <div className="mb-8 border-b border-gray-200 pb-4">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
    </div>
  );
}

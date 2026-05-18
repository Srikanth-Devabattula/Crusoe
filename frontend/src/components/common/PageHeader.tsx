interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-10">
      <h1 className="page-heading">{title}</h1>
      {description && <p className="page-subheading">{description}</p>}
    </header>
  );
}

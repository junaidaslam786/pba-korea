interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="bg-linear-to-br from-pba-900 via-pba-800 to-pba-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 text-lg text-pba-200 max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

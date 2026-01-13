interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}

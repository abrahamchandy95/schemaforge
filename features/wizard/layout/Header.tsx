type Props = {
  stepLabel: string;
  title: string;
  description: string;
  helpHref?: string;
  helpLabel?: string;
};

export function Header({
  stepLabel,
  title,
  description,
  helpHref = '#',
  helpLabel = 'Help / Guide / Documentation',
}: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {stepLabel}: {title.toUpperCase()}
        </h1>

        <p className="mt-3 text-lg leading-7 text-slate-700">{description}</p>
      </div>

      <a
        href={helpHref}
        className="mt-3 shrink-0 text-base font-medium text-sky-700 underline underline-offset-2"
      >
        {helpLabel}
      </a>
    </div>
  );
}

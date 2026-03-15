import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">
            TigerGraph GSQL Schema PoC
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Build AI-assisted graph schema recommendations
          </h1>
          <p className="max-w-2xl text-slate-600">
            Start with a guided wizard that captures your goal, use case, query
            expectations, and dataset context.
          </p>
        </div>

        <Link
          href="/wizard"
          className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
        >
          Open wizard
        </Link>
      </div>
    </main>
  );
}

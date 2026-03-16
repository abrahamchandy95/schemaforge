'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCase, useMapping, useUpload } from '@/features/wizard/provider';
import { Frame, Empty, Section } from '@/features/wizard/ui';
import { profileFiles } from '@/features/wizard/services/profile';
import { Matches } from '@/features/wizard/steps/05-understanding/Matches';
import { Summary } from '@/features/wizard/steps/05-understanding/Summary';
import { Warnings } from '@/features/wizard/steps/05-understanding/Warnings';

export function Understanding() {
  const { files } = useUpload();
  const { kit } = useCase();
  const { profile, setProfile, clearProfile } = useMapping();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fileSig = useMemo(
    () => files.map((file) => `${file.id}:${file.name}:${file.sizeBytes}`).join('|'),
    [files],
  );

  useEffect(() => {
    clearProfile();
    setErr(null);
  }, [kit, fileSig, clearProfile]);

  async function run() {
    if (files.length === 0) {
      setErr('Upload at least one file first.');
      return;
    }

    setBusy(true);
    setErr(null);

    try {
      const next = await profileFiles({ kit, files });
      setProfile(next);
    } catch (error) {
      setErr(
        error instanceof Error ? error.message : 'Failed to profile uploaded files.',
      );
    } finally {
      setBusy(false);
    }
  }

  const hasFiles = files.length > 0;
  const hasProfile = profile !== null;

  return (
    <Frame
      stepLabel="STEP 5"
      title="Data Understanding"
      description="Profile uploaded files and inspect how well they line up with the selected kit before doing explicit field mapping."
    >
      <div className="space-y-5">
        <Section title="Run Profiling">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-slate-700">
                Profiling reads headers and a few sample values in memory. It
                does not scan entire datasets.
              </p>
              <p className="text-xs text-slate-500">
                Selected kit: {kit ?? 'none'}
              </p>
            </div>

            <button
              type="button"
              onClick={run}
              disabled={!hasFiles || busy}
              className="rounded-xl border border-sky-700 bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Profiling…' : hasProfile ? 'Run Again' : 'Run Profile'}
            </button>
          </div>
        </Section>

        {err && (
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        {!hasFiles ? (
          <Empty
            title="No uploaded files"
            description="Upload files first so the app can inspect headers and build a profile."
          />
        ) : !hasProfile ? (
          <Empty
            title="No profile yet"
            description="Click Run Profile to inspect your uploaded files."
          />
        ) : (
          <>
            <Summary profile={profile} />
            <Matches kit={kit} matches={profile.matches} />
            <Warnings items={profile.warnings} />

            <Section title="Next">
              <p className="text-sm text-slate-700">
                Continue to the next step to map uploaded columns to the selected
                kit and generate the loading job preview.
              </p>
            </Section>
          </>
        )}
      </div>
    </Frame>
  );
}

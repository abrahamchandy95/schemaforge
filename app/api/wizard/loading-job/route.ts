import { NextResponse } from 'next/server';
import { normalizeKitId } from '@/features/wizard/model/kits';
import type { SolutionKitId } from '@/features/wizard/model/types';
import { supportsLoadingJobPreview } from '@/lib/tigergraph/kits/policy';
import { renderTransactionFraudLoadingJob } from '@/lib/tigergraph/loading-job/transaction-fraud';
import type { SelectedMapping } from '@/lib/tigergraph/mapping/types';
import type { ProfiledFile } from '@/lib/tigergraph/profiling/types';
import { buildSchemaPreview } from '@/lib/tigergraph/preview/schema';

type Body = {
  kit: SolutionKitId | null;
  files: ProfiledFile[];
  selected: SelectedMapping[];
};

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const kit = normalizeKitId(body.kit);

    if (!supportsLoadingJobPreview(kit)) {
      return NextResponse.json(
        { error: 'Loading-job preview is not implemented for this kit yet.' },
        { status: 400 },
      );
    }

    switch (kit) {
      case 'transaction_fraud': {
        const schema = buildSchemaPreview({
          kit,
          selected: body.selected ?? [],
        });

        const job = renderTransactionFraudLoadingJob(
          body.files ?? [],
          body.selected ?? [],
        );

        return NextResponse.json({
          schema: schema.text,
          text: job.text,
          warnings: [...schema.warnings, ...job.warnings],
          supportedVertices: schema.supportedVertices,
          supportedEdges: schema.supportedEdges,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Loading-job preview is not implemented for this kit yet.' },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('wizard/loading-job failed', error);

    return NextResponse.json(
      { error: 'Failed to generate loading job preview.' },
      { status: 500 },
    );
  }
}

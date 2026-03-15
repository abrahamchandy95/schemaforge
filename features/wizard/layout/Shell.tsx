'use client';

import { steps } from '@/features/wizard/model/steps';
import { useNav } from '@/features/wizard/provider';
import { Nav } from '@/features/wizard/layout/Nav';
import { Router } from '@/features/wizard/layout/Router';
import { Sidebar } from '@/features/wizard/layout/Sidebar';

export function Shell() {
  const { index, isFirst, isLast, canContinue, previous, next, goTo } = useNav();

  return (
    <main className="min-h-screen bg-slate-300 p-4 text-slate-900">
      <div className="mx-auto min-h-[90vh] max-w-[1400px] overflow-hidden rounded-sm border border-slate-500 bg-white shadow-sm">
        <div className="border-b border-slate-500 bg-slate-200 px-6 py-3 text-center text-lg font-semibold tracking-wide text-slate-800">
          TIGERGRAPH DATA TO GRAPH WIZARD
        </div>

        <div className="grid min-h-[820px] grid-cols-[280px_1fr]">
          <Sidebar items={steps} activeIndex={index} onSelect={goTo} />

          <section className="bg-white p-8">
            <div className="mx-auto flex h-full max-w-5xl flex-col">
              <Router />

              <Nav
                isFirstStep={isFirst}
                isLastStep={isLast}
                canContinue={canContinue}
                onBack={previous}
                onNext={next}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

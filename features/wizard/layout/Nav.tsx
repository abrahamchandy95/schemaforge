type Props = {
  isFirstStep: boolean;
  isLastStep: boolean;
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function Nav({
  isFirstStep,
  isLastStep,
  canContinue,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className="rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Back
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isLastStep || !canContinue}
        className="rounded-xl border border-sky-700 bg-sky-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}

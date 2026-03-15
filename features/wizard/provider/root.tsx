'use client';

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { flowReducer } from '@/features/wizard/flow/reducer';
import type { FlowAction } from '@/features/wizard/flow/actions';
import { DEFAULT_WIZARD_STATE } from '@/features/wizard/model/defaults';
import type { WizardState } from '@/features/wizard/model/types';

type Store = {
  state: WizardState;
  dispatch: Dispatch<FlowAction>;
};

const Ctx = createContext<Store | null>(null);

export function Root({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(flowReducer, DEFAULT_WIZARD_STATE);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useRoot() {
  const value = useContext(Ctx);

  if (!value) {
    throw new Error('useRoot must be used inside provider Root');
  }

  return value;
}

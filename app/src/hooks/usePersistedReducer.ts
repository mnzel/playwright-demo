import { useReducer, useEffect } from 'react';
import type { Dispatch, Reducer } from 'react';
import { readFromStorage, writeToStorage } from './useLocalStorage.ts';

// useReducer that hydrates from localStorage on mount and writes back on every state change.
export function usePersistedReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  storageKey: string
): [S, Dispatch<A>] {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (init) => readFromStorage(storageKey, init)
  );

  useEffect(() => {
    writeToStorage(storageKey, state);
  }, [storageKey, state]);

  return [state, dispatch];
}

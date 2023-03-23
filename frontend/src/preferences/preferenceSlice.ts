import {
  createListenerMiddleware,
  createSlice,
  isAnyOf,
} from '@reduxjs/toolkit';
import {
  Doc,
  setLocalApiKey,
  setLocalRecentDocs,
  setLocalRecentIndex,
  Index,
  Key,
} from './preferenceApi';
import { RootState } from '../store';

interface Preference {
  apiKey: string;
  selectedDocs: Doc | null;
  sourceDocs: Doc[] | null;
  sourceIndexes: Doc[] | null;
  selectedIndexes: Index | null;
}

const initialState: Preference = {
  apiKey: '',
  selectedDocs: {
    name: 'ONES Manual',
    key: Key.Manual,
  },
  sourceDocs: null,
  sourceIndexes: null,
  selectedIndexes: {
    name: 'Faiss',
    key: Key.faiss,
  },
};

export const prefSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    setApiKey: (state, action) => {
      state.apiKey = action.payload;
    },
    setSelectedDocs: (state, action) => {
      state.selectedDocs = action.payload;
    },
    setSourceDocs: (state, action) => {
      state.sourceDocs?.push(...action.payload);
    },

    setSourceIndexes: (state, action) => {
      state.sourceIndexes?.push(...action.payload);
    },
    setSelectedIndexes: (state, action) => {
      state.selectedIndexes = action.payload;
    },
  },
});

export const {
  setApiKey,
  setSelectedDocs,
  setSourceDocs,
  setSourceIndexes,
  setSelectedIndexes,
} = prefSlice.actions;
export default prefSlice.reducer;

export const prefListenerMiddleware = createListenerMiddleware();
prefListenerMiddleware.startListening({
  matcher: isAnyOf(setApiKey),
  effect: (action, listenerApi) => {
    setLocalApiKey((listenerApi.getState() as RootState).preference.apiKey);
  },
});

prefListenerMiddleware.startListening({
  matcher: isAnyOf(setSelectedDocs),
  effect: (action, listenerApi) => {
    setLocalRecentDocs(
      (listenerApi.getState() as RootState).preference.selectedDocs ??
        ([] as unknown as Index),
    );
  },
});

prefListenerMiddleware.startListening({
  matcher: isAnyOf(setSelectedIndexes),
  effect: (action, listenerApi) => {
    setLocalRecentIndex(
      (listenerApi.getState() as RootState).preference.selectedIndexes ??
        ([] as unknown as Doc),
    );
  },
});

export const selectApiKey = (state: RootState) => state.preference.apiKey;
export const selectApiKeyStatus = (state: RootState) =>
  !!state.preference.apiKey;

export const selectSelectedDocsStatus = (state: RootState) =>
  !!state.preference.selectedDocs;
export const selectSourceDocs = (state: RootState) =>
  state.preference.sourceDocs;
export const selectSelectedDocs = (state: RootState) => {
  console.log(state.preference.selectedDocs, 333);

  return state.preference.selectedDocs;
};

export const selectSelectedIndexesStatus = (state: RootState) =>
  !!state.preference.selectedIndexes;
export const selectSourceIndexes = (state: RootState) => {
  console.log(state.preference.sourceIndexes, 444);

  return state.preference.sourceIndexes;
};
export const selectSelectedIndexes = (state: RootState) =>
  state.preference.selectedIndexes;

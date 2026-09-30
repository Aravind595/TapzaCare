import {configureStore, createSlice} from '@reduxjs/toolkit';

interface AppState {
  isFestival: boolean;
}

const initialState: AppState = {
  isFestival: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.isFestival = !state.isFestival;
    },
  },
});

export const {toggleTheme} = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
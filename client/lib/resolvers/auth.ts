import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthTokenState {
    token: string | null;
}

const initialState: AuthTokenState = {
    token: null,
};

const authTokenSlice = createSlice({
    name: 'authToken',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },
        clearToken(state) {
            state.token = null;
        },
    },
});

// Export the actions
export const { setToken, clearToken } = authTokenSlice.actions;

// Export the reducer
export default authTokenSlice.reducer;

import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const initialAppState = {
    status: 'loading' as RequestStatusType,
    error: null as AppErrorType,
    isInitialized: false
}

const slice = createSlice({
    name: "app",
    initialState: initialAppState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{error: string | null }>) {
            state.error = action.payload.error
        },

    }
})

export const appReducer = slice.reducer;

export const {setAppStatusAC,  setAppErrorAC} = slice.actions


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppErrorType = string | null
export type InitialStateAppReduceType = typeof initialAppState
export type ErrorUtilsDispatchType  = ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>



import {v1} from "uuid";
import {todoListApi, TodoListType} from "../../API/todolists-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../App/App-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

//---------- INITIAL STATE
export const todoListID1: string = v1();
export const todoListID2: string = v1();
export const InitialStateTodolist = [
    // {id: todoListID1, title: "", filter: "ALL", addedDate: "", order: 0},
]

const slice = createSlice({
    name: 'todolist',
    initialState: InitialStateTodolist as TodoListDomainType[],
    reducers: {
        changeTodolistTitleAC(state, action: PayloadAction<{ title: string, id: string }>) {
            const index = state.findIndex(t => t.id === action.payload.id)
            state[index].title = action.payload.title
        },
        removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex((t) => t.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1);
            }
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ filter: FilterType, id: string }>) {
            const index = state.findIndex(t => t.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        addTodolistAC(state, action: PayloadAction<{ todoList: any }>) {
            state.unshift({...action.payload.todoList, filter: "ALL", entityStatus: 'idle'})
        },
        setTodolistsAC(state, action: PayloadAction<{ todoLists: TodoListType[] }>) {
            return action.payload.todoLists.map(t => ({...t, filter: 'ALL', entityStatus: 'idle'}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(t => t.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
    }
})

export const todoListsReducer = slice.reducer;


export const {
    changeTodolistTitleAC,
    removeTodolistAC,
    changeTodolistFilterAC,
    addTodolistAC,
    setTodolistsAC,
    changeTodolistEntityStatusAC
} = slice.actions;

//------ THUNKS

export const setTodoLists = createAsyncThunk<any, any>(
    "todolist/setTodoLists",
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
        try {
            const res = await todoListApi.getTodoLists()
            if (res.status === 200) {
                thunkAPI.dispatch(setTodolistsAC({todoLists: res.data.items}))
                thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
            } else {
                thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
                thunkAPI.dispatch(setAppErrorAC({error: "Error"}));
            }
        } catch (error) {
            return 'ERROR'
            // return handleAsyncServerNetworkError(error, thunkAPI);
        }
    },
);

// export const setTodoLists = () => (dispatch: Dispatch<any>) => {
//     dispatch(setAppStatusAC({status: "loading"}))
//     todoListApi.getTodoLists()
//         .then(res => {
//             dispatch(setTodolistsAC({todoLists: res.data}))
//             dispatch(setAppStatusAC({status: "succeeded"}))
//         })
// }
export const removeTodoListTC = createAsyncThunk<any, any>(
    "todolist/removeTodoListTC",
    async (todoListId: string, thunkAPI) => {
        console.log(todoListId,'todoListId')
        thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
        thunkAPI.dispatch(changeTodolistEntityStatusAC({id: todoListId, entityStatus: 'loading'}))
        try {
            const res = await  todoListApi.deleteTodoList(todoListId)
            if (res.status === 204) {
                console.log(res,'res delete')
                thunkAPI.dispatch(removeTodolistAC({todolistId: todoListId}))
                thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
                thunkAPI.dispatch(changeTodolistEntityStatusAC({id: todoListId, entityStatus: 'succeeded'}))
            } else {
                thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
                thunkAPI.dispatch(setAppErrorAC({error: "Remove TodoList  Error"}));
            }
        } catch (error) {
            return 'ERROR'
            // return handleAsyncServerNetworkError(error, thunkAPI);
        }
    },
);
// export const removeTodoListTC = (todoListId: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: "loading"}))
//     dispatch(changeTodolistEntityStatusAC({id: todoListId, entityStatus: 'loading'}))
//     todoListApi.deleteTodoList(todoListId)
//         .then(res => {
//             dispatch(removeTodolistAC({todolistId: todoListId}))
//             dispatch(setAppStatusAC({status: "succeeded"}))
//             dispatch(changeTodolistEntityStatusAC({id: todoListId, entityStatus: 'succeeded'}))
//         })
// }

export const addTodoListTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todoListApi.createTodoList(title)
        .then(res => {
            if (res.status === 201) {
                console.log(res,'201')
                console.log(res.data,'res.data')
                dispatch(addTodolistAC({todoList: res.data}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                console.log(res)
                if (res.data.messages.length) {
                    dispatch(setAppErrorAC({error: res.data.messages[0]}))
                } else {
                    dispatch(setAppErrorAC({error: "Some error occurred"}))
                }
                dispatch(setAppStatusAC({status: 'succeeded'}))
            }
        })
        .catch((error) => {
            dispatch(setAppErrorAC(error.message))
            dispatch(setAppStatusAC({status: 'failed'}))
        })
}

export const changeTodoListTitleTC = (title: string, id: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todoListApi.updateTodoList(id, title)
        .then(res => {
            console.log(res)
            if (res.status === 204) {
                console.log(res.status,'put res.status 204')
                dispatch(setAppStatusAC({status: "succeeded"}))
                dispatch(changeTodolistTitleAC({title: title, id}))
            }
        })
        .catch((error) => {
            dispatch(setAppErrorAC({error: error.message}))
            dispatch(setAppStatusAC({status: 'failed'}))
        })
}

//------ TYPES
export type FilterType = "ALL" | "ACTIVE" | "COMPLETED" | string;
export type TodoListDomainType = TodoListType & {
    filter: FilterType
    entityStatus: RequestStatusType
}
export type TodoListsActionTypes = ReturnType<typeof changeTodolistFilterAC> |
    ReturnType<typeof addTodolistAC> |
    ReturnType<typeof changeTodolistTitleAC> |
    ReturnType<typeof removeTodolistAC> |
    ReturnType<typeof setTodolistsAC> |
    ReturnType<typeof changeTodolistEntityStatusAC>


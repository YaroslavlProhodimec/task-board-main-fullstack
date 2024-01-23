import axios from "axios";


const axiosInstance = axios.create({
    baseURL: "https://back-task-board-main.vercel.app/",
    // baseURL: "http://localhost:5000",

})

export const todoListApi = {
    getTodoLists() {
        return axiosInstance.get<{
            items: TodoListType[]

        }>("/todo-lists")
    },
    createTodoList(title: string) {
        return axiosInstance.post<ResponseType<{
            id: string
            addedDate: string,
            title: string,
        }>>("/todo-lists", {title: title})
    },
    updateTodoList(id: string, title: string) {
        return axiosInstance.put<ResponseType>(`/todo-lists/${id}`, {title: title})
    },
    deleteTodoList(id: string) {
        return axiosInstance.delete<ResponseType>(`/todo-lists/${id}`)
    },


    getTasks(todoListId: string) {
        return axiosInstance.get<GetTasksResponse>(`/todo-lists/${todoListId}/tasks`)
    },
    deleteTasks(taskId: string, todoListId: string) {
        return axiosInstance.delete<ResponseType>(`/todo-lists/${todoListId}/tasks/${taskId}`)
    },
    updateTask(todoListId: string, taskId: string, model: UpdateTask) {
        return axiosInstance.put<ResponseType>(`/todo-lists/${todoListId}/tasks/${taskId}`, model)
    },
    createTask(todoListId: string, title: string) {
        return axiosInstance.post<ResponseType<any>>(`todo-lists/${todoListId}/tasks`, {title: title})
    }
}


export enum TaskStatus {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    low,
    Middle,
    Hi,
    Urgently,
    Later,
}

export type TodoListType = {
    id: string,
    title: string,
    addedDate: string,
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    data: D
}
export type TaskType = {
    title: string
    status: TaskStatus
    id: string
    addedDate: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
export type UpdateTask = {
    title: string
    status: TaskStatus
}

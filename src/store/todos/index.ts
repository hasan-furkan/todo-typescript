import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Todo {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

type TodosState = Todo[];

const initialState: TodosState = [];

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<Todo>) => {
            return [...state, action.payload];
        },
        removeTodo: (state, action: PayloadAction<number>) => {
            return state.filter((todo) => todo.id !== action.payload);
        },
        editTodo: (state, action: PayloadAction<Todo>) => {
            return state.map((todo) => {
                if (todo.id === action.payload.id) {
                    return {
                        ...todo,
                        ...action.payload,
                    };
                }
                return todo;
            });
        }
    },
})

export const { addTodo, removeTodo, editTodo } = todosSlice.actions;
export default todosSlice.reducer;


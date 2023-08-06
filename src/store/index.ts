import { configureStore } from '@reduxjs/toolkit'
import  todosSlice  from "./todos";
export const store = configureStore({
    reducer: {
        todosSlice: todosSlice
    },
})

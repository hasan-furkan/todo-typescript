'use client';
import {Todos} from "../pages/todos";
import { Provider } from "react-redux";
import { store } from "../store"
export default function Home() {
  return (
    <Provider store={store}>
      <Todos />
    </Provider>
  )
}

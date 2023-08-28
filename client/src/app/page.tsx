'use client';
import {Todos} from "../pages/Todos";
import { Provider } from "react-redux";
import { store } from "../store"
import React from "react";
export default function Home() {
  return (
    <Provider store={store}>
      <Todos />
    </Provider>
  )
}

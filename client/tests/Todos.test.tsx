import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from '@testing-library/react';
import { Todos } from '../src/pages/Todos';
import { Provider } from "react-redux";
import { store } from "../src/store";

describe('Todos Page', () => {
    it('can add a todo', () => {
        render(
            <Provider store={store}>
                <Todos />
            </Provider>
        );

        // 0 to do ile baslamali
        expect(screen.queryByText(/Delete/)).toBeNull();

        // to do ekle
        const input = screen.getByPlaceholderText('Add todo');
        fireEvent.change(input, { target: { value: 'New Todo' } });
        const addButton = screen.getByText('Add todo');
        fireEvent.click(addButton);

        // Yeni to do eklenmeli
        expect(screen.getByText('New Todo')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
    });
});


describe('Todos H1 Title', () => {
    it('renders the correct title', () => {
        render(
            <Provider store={store}>
                <Todos />
            </Provider>
        );

        expect(screen.getByText('Todos')).toBeInTheDocument();
    });
})

describe('Todos P Tag', () => {
    it('renders the correct p tag', () => {
        render(
            <Provider store={store}>
                <Todos />
            </Provider>
        );

        expect(screen.getByText('This is the todos page')).toBeInTheDocument();
    });
});
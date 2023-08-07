import { useState, useEffect } from "react";
import { TodoInterface } from "../interfaces/todoInterface";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, removeTodo, editTodo } from "@/store/todos";

export const Todos = () => {
    const random = Math.floor(Math.random() * 100) + 1;
    const [todo, setTodo] = useState('');
    const dispatch = useDispatch();
    const todosFromRedux = useSelector((state: any) => state.todosSlice);
    const [editing, setEditing] = useState<number | null>(null);

    const deleteTodo = (id: number) => {
        dispatch(removeTodo(id));
    }

    const editsTodo = (id: number) => {
        const edit = todosFromRedux.find((todo: TodoInterface) => todo.id === id);
        if (edit) {
            setEditing(edit.id);
            setTodo(edit.title);
            dispatch(editTodo({
                id: id,
                title: edit.title,
                updatedAt: new Date().toISOString()
            }));
        }
    }

    const onSubmit = (e: any) => {
        e.preventDefault();

        if (editing) {
            dispatch(editTodo({
                id: editing,
                title: todo,
                updatedAt: new Date().toISOString()
            }));
            setEditing(null);
        } else {
            dispatch(addTodo({
                id: random,
                title: todo,
                createdAt: new Date().toISOString()
            }));
        }
        setTodo('');
    };


    useEffect(() => {
    }, [todosFromRedux, todo]);

    return (
        <div>
            <h1>Todos</h1>
            <p>This is the todos page</p>
            <input
                id="todo"
                type="text"
                placeholder="Add todo"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                className="border border-gray-400 p-2"
            />

            <button onClick={onSubmit}>
                {editing ? 'Update' : 'Add todo'}
            </button>

            <ul className="flex">
                {todosFromRedux.map((todo: TodoInterface) => (
                    <div key={todo.id}>
                        <li>{todo.title}</li>
                        <button onClick={() => deleteTodo(todo.id)} type="button">Delete</button>
                        <button onClick={() => editsTodo(todo.id)} type="button">Edit</button>
                    </div>
                ))}
            </ul>
        </div>
    );
};

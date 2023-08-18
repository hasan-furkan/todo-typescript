import { useState, useEffect } from "react";
// @ts-ignore
import { TodoInterface } from "@/interfaces/todoInterface";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, removeTodo, editTodo } from "@/store/todos";
import { SvgComponent } from "@/components/svgs";

export const Todos = () => {
  const random = Math.floor(Math.random() * 100) + 1;
  const [todo, setTodo] = useState("");
  const dispatch = useDispatch();
  const todosFromRedux = useSelector((state: any) => state.todosSlice);
  const [editing, setEditing] = useState<number | null>(null);

  const deleteTodo = (id: number) => {
    dispatch(removeTodo(id));
  };

  const editsTodo = (id: number) => {
    const edit = todosFromRedux.find((todo: TodoInterface) => todo.id === id);
    if (edit) {
      setEditing(edit.id);
      setTodo(edit.title);
      dispatch(
        editTodo({
          id: id,
          title: edit.title, createdAt: "", description: "", status: "",
            updatedAt: new Date().toISOString()
        })
      );
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (editing) {
      dispatch(
        editTodo({
            createdAt: "", description: "", status: "",
            id: editing,
          title: todo,
          updatedAt: new Date().toISOString()
        })
      );
      setEditing(null);
    } else {
      dispatch(
        addTodo({
            description: "", status: "", updatedAt: "",
            id: random,
          title: todo,
          createdAt: new Date().toISOString()
        })
      );
    }
    setTodo("");
  };

  useEffect(() => {}, [todosFromRedux, todo]);

  return (
    <div>
      <h1>Todos</h1>
      <p>This is the todos page</p>
      <div className="flex flex-row">
          <SvgComponent iconName="attach" size={24} color="gray" />
        <input
          id="todo"
          type="text"
          placeholder="Add todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="border border-gray-400 p-2"
        />
        <button onClick={onSubmit}>{editing ? "Update" : "Add todo"}</button>
      </div>

      <ul className="flex">
        {todosFromRedux.map((todo: TodoInterface) => (
          <div key={todo.id}>
            <li>{todo.title}</li>
            <button onClick={() => deleteTodo(todo.id)} type="button">
              Delete
            </button>
            <button onClick={() => editsTodo(todo.id)} type="button">
              Edit
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

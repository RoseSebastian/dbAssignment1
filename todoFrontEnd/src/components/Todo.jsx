import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "../styles/todo.css";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  // Fetch all to-do items on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  // Handle form submission for creating a new to-do
  const handleCreateTodo = (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) {
      setError("Title is required");
      return;
    }
    axios
      .post("http://localhost:3000/todos", newTodo)
      .then((response) => {
        setTodos([...todos, response.data]);
        setNewTodo({ title: "", description: "" });
        setError("");
      })
      .catch((error) => console.error("Error creating todo:", error));
  };

  // Handle deleting a to-do item
  const handleDeleteTodo = (id) => {
    axios
      .delete(`http://localhost:3000/todos/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)))
      .catch((error) => console.error("Error deleting todo:", error));
  };

  // Handle toggling the completion status of a to-do
  const handleToggleComplete = (id) => {
    const todo = todos.find((t) => t._id === id);
    axios
      .put(`http://localhost:3000/todos/${id}`, {
        ...todo,
        completed: !todo.completed,
      })
      .then((response) => {
        setTodos(todos.map((t) => (t._id === id ? response.data : t)));
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  return (
    <div className="todo-app">
      <h1>To-Do List</h1>

      {/* Form for creating new to-dos */}
      <form onSubmit={handleCreateTodo}>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
        />
        <button type="submit">Add To-Do</button>
        {error && <p className="error">{error}</p>}
      </form>

      {/* List of to-dos */}
      <ul>
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className={todo.completed ? "completed" : "pending"}
          >
            <div className="title">
              <h4>{todo.title}</h4>
              <Form>
                <Form.Check
                  checked = {todo.completed}
                  type="switch"
                  id="custom-switch"
                  label="Completed"
                  onClick={() => handleToggleComplete(todo._id)}
                />
              </Form>
            </div>

            <p>{todo.description}</p>
            <Button
              variant="warning"
              onClick={() => handleDeleteTodo(todo._id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;

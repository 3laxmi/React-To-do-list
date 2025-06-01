import React, { useState, useEffect } from "react";
import "../App.css";

function Task() {
  const [task, setTask] = useState("");
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem("taskList");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("id");

  useEffect(() => {
    const savedTasks = localStorage.getItem("taskList");
    if (savedTasks) {
      setList(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(list));
  }, [list]);

  const handleChange = (e) => setTask(e.target.value);

  const addTask = () => {
    if (task.trim() === "") {
      alert("Task cannot be empty");
      return;
    }

    const newTask = {
      id: list.length === 0 ? 1 : list[list.length - 1].id + 1,
      taskName: task.trim(),
      completed: false,
    };

    setList([...list, newTask]);
    setTask("");
  };

  const deleteTask = (id) => {
    setList(list.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setList(
      list.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredList = list.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const sortedList = [...filteredList].sort((a, b) => {
    if (sort === "name") return a.taskName.localeCompare(b.taskName);
    return a.id - b.id;
  });

  return (
    <div>
      <h2>To-Do List</h2>

      <div className="addtask">
        <input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={handleChange}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="controls">
        <div className="filter">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>

        <div className="sort">
          <label>Sort by: </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="id">ID</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="list">
        {sortedList.length === 0 ? (
          <p>No tasks to display</p>
        ) : (
          sortedList.map((task) => (
            <div key={task.id} className="task-item">
              <h3
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.taskName}
              </h3>
              <button onClick={() => toggleComplete(task.id)}>
                {task.completed ? "Undo" : "Done"}
              </button>
              <button onClick={() => deleteTask(task.id)}>X</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Task;

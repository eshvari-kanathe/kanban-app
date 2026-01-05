import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  tasks: [],
  selectedTaskId: null, // for editing
  deleteTaskId: null,   // for confirmation dialog
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push({
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
      toast.success("Task Added successfully")
    },
    updateTask: (state, action) => {
      const { id, data } = action.payload;
      const index = state.tasks.findIndex((t) => t.id === id);
      if (index !== -1) state.tasks[index] = { ...state.tasks[index], ...data };
      state.selectedTaskId = null;
      toast.success("Updated Task ")
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      state.deleteTaskId = null;
    },
    moveTask: (state, action) => {
      const { id, status } = action.payload;
      const task = state.tasks.find((t) => t.id === id);
      if (task) task.status = status;
    },
    setEditTask: (state, action) => {
      state.selectedTaskId = action.payload; 
    },
    setDeleteTask: (state, action) => {
      state.deleteTaskId = action.payload;
    },
    cancelDelete: (state) => {
      state.deleteTaskId = null;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setEditTask,
  setDeleteTask,
  cancelDelete,
} = taskSlice.actions;

export const selectTasks = (state) => state.tasks.tasks;
export const selectEditTask = (state) =>
  state.tasks.tasks.find((t) => t.id === state.tasks.selectedTaskId);
export const selectDeleteTaskId = (state) => state.tasks.deleteTaskId;

export default taskSlice.reducer;

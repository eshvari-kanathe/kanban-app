import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { addTask, updateTask, selectEditTask } from "../redux/slices/taskSlice";

export default function Form({ open, setOpen, status, hideStatusField }) {
  const dispatch = useDispatch();
  const editData = useSelector(selectEditTask);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const newTask = {
      title: formData.get("title"),
      discription: formData.get("discription"),
      status: hideStatusField
        ? status 
        : formData.get("status"),
    };

    if (editData) {
      dispatch(updateTask({ id: editData.id, data: newTask }));
    } else {
      dispatch(addTask(newTask));
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editData ? "Update Task" : "Add Task"}</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit} id="task-form">
          <TextField
            required
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            variant="standard"
            defaultValue={editData?.title || ""}
          />

          <TextField
            required
            margin="dense"
            name="discription"
            label="Description"
            fullWidth
            variant="standard"
            defaultValue={editData?.discription || ""}
          />

          {!hideStatusField && (
            <TextField
              select
              margin="dense"
              name="status"
              label="Column"
              fullWidth
              variant="standard"
              defaultValue={editData?.status || status || "todo"}
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="inprogress">In Progress</MenuItem>
              <MenuItem value="ready">Ready for Testing</MenuItem>
              <MenuItem value="tested">Tested</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          )}
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="task-form">
          {editData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

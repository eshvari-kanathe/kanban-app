// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { onLogOut } from "../redux/slices/AuthSlice";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@mui/material";
// import Form from "../pages/Form";

// const Dashboard = () => {
//   const [open, setOpen] = useState(false);
//   const [task, setTask] = useState([]);
//   const [editData, setEditData] = useState(null);
//   const [editIndex, setEditIndex] = useState(null);
//   const [searchInput, setSearchInput] = useState("");
//   const [sortOrder, setSortOrder] = useState("newest");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const logOut = () => {
//     dispatch(onLogOut());
//     navigate("/");
//   };

//   const handleClickOpen = () => {
//     setEditData(null);
//     setEditIndex(null);
//     setOpen(true);
//   };

//   const handleAddTask = (newTask) => {
//     if (editIndex !== null) {
//       const update = [...task];
//       update[editIndex] = { newTask, createdAt: task[editIndex].createdAt };
//       setTask(update);
//     } else {
//       setTask([...task, {...newTask,
//   createdAt: new Date().toISOString()
//       }]);
//     }
//   };

//   const handleDelete = (index) => {
//     setTask(task.filter((item, id) => id !== index));
//     console.log("delete");
//   };

//   const handleEdit = (index) => {
//     setEditData(task[index]);
//     setEditIndex(index);
//     setOpen(true);
//   };

//   const filterTask = task.filter(
//     (item) =>
//       item.title.toLowerCase().includes(searchInput.toLowerCase()) ||
//       item.discription.toLowerCase().includes(searchInput.toLowerCase())
//   ).sort((a,b)=>{
//     const dateA=new Date(a.createdAt)
//     const dateB=new Date(b.createdAt)

//     return sortOrder=="newest"?dateB-dateA:dateA-dateB
//   });

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <nav className="flex justify-between items-center px-8 py-5 bg-gray-900 text-gray-100 shadow-lg">
//         <h1 className="text-3xl font-bold tracking-wide">CANBAN DASHBOARD</h1>

//         <button
//           onClick={logOut}
//           className="bg-gray-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
//         >
//           Log Out
//         </button>
//       </nav>

//       <div className="flex justify-between items-center px-8 py-4 bg-gray-800 text-gray-100 shadow-md mt-4 rounded-md mx-6">
//         <h2 className="text-2xl font-semibold tracking-wide">Tasks</h2>

//         <input
//           className="text-white border h-10 pl-2 rounded-2xl"
//           type="search"
//           placeholder="Search here.."
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//         />
//         <select className="bg-gray-700 text-white px-3 py-2 rounded-lg" value={sortOrder} onChange={(e)=>setSortOrder(e.target.value)}
//         >
//           <option value="newest">Newest</option>
//           <option value="oldest">Oldest</option>
//         </select>

//         <Button variant="outlined" onClick={handleClickOpen}>
//           Add Task
//         </Button>
//       </div>

//       <Form
//         open={open}
//         setOpen={setOpen}
//         onAddTask={handleAddTask}
//         editData={editData}
//       />

//       <div className="p-8">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           {filterTask.length === 0 ? (
//             <p className="text-gray-500 text-center text-lg">
//               No tasks found...
//             </p>
//           ) : (
//             filterTask.map((task, index) => (
//               <div
//                 key={index}
//                 className="border border-gray-300 bg-gray-50 rounded-xl p-4 mb-4 shadow-sm flex justify-between items-start"
//               >
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     {task.title}
//                   </h3>
//                   <p className="text-gray-700 mt-1">{task.discription}</p>
//                   <p className="text-gray-500 text-sm mt-2 italic">
//                     {task.createdAt}
//                   </p>
//                 </div>

//                 <div className="flex gap-3">
//                   {/* Edit Button */}
//                   <button
//                     onClick={() => handleEdit(index)}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition flex items-center gap-2"
//                   >
//                     ✏️ Edit
//                   </button>

//                   {/* Delete Button */}
//                   <button
//                     onClick={() => handleDelete(index)}
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-500 transition flex items-center gap-2"
//                   >
//                     🗑️ Delete
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onLogOut } from "../redux/slices/AuthSlice";
import {
  selectTasks,
  moveTask,
  setEditTask,
  setDeleteTask,
  cancelDelete,
  deleteTask,
  selectDeleteTaskId,
} from "../redux/slices/taskSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Form from "../pages/Form";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiPlus } from "react-icons/fi";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

const columns = [
  { key: "todo", label: "To Do" },
  { key: "inprogress", label: "In Progress" },
  { key: "ready", label: "Ready for Testing" },
  { key: "tested", label: "Tested" },
  { key: "completed", label: "Completed" },
];

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [activeStatus, setActiveStatus] = useState("todo");
  const [hideStatusField, setHideStatusField] = useState(false);

  const tasks = useSelector(selectTasks);
  const deleteTaskId = useSelector(selectDeleteTaskId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(onLogOut());
    navigate("/");
  };

  const handleEdit = (id) => {
    dispatch(setEditTask(id));
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    dispatch(setDeleteTask(id));
  };

  const confirmDelete = () => {
    dispatch(deleteTask(deleteTaskId));
  };

  const cancelDeleteClick = () => {
    dispatch(cancelDelete());
  };

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    dispatch(moveTask({ id: draggableId, status: destination.droppableId }));
  };

  const filteredTasks = tasks
    .filter(
      (t) =>
        t.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        t.discription.toLowerCase().includes(searchInput.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex justify-between px-8 py-5 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">KANBAN DASHBOARD</h1>
        <button onClick={logOut} className="bg-gray-700 px-4 py-2 rounded">
          Logout
        </button>
      </nav>

      <div className="flex flex-wrap gap-4 items-center px-8 py-4 bg-gray-800 text-white">
        <input
          type="search"
          placeholder="Search tasks..."
          className="px-3 py-2 rounded text-white border"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded bg-gray-700"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <Button
          variant="outlined"
          onClick={() => {
            setActiveStatus("todo");
            setHideStatusField(false);
            dispatch(setEditTask(null));
            setOpen(true);
          }}
        >
          Add Task
        </Button>
      </div>

      <Form
        open={open}
        setOpen={setOpen}
        status={activeStatus}
        hideStatusField={hideStatusField}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
          {columns.map((col) => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-200 rounded-lg p-4 min-h-[400px]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                      {col.label}
                      <span className="text-sm bg-gray-400 text-white px-2 rounded-full">
                        {
                          filteredTasks.filter((t) => t.status === col.key)
                            .length
                        }
                      </span>
                    </h2>

                    <button
                      onClick={() => {
                        setActiveStatus(col.key);
                        setHideStatusField(true);
                        dispatch(setEditTask(null));
                        setOpen(true);
                      }}
                      className="p-1 rounded hover:bg-gray-300"
                    >
                      <FiPlus size={18} />
                    </button>
                  </div>

                  {filteredTasks
                    .filter((t) => t.status === col.key)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 mb-3 rounded shadow"
                          >
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm">{task.discription}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex justify-between mt-2">
                              <button
                                onClick={() => handleEdit(task.id)}
                                className="text-blue-600 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(task.id)}
                                className="text-red-600 text-sm"
                              >
                                Delete
                              </button>
                              <ConfirmDeleteDialog
                                open={!!deleteTaskId}
                                onClose={cancelDeleteClick}
                                onConfirm={confirmDelete}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;

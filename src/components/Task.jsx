import "../styles/task.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
export default function Task() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [userId, setUserId] = useState(localStorage.getItem("id"));
  const [data, setData] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setRole(localStorage.getItem("role"));
    setUserId(localStorage.getItem("id"));
    //api call
    await axios
      .get(
        `${
          role === "user"
            ? `http://localhost:4000/task/${userId}`
            : `http://localhost:4000/allTasks`
        }`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            ...(localStorage.getItem("authorization")
              ? { Authorization: localStorage.getItem("authorization") }
              : {}),
          },
        }
      )
      .then((res) => {
        res.data.success ? setData(res.data.resData) : navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteTask = async (id) => {
    await axios
      .delete(`http://localhost:4000/deleteTask/${id}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...(localStorage.getItem("authorization")
            ? { Authorization: localStorage.getItem("authorization") }
            : {}),
        },
      })
      .then((res) => {
        setData(res.data.resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="task-container">
      <LogoutIcon
        className="logout-icon"
        onClick={() => {
          localStorage.removeItem("id");
          localStorage.removeItem("role");
          localStorage.removeItem("authorization");
          localStorage.removeItem("refreshToken");
          navigate("/");
        }}
      ></LogoutIcon>
      <div className="header">
        <h3 className="task-heading">Task Management</h3>
        <div>
          {role === "user" ? null : (
            <button
              onClick={async () => {
                await axios
                  .get("http://localhost:4000/allUsers", {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                      ...(localStorage.getItem("authorization")
                        ? {
                            Authorization:
                              localStorage.getItem("authorization"),
                          }
                        : {}),
                    },
                  })
                  .then((res) => {
                    setUserData(res.data.resData);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                setUserModalOpen(true);
              }}
              className="all-users-btn heading-btn"
            >
              USERS
            </button>
          )}
          <button
            onClick={() => setAddModalOpen(true)}
            className="create-task-btn heading-btn"
          >
            + CREATE
          </button>
        </div>
      </div>
      <Dialog open={userModalOpen}>
        <DialogTitle className="dialog-title">All Users</DialogTitle>
        <DialogContent>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {userData.length !== 0
                ? userData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.role}</td>
                    </tr>
                  ))
                : "No Data Exist"}
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <button
            className="dialog-btn cancel"
            onClick={() => setUserModalOpen(false)}
          >
            cancel
          </button>
        </DialogActions>
      </Dialog>
      <Dialog open={isAddModalOpen || isEditModalOpen}>
        <DialogTitle className="dialog-title">
          {isAddModalOpen ? "Add New Task" : "Edit Task"}
        </DialogTitle>
        <DialogContent>
          <form className="new-task-form">
            <div>
              <label className="form-label" htmlFor="task-name">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                name="title"
                id="text"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="task-deadline">
                Deadline
              </label>
              <input
                value={deadline}
                type="date"
                name="date"
                id="date"
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="task-des">
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                name="description"
                id="text"
                placeholder="Enter task description"
                required
              />
            </div>

            <label className="status" htmlFor="status">
              Task Status
            </label>
            <div className="task-status">
              <div className="pending">
                <input
                  type="radio"
                  name="status"
                  id="pending"
                  required
                  onChange={() => setStatus("pending")}
                  checked={status === "pending"}
                />
                <label className="status" htmlFor="pending">
                  Pending
                </label>
              </div>
              <div className="completed">
                <input
                  type="radio"
                  name="status"
                  id="completed"
                  onChange={() => setStatus("completed")}
                  checked={status === "completed"}
                />
                <label className="status" htmlFor="completed">
                  Completed
                </label>
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <button
            className="dialog-btn cancel"
            onClick={() => {
              setAddModalOpen(false);
              setEditModalOpen(false);
            }}
          >
            cancel
          </button>
          <button
            className="dialog-btn submit"
            onClick={async () => {
              isAddModalOpen
                ? await axios
                    .post(
                      "http://localhost:4000/task",
                      {
                        title,
                        description,
                        deadline,
                        taskStatus: status,
                        userId,
                        role,
                      },
                      {
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                          ...(localStorage.getItem("authorization")
                            ? {
                                Authorization:
                                  localStorage.getItem("authorization"),
                              }
                            : {}),
                        },
                      }
                    )
                    .then((res) => {
                      setData(res.data.resData);
                    })
                    .catch((err) => {
                      console.log(err);
                    })
                : await axios
                    .put(
                      `http://localhost:4000/editTask/${taskId}`,
                      {
                        title,
                        description,
                        deadline,
                        taskStatus: status,
                        userId,
                        role,
                      },
                      {
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                          ...(localStorage.getItem("authorization")
                            ? {
                                Authorization:
                                  localStorage.getItem("authorization"),
                              }
                            : {}),
                        },
                      }
                    )
                    .then((res) => {
                      setData(res.data.resData);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
              setDescription("");
              setDeadline("");
              setStatus("");
              setTitle("");
              setAddModalOpen(false);
              setEditModalOpen(false);
            }}
          >
            submit
          </button>
        </DialogActions>
      </Dialog>
      <div className="task-space">
        {data === null || data.length === 0 ? (
          <div style={{ color: "white" }}>No Task Available</div>
        ) : (
          data.map((item, index) => (
            <div className="task-card">
              <div className="tasks">
                <h3>{`Task no. ${index + 1}`}</h3>
                <h4>Title: {item.title}</h4>
                <p>
                  <b>Description: </b>
                  {item.description}
                </p>
                <p>
                  <b>Status: </b>
                  {item.taskStatus}
                </p>
                <p>
                  <b>Deadline: </b>
                  {item.deadline.split("T")[0]}
                </p>
              </div>
              <div className="action-btn">
                {role === "user" ? null : (
                  <DeleteForeverIcon
                    onClick={() => {
                      setTaskId(item._id);
                      setDeleteDialog(true);
                    }}
                    className="delete-icon"
                  />
                )}
                <EditIcon
                  onClick={() => {
                    setTaskId(item._id);
                    setTitle(item.title);
                    setDeadline(item.deadline);
                    setDescription(item.description);
                    setStatus(item.taskStatus);
                    setEditModalOpen(true);
                  }}
                  className="edit-icon"
                />
              </div>
              <Dialog open={deleteDialog}>
                <DialogTitle className="dialog-title">
                  Delete Confirmation
                </DialogTitle>
                <DialogContent>
                  Are you sure you want to delete this?
                </DialogContent>
                <DialogActions>
                  <button
                    className="dialog-btn submit"
                    onClick={() => {
                      deleteTask(taskId);
                      setDeleteDialog(false);
                    }}
                  >
                    confirm
                  </button>
                  <button
                    className="dialog-btn cancel"
                    onClick={() => {
                      setDeleteDialog(false);
                    }}
                  >
                    cancel
                  </button>
                </DialogActions>
              </Dialog>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

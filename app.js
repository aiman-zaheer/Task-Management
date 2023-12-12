const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const UserModel = require("./models/userModel");
const TaskModel = require("./models/taskModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleWare = require("./authMiddleWare/authMiddleWare.js");
const {
  encryptedPassword,
  getAccessToken,
  getRefreshToken,
  decryptedPassword,
} = require("./helper/authHelper.js");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    exposedHeaders: ["Authorization", "Refresh_Token"],
  })
);
app.use(express.json());

const sendResponse = (res, data, success, statusCode, message) => {
  res.json({
    resData: data,
    success: success,
    status: statusCode,
    message: message,
  });
};

app.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    const ss = await UserModel.findOne({ email });
    if (ss) {
      sendResponse(res, null, false, 403, "already exist");
    } else {
      const encryptPassword = await encryptedPassword(req.body.password);
      const data = { ...req.body, password: encryptPassword };
      const user = await UserModel.create(data);
      const dataObject = user.toObject();
      const { email, password, ...restData } = dataObject;
      sendResponse(res, restData, true, 200, "ok");
    }
  } catch (error) {
    sendResponse(res, null, false, 500, "Internal Error!");
    console.log(error);
  }
});
app.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const ss = await UserModel.findOne({ email, role });
    if (ss) {
      const isPasswordCorrect = await decryptedPassword(password, ss);
      if (isPasswordCorrect) {
        const accessToken = getAccessToken(ss);
        const refreshToken = getRefreshToken(ss);
        res.setHeader("Authorization", `Bearer ${accessToken}`);
        res.setHeader("Refresh_Token", `Bearer ${refreshToken}`);

        const dataObject = ss.toObject();
        const { email, password, ...restData } = dataObject;
        sendResponse(res, restData, true, 200, "ok");
      } else {
        sendResponse(res, null, false, 404, "Invalid email or password");
      }
    } else {
      sendResponse(res, null, false, 404, "Invalid email or password");
    }
  } catch (error) {
    sendResponse(res, null, false, 500, "Internal Error!");
    console.log(error);
  }
});
app.get("/task/:id", authMiddleWare, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.find({ userId: id });
    if (task) {
      sendResponse(res, task, true, 200, "ok");
    } else {
      sendResponse(res, null, false, 404, "?Task Not found");
    }
  } catch (error) {
    console.log(error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
});
app.delete("/deleteTask/:id", authMiddleWare, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.find({ _id: id });
    if (task) {
      const deletedTask = await TaskModel.deleteOne({ _id: id });
      if (deletedTask.deletedCount !== 0) {
        const allTask = await TaskModel.find({});
        sendResponse(res, allTask, true, 200, "ok");
      } else {
        sendResponse(res, null, false, 404, "Task not Found");
      }
    } else {
      sendResponse(res, null, false, 404, "Not found");
    }
  } catch (error) {
    console.log("error", error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
});
app.put("/editTask/:id", authMiddleWare, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, taskStatus, userId, role } = req.body;
    const task = await TaskModel.findOne({ _id: id });
    if (task) {
      let updatedTask = await TaskModel.updateOne(
        { _id: id },
        {
          $set: {
            title: title,
            description: description,
            deadline: deadline,
            taskStatus: taskStatus,
          },
        }
      );
      if (role === "admin") {
        const allTask = await TaskModel.find({});
        sendResponse(res, allTask, true, 200, "ok");
      } else {
        const allTaskUser = await TaskModel.find({ userId: userId });
        sendResponse(res, allTaskUser, true, 200, "ok");
      }
    } else {
      sendResponse(res, null, false, 404, "Task Not found");
    }
  } catch (error) {
    console.log("error", error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
});
app.post("/task", authMiddleWare, async (req, res) => {
  try {
    const { title, description, deadline, taskStatus, userId, role } = req.body;
    await TaskModel.create({
      title,
      description,
      deadline,
      taskStatus,
      userId,
    });
    if (role === "admin") {
      const allTask = await TaskModel.find({});
      sendResponse(res, allTask, true, 200, "ok");
    } else {
      const allTaskUser = await TaskModel.find({ userId: userId });
      sendResponse(res, allTaskUser, true, 200, "ok");
    }
  } catch (error) {
    sendResponse(res, null, false, 500, "Internal Error!");
    console.log(`${error}`);
  }
});
app.get("/allTasks", authMiddleWare, async (req, res) => {
  try {
    const task = await TaskModel.find({});
    if (task) {
      sendResponse(res, task, true, 200, "ok");
    } else {
      sendResponse(res, null, false, 404, "Task not Found");
    }
  } catch (error) {
    console.log(error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
});
app.get("/allUsers", authMiddleWare, async (req, res) => {
  try {
    const users = await UserModel.find({}).select("-email -password");
    if (users) {
      sendResponse(res, users, true, 200, "ok");
    } else {
      sendResponse(res, null, false, 404, "Task not Found");
    }
  } catch (error) {
    console.log(error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
});
app.post("/refreshToken", (req, res) => {
  const { Refresh_Token } = req.body;
  try {
    jwt.verify(
      Refresh_Token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          sendResponse(res, null, false, 401, "Unauthorized");
        } else {
          const accessToken = getAccessToken(decoded);
          res.setHeader("Authorization", `Bearer ${accessToken}`);
          sendResponse(res, null, true, 200, "refresh token generated");
        }
      }
    );
  } catch (error) {
    sendResponse(res, null, false, 500, "Internal Error!");
    console.log(error);
  }
});
module.exports = app;

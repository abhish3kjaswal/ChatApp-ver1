const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");

const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const app = express();

//importing files
const connectDB = require("./connect");

const Users = require("./models/Users");
const Conversations = require("./models/Conversations");
const Messages = require("./models/Messages");

//db connectDB function call
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
let port = process.env.port || 9000;


//Socket setup
let users = [];
io.on("connection", (socket) => {
  console.log("SOCKET--->", socket.id);

  //add logged in user into Socket -->
  socket.on("addUser", (userId) => {
    const isUserExist = users.find((u) => u.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  //send/Recieve messages

  socket.on(
    "sendMessage",
    async ({ conversationId, senderId, message, receiverId }) => {
      const receiver = users.find((u) => u.userId === receiverId);

      const user = await Users.findById(senderId);

      console.log("receiver-------->", receiver);
      if (receiver) {
        io.to(receiver.socketId)
          .to(socket.id)
          .emit("getMessage", {
            conversationId,
            senderId,
            message,
            receiverId,
            user: { id: user._id, fullName: user.fullName, email: user.email },
          });
      }
    }
  );


  //when any user disconnects --> 
  socket.on("disconnect", () => {
    users = users.filter((u) => u.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});



//Routes
app.get("/", (req, res) => {
  res.send("Welcome");
  res.end();
});

//Register User Api
app.post("/api/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "Please fill required fields" });
    } else {
      const isAlreadyEmail = await Users.findOne({ email });
      if (isAlreadyEmail) {
        res.status(400).json({ message: "User already exist" });
      } else {
        const newUser = new Users({
          fullName,
          email,
        });

        bcryptjs.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.log(err);
            return;
          } else {
            newUser.set("password", hashedPassword);
            newUser.save();
            next();
          }
        });
        return res.status(200).json({ message: "User created successfully" });
      }
    }
  } catch (e) {
    console.log("Err->", e);
  }
});

//Login UserApi

app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email password is required" });
    } else {
      const user = await Users.findOne({ email });
      if (!user) {
        res
          .status(400)
          .json({ message: "Please enter valid Email or Password" });
      } else {
        const isValidUser = await bcryptjs.compare(password, user.password);
        if (!isValidUser) {
          res
            .status(400)
            .json({ message: "Please enter valid Email or Password" });
        } else {
          const payload = {
            userId: user._id,
            email: user.email,
          };

          const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secretKey";

          jwt.sign(
            payload,
            JWT_SECRET_KEY,
            { expiresIn: 84600 },
            async (err, token) => {
              await Users.updateOne(
                { _id: user._id },
                {
                  $set: {
                    token,
                  },
                }
              );

              user.save();
              return res.status(200).json({
                user: {
                  email: user.email,
                  id: user._id,
                  fullName: user.fullName,
                },
                token: token,
                message: "logged in successfully",
              });
            }
          );

          // .json({ user,message:'logged in successfully' });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// <<<<<<<<<<< ----------- Conversation apis ---------- >>>>>>>>>>>>>

//create Conversation api

app.post("/api/conversation", async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;

    const conversation = new Conversations({ members: [senderId, receiverId] });

    await conversation.save();
    res.status(200).json({ message: "Conversation created successfully" });
  } catch (error) {
    console.log("Err->", error);
  }
});

//get all conversationDetails
app.get("/api/conversations", async (req, res, next) => {
  try {
    // const conversationId = req.params.conversationId;

    const conversation = await Conversations.find();

    res.status(200).json(conversation);
  } catch (error) {
    console.log("Err->", error);
  }
});

//get conversation details
app.get("/api/conversation/admin/:conversationId", async (req, res, next) => {
  try {
    const conversationId = req.params.conversationId;

    const conversation = await Conversations.findById(conversationId);

    res.status(200).json(conversation);
  } catch (error) {
    console.log("Err->", error);
  }
});

//get conversation details of specific user api
app.get("/api/conversation/user/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });

    const conversationUsersData = Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find((member) => {
          return member !== userId;
        });
        if (receiverId) {
          const user = await Users.findById(receiverId);
          return {
            user: { fullName: user.fullName, email: user.email, id: user._id },
            conversationId: conversation._id,
          };
        }
      })
    );
    res.status(200).json(await conversationUsersData);
  } catch (error) {
    console.log("Error->", error);
  }
});

// Create Messages api
app.post("/api/message", async (req, res, next) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;

    //senderId and Message error
    if (!senderId || !message) {
      res.status(400).json({ message: "Please fill required fields" });
    }

    //if ConversationId is not there
    if (conversationId === "new" && receiverId) {
      const newConversation = new Conversations({
        members: [senderId, receiverId],
      });

      await newConversation.save();

      console.log("newConversation-->", newConversation);

      const newMessage = await new Messages({
        conversationId: newConversation._id,
        senderId,
        message,
      });

      await newMessage.save();
      return res.status(200).json({ message: "Message Sent Successfully" });
    } else if (!conversationId && !receiverId) {
      return res.status(400).send("Please fill all fields");
    } else {
      const newMessage = new Messages({
        conversationId,
        senderId,
        message,
      });

      await newMessage.save();
      res.status(200).json({ message: "Message Sent Successfully" });
    }
  } catch (error) {
    console.log("Err-->", error);
  }
});

//get messages by conversationId

app.get("/api/messages/:conversationId", async (req, res, next) => {
  try {
    const conversationId = req.params.conversationId;

    console.log("conversationId--->", conversationId);

    //for 1st time empty message sending
    if (conversationId == "new") return res.status(200).json([]);

    const messages = await Messages.find({ conversationId });

    const messagesUserData = Promise.all(
      messages.map(async (message) => {
        const user = await Users.findById(message.senderId);
        return {
          user: { id: user._id, email: user.email, fullName: user.fullName },
          message: message.message,
        };
      })
    );

    res.status(200).json(await messagesUserData);
  } catch (error) {
    console.log("Err-->", error);
  }
});

//get all users data-->

app.get("/api/users", async (req, res, next) => {
  try {
    const users = await Users.find();
    const usersData = users.map((user) => {
      return {
        id: user._id,
        user: { fullName: user.fullName, email: user.email },
      };
    });
    res.status(200).json(usersData);
  } catch (error) {
    console.log("Err->", error);
  }
});

app.listen(port, () => {
  console.log("listening at-->", port);
});

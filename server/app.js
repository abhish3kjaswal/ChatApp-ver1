require('dotenv').config()
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const server = require('http').createServer(app)

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.REACT_SOCKET_URL || "http://localhost:3000",
    // origin: "http://localhost:3000",
  },
});


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
let port = process.env.PORT || 9000;


//Socket setup
let users = [];
io.on("connection", (socket) => {
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
      console.log(
        "SEND MESSAGE--->",
        conversationId,
        senderId,
        message,
        receiverId
      );
      const receiver = users.find((u) => u.userId === receiverId);
      const user = await Users.findById(senderId);

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
      else {
        // socket.emit('addUser',receiverId)

        // 1 way to do this--->
        // const user = { userId:receiverId, socketId: socket.id };
        // users.push(user);
        // io.emit("getUsers", users);
        // console.log("userssss------>", users);

        // const receiver = users.find((u) => u.userId === receiverId);
        // const newUser = await Users.findById(senderId);

        // io.to(receiver.socketId)
        // .to(socket.id)
        // .emit("getMessage", {
        //   conversationId,
        //   senderId,
        //   message,
        //   receiverId,
        //   user: { id: newUser._id, fullName: newUser.fullName, email: newUser.email },
        // });


        // another way to do this --->
        io.to(socket.id).emit("getMessage", {
          conversationId,
          senderId,
          message,
          receiverId,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
          },
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
    const { fullName, email, password, age, gender, phoneNo } = req.body;
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
          age,
          gender,
          phoneNo
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
    console.log("Err 1->", e);
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
    console.log("Err 2->", error);
  }
});

//get all conversationDetails
app.get("/api/conversations", async (req, res, next) => {
  try {
    // const conversationId = req.params.conversationId;

    const conversation = await Conversations.find();

    res.status(200).json(conversation);
  } catch (error) {
    console.log("Err 3->", error);
  }
});

//get conversation details
app.get("/api/conversation/admin/:conversationId", async (req, res, next) => {
  try {
    const conversationId = req.params.conversationId;

    const conversation = await Conversations.findById(conversationId);

    res.status(200).json(conversation);
  } catch (error) {
    console.log("Err 4->", error);
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
        const receiverId = conversation && conversation.members && conversation.members.find((member) => {
          return member != userId;
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
      // console.log("newConversation-->", newConversation);

      const newMessage = await new Messages({
        conversationId: newConversation._id,
        senderId,
        message,
      });

      await newMessage.save();
      return res
        .status(200)
        .json({
          message: "Message Sent Successfully",
          conversationId: newConversation._id,
        });
    } else if (!conversationId && !receiverId) {
      return res.status(400).send("Please fill all fields");
    } else {
      const newMessage = new Messages({
        conversationId,
        senderId,
        message,
      });

      await newMessage.save();
      res.status(200).json({
        message: "Message Sent Successfully",
        conversationId,
      });
    }
  } catch (error) {
    console.log("Err 5-->", error);
  }
});

//get messages by conversationId

app.get("/api/messages/:conversationId", async (req, res, next) => {
  try {

    //function to get messages
    const checkMessages = async (conversationId) => {
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
    };
    const conversationId = req.params.conversationId;
    if (conversationId == "new") {
      //for 1st time empty message sending
      const checkConversation = await Conversations.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (
        checkConversation &&
        Array.isArray(checkConversation) &&
        checkConversation.length > 0
      ) {
        //if user already there in myChats or not
        checkMessages(checkConversation[0]._id);
      } else {
        //when user is not there in my chats
        return res.status(200).json([]);
      }
    }
    else {
      //when user is there in my chats
      checkMessages(conversationId);
    }

  } catch (error) {
    console.log("Err 6-->", error);
  }
});

//get all users data-->

app.get("/api/users", async (req, res, next) => {
  try {
    const users = await Users.find();
    const usersData = users.map((user) => {
      return {
        id: user._id,
        user: { fullName: user.fullName, email: user.email, id: user._id },
      };
    });
    res.status(200).json(usersData);
  } catch (error) {
    console.log("Err 7->", error);
  }
});

app.get("/api/users/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;

    console.log("userID-->", userId)

    const userData = await Users.findOne({ _id: userId })

    console.log(userData)

    // const users = await Users.find();
    // const usersData = []
    const { fullName, email, age, gender, phoneNo } = userData
    res.status(200).json({ fullName, email, age, gender, phoneNo });
  } catch (error) {
    console.log("Err->", error);
  }
});

server.listen(port, () => {
  console.log("listening at-->", port);
});

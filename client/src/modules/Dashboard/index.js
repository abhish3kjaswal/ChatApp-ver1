import React, { useEffect, useState } from "react";
import userAvatar from "../../assets/userAvatar.svg";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

import { io } from "socket.io-client";

let flg = false;
const Dashboard = (props) => {
  const location = useLocation();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );

  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState({});
  const [messageText, setMessageText] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [tab, setTab] = useState("All");
  const [activeUsers, setActiveUsers] = useState([]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    //Socket
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?.id);

    socket?.on("getUsers", (users) => {
      console.log("Active Users-->", users);
      let ar = users.map((u) => u.userId);
      console.log("ARRRR--->", ar);
      setActiveUsers(ar);
    });

    socket?.on("getMessage", (data) => {
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev?.messages,
          { user: data.user, message: data.message },
        ],
      }));
    });
  }, [socket]);

  useEffect(() => {
    if (location.state && location.state.login) {
      toast.success("Logged in Successfully!");
    }
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
    const fetchConversations = async () => {
      const res = await fetch(
        `http://localhost:9000/api/conversation/user/${loggedInUser?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let resData = await res.json();
      resData = resData.filter((ele) => {
        return ele != null;
      });

      setConversations(resData);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:9000/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let resData = await res.json();
      resData = resData.filter((ele) => {
        return ele != null;
      });

      if (resData && flg == false) {
        flg = true;
        setUsers((prev) => {
          return resData;
        });
      }
    };

    fetchUsers();
  }, [users]);

  const handleConversation = async (e, conversationId, user, id = "") => {
    e && e.preventDefault();
    setConversationId(conversationId);

    if (conversationId == "new") {
      setReceiverId(id);
    }

    const resp = await fetch(
      `http://localhost:9000/api/messages/${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let resData = await resp.json();
    setMessages({ messages: resData, receiver: user });
  };

  const sendMessage = async (e) => {
    e && e.preventDefault();

    if(!messageText){
      return
    }

    let data = {
      conversationId: conversationId ? conversationId : "",
      senderId: user?.id,
      message: messageText ? messageText : "",
      receiverId: messages?.receiver?.id || receiverId || "",
    };

    //emit message to socket
    socket?.emit("sendMessage", data);

    const res = await fetch(`http://localhost:9000/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    setMessageText("");
  };

  const handleUsers = (e, id, user) => {
    e && e.preventDefault();
  };

  const changeTab = (e, tab) => {
    e && e.preventDefault();
    setTab(tab);
  };

  const convoUsers = conversations.map((c) => c.user?.id);
  convoUsers.push(user.id);
  const noConvoUsers = users.filter((u) => !convoUsers.includes(u.id));

  let actUserss = users.filter((u) => activeUsers.includes(u.id));
  // actUserss.push(user.id);
  actUserss = actUserss.filter((u) => u.id != user.id);

  console.log("activeUser--->", activeUsers);
  console.log("convoUsers->", convoUsers);
  console.log("noConvoUsers->", noConvoUsers);
  console.log("actUserss--->", actUserss);
  console.log("Tab--->", tab);

  return (
    <div className="w-screen flex">
      <ToastContainer />
      {/* left section */}
      <div className="w-[25%] h-screen bg-secondary">
        <div className="flex items-center my-8 mx-8">
          <div className="border border-primary p-[7px] rounded-full">
            <img src={userAvatar} width={60} height={60} />
          </div>
          <div className="ml-8">
            <div className="flex">
              <h3 className="text-2xl">
                {user && user.fullName ? user.fullName : ""}
              </h3>
              <Button
                // className="text-3xl font-light"
                className="w-auto ml-10 text-xs bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                onClick={(e) => {
                  localStorage.removeItem("user:token");
                  window.location.reload(true);
                }}
                label={"Log Out"}
              ></Button>
            </div>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>
        <hr />
        <div className="mx-8 mt-3">
          <div className="text-primary text-lg ">Messages</div>
          <div>
            {conversations && conversations.length ? (
              conversations.map(({ conversationId, user }) => {
                return (
                  <div
                    className="flex items-center py-8 border-b border-b-gray-600"
                    key={conversationId}
                    onClick={(e) => handleConversation(e, conversationId, user)}
                  >
                    <div className="cursor-pointer flex items-center">
                      <div className="border border-primary p-[5px] rounded-full">
                        <img src={userAvatar} width={40} height={40} />
                      </div>
                      <div className="ml-8">
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-sm font-light text-gray-800">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Conversations
              </div>
            )}
          </div>
        </div>
      </div>
      {/* mid section */}
      <div className="w-[50%] h-screen bg-white flex flex-col items-center shadow-sm">
        {messages?.receiver?.fullName ? (
          <div className="w-[75%] bg-secondary h-[80px] my-14 rounded-full flex items-center px-14 py-2 shadow-md">
            <div className="border border-primary p-[5px] rounded-full cursor-pointer">
              <img src={userAvatar} width={40} height={40} />
            </div>
            <div className="ml-6 mr-auto">
              <h3 className="text-lg ">
                {messages?.receiver?.fullName ? messages.receiver.fullName : ""}
              </h3>
              <p className="text-sm font-light text-gray-600">
                {" "}
                {messages?.receiver?.email ? messages.receiver.email : ""}
              </p>
            </div>
            <div className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-phone-incoming"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="black"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                <line x1="15" y1="9" x2="20" y2="4" />
                <polyline points="15 5 15 9 19 9" />
              </svg>
            </div>
          </div>
        ) : (
          ""
        )}
        <div
          className={
            "h-[75%] w-full " +
            (messages?.messages?.length || messages?.receiver?.fullName
              ? "overflow-scroll overscroll-auto overflow-x-hidden  shadow-sm"
              : "")
          }
        >
          {/*content messages */}
          <div className="p-14">
            {messages?.messages?.length ? (
              messages?.messages.map(({ message, user: { id } = {} }, i) => {
                return (
                  <div
                    className={
                      "max-w-[40%]  rounded-b-xl p-4 mb-6 " +
                      (id == user?.id
                        ? "bg-primary rounded-tl-xl text-white ml-auto"
                        : " bg-secondary rounded-tr-xl ")
                    }
                    key={i}
                  >
                    {message}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                {messages?.messages?.length || messages?.receiver?.fullName
                  ? "No Messages"
                  : "No Conversations"}
              </div>
            )}
          </div>
        </div>
        {messages?.receiver?.fullName ? (
          <div className="p-14 w-full flex items-center">
            <form onSubmit={sendMessage} className="flex items-center w-full">
              <Input
                placeholder="Type a mesaage"
                className="w-[75%]"
                inputClassName="p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none  "
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <div
                className="ml-4 p-2 bg-light rounded-full cursor-pointer"
                onClick={(e) => sendMessage(e)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-send"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                  <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
                </svg>
              </div>
              <div className="ml-3 p-2 bg-light rounded-full cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-circle-plus"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <circle cx="12" cy="12" r="9" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="12" y1="9" x2="12" y2="15" />
                </svg>
              </div>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* right section */}
      <div className="w-[25%] h-screen px-8 py-16">
        <div className="flex">
          <div
            className={
              "text-lg " + (tab == "All" ? " text-lime-500" : " text-primary")
            }
            onClick={(e) => changeTab(e, "All")}
          >
            Others
          </div>
          <div
            className={
              " text-lg ml-5" +
              (tab == "Active" ? " text-lime-500" : " text-primary")
            }
            onClick={(e) => changeTab(e, "Active")}
          >
            Active
          </div>
        </div>
        {tab == "All" ? (
          <div>
            {noConvoUsers && noConvoUsers.length ? (
              noConvoUsers.map(({ id, user }) => {
                return (
                  <div
                    className="flex items-center py-8 border-b border-b-gray-600"
                    key={id}
                    onClick={(e) => handleConversation(e, "new", user, id)}
                  >
                    <div className="cursor-pointer flex items-center">
                      <div className="border border-primary p-[5px] rounded-full">
                        <img src={userAvatar} width={40} height={40} />
                      </div>
                      <div className="ml-8">
                        <h3 className="text-lg font-semibold">
                          {user.fullName}
                        </h3>
                        <p className="text-sm font-light text-gray-800">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Users
              </div>
            )}
          </div>
        ) : (
          <div>
            {actUserss && actUserss.length ? (
              actUserss.map(({ id, user: actUser }) => {
                console.log("actUser--->", actUser);
                console.log("id--->", id);
                console.log(" user.id--->", user.id);
                return (
                    <div
                      className="flex items-center py-8 border-b border-b-gray-600"
                      key={id}
                      onClick={(e) => handleConversation(e, "new", actUser, id)}
                    >
                      <div className="cursor-pointer flex items-center">
                        <div className="border border-primary p-[5px] rounded-full">
                          <img src={userAvatar} width={40} height={40} />
                        </div>
                        <div className="ml-8">
                          <h3 className="text-lg font-semibold">
                            {actUser.fullName}
                          </h3>
                          <p className="text-sm font-light text-gray-800">
                            {actUser.email}
                          </p>
                        </div>
                      </div>
                    </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Users
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useRef, useState } from "react";
import userAvatar from "../../assets/userAvatar.svg";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'


//socket io client library
import { io } from "socket.io-client";
// import { getUserID } from "../../actions/profileAction";
import actions from "../../actions";
import Spinner from "../../components/Button/Spinner/spinner";

const { profileAction } = actions

const Dashboard = (props) => {
  const location = useLocation();
  const dispatch = useDispatch()
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  
  const [loading, setLoading] = useState(false)

  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState({});
  const [messageText, setMessageText] = useState("");
  const [tab, setTab] = useState("All");
  const [activeUsers, setActiveUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(null);

  const navigate = useNavigate();

  console.log("messages--->", messages)
  useEffect(() => {
    //Socket
    setSocket(io(`${process.env.REACT_APP_API_URL}`));
  }, []);


  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages?.messages]);

  useEffect(() => {
    socket?.emit("addUser", user?.id);

    socket?.on("getUsers", (users) => {
      let ar = users.map((u) => u.userId);
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

  //get users list with whom user had conversations
  const fetchUsersConversations = async (loggedInUser) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/conversation/user/${loggedInUser?.id}`,
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

  useEffect(() => {
    if (location.state && location.state.login) {
      toast.success("Logged in Successfully!");
    }
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));

    fetchUsersConversations(loggedInUser);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let resData = await res.json();
      resData = resData.filter((ele) => {
        return ele != null;
      });

      // if (resData && flg == false) {
      //   flg = true;
      //   setUsers(resData);
      // }
      setUsers(resData);
    };

    fetchUsers();
  }, []);

  const fetchConversations = async (e, conversationId, receiver, id = "") => {
    e && e.preventDefault();
    setConversationId(conversationId);
    setLoading(true)
    // if (conversationId == "new") {
    //   setReceiverId(id);
    // }

    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );


    let resData = await resp.json();
    setMessages({ messages: resData, receiver });
    setLoading(false)
  };

  const sendMessage = async (e) => {
    e && e.preventDefault();
    let loggedInUser = JSON.parse(localStorage.getItem("user:detail"));

    if (!messageText) {
      // toast.error("Please enter message");
      return;
    }

    let data = {
      conversationId: conversationId ? conversationId : "",
      senderId: user?.id,
      message: messageText ? messageText : "",
      receiverId: messages?.receiver?.id || "",
    };

    //emit message to socket
    socket?.emit("sendMessage", data);

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    // setting new conversation Id
    if (resData && resData.conversationId) {
      setConversationId(resData.conversationId);
    }
    if (resData) {
      fetchUsersConversations(loggedInUser);
    }

    setMessageText("");
  };

  // const handleUsers = (e, id, user) => {
  //   e && e.preventDefault();
  // };

  const changeTab = (e, tab) => {
    e && e.preventDefault();
    setTab(tab);
  };


  const profileClick = (e,id) => {
    e && e.preventDefault()
    dispatch(profileAction.fetchUserDetails(id))
    navigate('/profile')
  }


  const convoUsers = conversations.map((c) => c.user?.id);
  convoUsers.push(user.id);
  const noConvoUsers = users.filter((u) => user.id !== u.id);

  let actUserss = users.filter((u) => activeUsers.includes(u.id));
  // actUserss.push(user.id);
  actUserss = actUserss.filter((u) => u.id != user.id);

  return (
    <div className="w-screen flex ">
      <ToastContainer />
      {/* left section */}
      <div className="w-[25%] h-screen bg-secondary overflow-auto overflow-x-hidden">
        <div className="flex items-center my-8 mx-8">
          <div className="border border-primary p-[7px] rounded-full cursor-pointer" onClick={e =>
            profileClick(e, user.id)
          }>
            <img src={userAvatar} width={60} height={60} />
          </div>
          <div className="ml-8">
            <div className="flex">
              <h3 className="text-2xl">
                {user && user.fullName ? user.fullName : ""}
              </h3>
              <Button
                className="text-blue-600 text-xs w-auto ml-8 bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1.5 border border-blue-500 hover:border-transparent rounded profileBtn"
                onClick={(e) => {
                  profileClick(e, user.id)
                }}
                label={"Profile"}
              ></Button>
              <Button
                // className="text-3xl font-light"
                className="text-red-600 text-xs w-auto ml-5 bg-transparent hover:bg-red-500 font-semibold hover:text-white py-1 px-1.5 border border-red-500 hover:border-transparent rounded logOutBtn"
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
                    onClick={(e) => fetchConversations(e, conversationId, user)}
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
            <div className="border border-primary p-[5px] rounded-full cursor-pointer" onClick={e => profileClick(e, messages?.receiver?.id)}>
                <img src={userAvatar} width={40} height={40} />
              </div>
              <div className="ml-6 mr-auto  cursor-pointer" onClick={e => profileClick(e, messages?.receiver?.id)}>
                <h3 className="text-lg ">
                  {messages?.receiver?.fullName ? messages.receiver.fullName : ""}
                </h3>
                <p className="text-sm font-light text-gray-600">
                  {" "}
                  {messages?.receiver?.email ? messages.receiver.email : ""}
                </p>
              </div>
              {/* <div className="cursor-pointer">
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
            </div> */}
            </div>
          ) : (
            ""
          )}
          <div
            className={
              "h-[75%] w-full " +
              (messages?.messages?.length || messages?.receiver?.fullName
                ? "overflow-auto overscroll-auto overflow-x-hidden  shadow-sm mideSecBgP"
                : "")
            }
          >
            {/*content messages */}
          {loading ?
            <Spinner />
            : <div className="p-8" >
              {messages?.messages?.length ? (
                messages?.messages.map(({ message, user: { id } = {} }, i) => {
                  return (
                    <>
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
                      <div ref={messageRef}></div>
                    </>
                  );
                })
              ) : (
                <div className="text-center text-lg font-semibold mt-24">
                  {messages?.messages?.length || messages?.receiver?.fullName
                    ? "No Messages"
                    : "No Conversation Selected"}
                </div>
              )}
            </div>}
          </div>
          {messages?.receiver?.fullName ? (
            <div className="p-6 py-8 w-full flex items-center">
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
      <div className="w-[25%] h-screen px-8 py-16 overflow-auto overflow-x-hidden">
        <div className="flex">
          <div
            className={
              "text-lg cursor-pointer " + (tab == "All" ? " text-lime-500" : " text-primary")
            }
            onClick={(e) => changeTab(e, "All")}
          >
            All Users
          </div>
          <div
            className={
              " text-lg ml-5 cursor-pointer " +
              (tab == "Active" ? " text-lime-500" : " text-primary")
            }
            onClick={(e) => changeTab(e, "Active")}
          >
            Active
          </div>
        </div>
        {tab == "All" ? (
          <div className="">
            {noConvoUsers && noConvoUsers.length ? (
              noConvoUsers.map(({ id, user }) => {
                return (
                  <div
                    className="flex items-center py-8 border-b border-b-gray-600"
                    key={id}
                    onClick={(e) => fetchConversations(e, "new", user, id)}
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
                return (
                  <div
                    className="flex items-center py-8 border-b border-b-gray-600"
                    key={id}
                    onClick={(e) => fetchConversations(e, "new", actUser, id)}
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

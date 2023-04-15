import React from "react";
import userAvatar from "../../assets/userAvatar.svg";
import Button from "../../components/Button";
import Input from "../../components/Input";

const Dashboard = () => {
  const contacts = [
    { name: "John", status: "Available", img: userAvatar },
    { name: "Marry", status: "Available", img: userAvatar },
    { name: "Alex", status: "Available", img: userAvatar },
    { name: "Max", status: "Available", img: userAvatar },
    { name: "Son", status: "Available", img: userAvatar },
    { name: "Carl", status: "Available", img: userAvatar },
    { name: "Peter", status: "Available", img: userAvatar },
  ];
  return (
    <div className="w-screen flex">
      <div className="w-[25%] h-screen bg-secondary">
        <div className="flex items-center my-8 mx-8">
          <div className="border border-primary p-[7px] rounded-full">
            <img src={userAvatar} width={60} height={60} />
          </div>
          <div className="ml-8">
            <h3 className="text-2xl">Tutorials Dev</h3>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>
        <hr />
        <div className="mx-8 mt-3">
          <div className="text-primary text-lg ">Messages</div>
          <div>
            {contacts.map(({ name, status, img }) => {
              return (
                <div className="flex items-center py-8 border-b border-b-gray-600">
                  <div className="cursor-pointer flex items-center">
                    <div className="border border-primary p-[5px] rounded-full">
                      <img src={img} width={40} height={40} />
                    </div>
                    <div className="ml-8">
                      <h3 className="text-lg font-semibold">{name}</h3>
                      <p className="text-sm font-light text-gray-800">
                        {status}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-[50%] h-screen bg-white flex flex-col items-center shadow-sm">
        <div className="w-[75%] bg-secondary h-[80px] my-14 rounded-full flex items-center px-14  shadow-md">
          <div className="border border-primary p-[5px] rounded-full cursor-pointer">
            <img src={userAvatar} width={40} height={40} />
          </div>
          <div className="ml-6 mr-auto">
            <h3 className="text-lg ">Alex</h3>
            <p className="text-sm font-light text-gray-600">online</p>
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
        <div className="h-[75%] w-full overflow-scroll overscroll-auto overflow-x-hidden shadow-sm">
         {/*content messages */}
          <div className="p-14">
            <div className="max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 mb-5">
              Lorm impsum
            </div>
            <div className="max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-4 text-white">
              Lorm impsum, Lorm impsum, Lorm impsum
            </div>
            <div className="max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 mb-5">
              Lorm impsum
            </div>
            <div className="max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-4 text-white">
              Lorm impsum, Lorm impsum, Lorm impsum
            </div>
            <div className="max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 mb-5">
              Lorm impsum
            </div>
            <div className="max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-4 text-white">
              Lorm impsum, Lorm impsum, Lorm impsum
            </div>
            <div className="max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 mb-5">
              Lorm impsum
            </div>
            <div className="max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-4 text-white">
              Lorm impsum, Lorm impsum, Lorm impsum
            </div>
          </div>
        </div>
        <div className="p-14 w-full flex items-center">
          <Input
            placeholder="Type a mesaage"
            className="w-[75%]"
            inputClassName="p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none  "
          />
          <div className="ml-4 p-2 bg-light rounded-full cursor-pointer">
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
        </div>
      </div>
      <div className="w-[25%] h-screen"></div>
    </div>
  );
};

export default Dashboard;

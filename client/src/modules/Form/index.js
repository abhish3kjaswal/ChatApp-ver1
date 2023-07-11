import { useState, useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//The useNavigate hook is a function that allows us to navigate to a path programmatically within a function
import { useNavigate } from "react-router-dom";

const Form = ({ isSignInPage = false }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && { fullName: "" }),
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputs = (e) => {
    e && e.preventDefault();
    let { name, value } = e.target;
    if (name == "name") {
      setData({ ...data, fullName: value });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/${isSignInPage ? "login" : "register"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

   
    const resData = await res.json();

    if (res.status == 400) {
      toast.error(resData.message);
    } else {
      if (resData.token) {
        localStorage.setItem("user:token", resData.token);
        localStorage.setItem("user:detail", JSON.stringify(resData.user));
        navigate("/", { state: { login: true } });
      }
    }
  };

  useEffect(() => {
    return () => {
      setData({
        ...(!isSignInPage && { fullName: "" }),
        email: "",
        password: "",
      });
    };
  }, []);

  return (
    <div className="bg-light h-screen flex justify-center items-center">
      <ToastContainer />
      <div className="bg-white w-[600px] h-[800px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className="text-4xl font-extrabold">
          Welcome {isSignInPage && "Back"}
        </div>
        <div className="text-xl font-light mb-14">
          {isSignInPage
            ? "Log In now to get started"
            : "Sign up now to get started"}
        </div>
        <form
          className="flex flex-col items-center w-full"
          onSubmit={handleSubmit}
        >
          {!isSignInPage ? (
            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your Full Name"
              className="mb-6 w-[50%]"
              value={data.fullName}
              onChange={handleInputs}
            />
          ) : (
            ""
          )}
          <Input
            label="Email"
            name="email"
            placeholder="Enter your Email"
            className="mb-6 w-[50%]"
            type="email"
            value={data.email}
            onChange={handleInputs}
          />
          <Input
            label="Password"
            name="password"
            placeholder="Enter your Password"
            className="mb-14 w-[50%]"
            type="password"
            value={data.password}
            onChange={handleInputs}
          />
          <Button
            label={isSignInPage ? "Log In" : "Sign up"}
            className="w-1/2 mb-2"
            type="submit"
            // onClick={handleButton}
          />
        </form>
        <div>
          {isSignInPage
            ? "Didn't have an account? "
            : "Already have an account? "}
          <span
            className="text-primary cursor-pointer underline"
            onClick={() => {
              setData({
                ...(!isSignInPage && { fullName: "" }),
                email: "",
                password: "",
              });
              navigate(`/${isSignInPage ? "signUp" : "login"}`);
            }}
          >
            {isSignInPage ? "Sign Up" : "Log in"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Form;

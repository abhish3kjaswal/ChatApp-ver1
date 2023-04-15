import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";

const Form = ({ isSignInPage = false }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && { fullName: "" }),
    email: "",
    password: "",
  });
  const handleInputs = (e) => {
    e && e.preventDefault();
    let { name, value } = e.target;
    console.log("HERE------>", name);
    console.log("HERE------>", value);
    if (name == "name") {
      setData({ ...data, fullName: value });
    } else {
      setData({ ...data, [name]: value });
    }
  };
  const handleButton = (e) => {
    e && e.preventDefault();

    console.log("handleButton----->");
  };
  console.log("data---->", data);
  return (
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
        onSubmit={handleButton}
      >
        {!isSignInPage ? (
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your Full Name"
            className="mb-6"
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
          className="mb-6"
          type="email"
          value={data.email}
          onChange={handleInputs}
        />
        <Input
          label="Password"
          name="password"
          placeholder="Enter your Password"
          className="mb-14"
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
        <span className="text-primary cursor-pointer underline">
          {isSignInPage ? "Sign Up" : "Log in"}
        </span>
      </div>
    </div>
  );
};

export default Form;

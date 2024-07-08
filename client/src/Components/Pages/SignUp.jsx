import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Oauth from "./Oauth";

function SignUp() {
  const [formData, setForData] = useState({});
  //const [error, toast.error] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handelChange = (e) => {
    setForData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      toast.error(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }

    //console.log(data);
  };

  console.log(formData);
  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className=" flex flex-col gap-4" onSubmit={handelSubmit}>
        <div className=" flex flex-col sm:justify-between sm:flex-row gap-4">
          <input
            onChange={handelChange}
            type="text"
            placeholder="Name"
            className="w-80 border p-3 rounded-lg"
            id="name"
          />
          <input
            onChange={handelChange}
            type="text "
            placeholder="Username"
            className=" w-80 border p-3 rounded-lg"
            id="username"
          />
        </div>
        <input
          onChange={handelChange}
          type="email"
          placeholder="Email"
          className=" border p-3 rounded-lg"
          id="email"
        />
        <input
          onChange={handelChange}
          type="password"
          placeholder="Password"
          className=" border p-3 rounded-lg"
          autoComplete="off"
          id="password"
        />
        <button
          disabled={loading}
          className=" bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "sign up"}
        </button>
        <Oauth />
      </form>
      <div className=" flex gap-2 mt-5">
        <p>Have an account ?</p>
        <Link to="/sign-in">
          <span className=" text-blue-700 underline">Sign in</span>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;

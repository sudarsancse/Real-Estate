import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function NewPassword() {
  const [updatedPass, setUpdatedPass] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const handelChange = (e) => {
    setUpdatedPass({
      ...updatedPass,
      [e.target.id]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (updatedPass.Newpass !== updatedPass.Confirmpass) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await fetch(`/updated-password/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPass),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === true && data.statusCode === 200) {
        toast.success(data.message);
        // Redirect to password reset page or handle further actions
        navigate(`/sign-in`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("pass word not match");
    }
  };

  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl text-center font-semibold my-7">
        Password update
      </h1>
      <form className=" flex flex-col gap-4" onSubmit={handelSubmit}>
        <input
          onChange={handelChange}
          type="text"
          placeholder="New password"
          className=" border p-3 rounded-lg"
          id="Newpass"
        />
        <div className=" flex flex-col">
          <input
            onChange={handelChange}
            type="password"
            placeholder="Confirm password"
            className=" border p-3 rounded-lg"
            autoComplete="off"
            id="Confirmpass"
          />
        </div>
        <button className=" bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          sign in
        </button>
      </form>
    </div>
  );
}

export default NewPassword;

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (otpSent) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/sendEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false && data.statusCode === 201) {
        toast.success(data.message);
        setOtpSent(true); // OTP sent successfully, switch to OTP input
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error sending email");
    }
    setLoading(false);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      console.log(data);

      if (data.success === true && data.statusCode === 200) {
        toast.success(data.message);
        navigate(`/new-password/${data.ID}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error verifying OTP");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="p-3 max-w-lg mx-auto py-32">
      <h1 className="text-3xl text-red-700 text-center font-semibold my-7">
        Forget password
      </h1>
      {!otpSent ? (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg"
            value={email}
            required
          />
          <button
            type="submit"
            className={`bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 ${
              loading ? "opacity-80 cursor-wait" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleOtpSubmit}>
          <div className=" flex flex-col">
            <input
              onChange={handleOtpChange}
              type="text"
              placeholder="Enter OTP"
              className="border p-3 rounded-lg"
              value={otp}
              required
            />
            <p className=" text-xs font-bold">{`Time left: ${formatTime(
              timer
            )}`}</p>
          </div>
          <button
            type="submit"
            className={`bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 ${
              loading ? "opacity-80 cursor-wait" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ForgetPassword;

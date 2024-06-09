import React, {useEffect, useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {app} from "../../fireBase.js";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../Redux/User/userSlice.js";
import {Link} from "react-router-dom";

function Profile() {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const filerRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({...formData, avatar: downloadURL})
        );
      }
    );
  };

  const handelChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  //delete the user
  const handelDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // signout user function
  const handelSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {}
  };

  return (
    <div className=" p-3 mx-auto max-w-lg">
      <h1 className=" text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className=" flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={filerRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => {
            filerRef.current.click();
          }}
          className=" rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          onChange={handelChange}
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className=" border p-3 rounded-lg"
        />
        <input
          onChange={handelChange}
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className=" border p-3 rounded-lg"
        />
        <input
          onChange={handelChange}
          type="password"
          autoComplete="off"
          placeholder="password"
          className=" border p-3 rounded-lg"
          id="password"
        />
        <button
          disabled={loading}
          className=" bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "update"}
        </button>
        <Link
          to="/create-listing"
          className=" bg-green-700 text-center text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          create listing
        </Link>
      </form>
      <div className=" flex justify-between mt-5">
        <span
          onClick={handelDeleteUser}
          className=" text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handelSignOut} className=" text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className=" text-red-700 mt-5 text-center">{error ? error : ""}</p>
      <p className=" text-green-700 mt-5 text-center">
        {updateSuccess ? "Update Success Fully" : ""}
      </p>
    </div>
  );
}

export default Profile;

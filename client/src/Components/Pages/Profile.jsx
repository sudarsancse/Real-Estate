import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../fireBase.js";
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
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const filerRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListings, setShowListings] = useState(false);

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
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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

  // user listing
  const handleShowListings = async () => {
    try {
      if (!showListings) {
        const res = await fetch(`/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }
        setUserListings(data);
      }
      setShowListings(!showListings);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  // delete listing
  const handleListingDelete = async (listingId) => {
    console.log(listingId);
    try {
      const res = await fetch(`/deletelisting/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
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
          src={currentUser.avatar ? currentUser.avatar : formData.avatar}
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
          defaultValue={currentUser.name}
          id="name"
          className=" border p-3 rounded-lg"
        />
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
      <button className="text-green-700 w-full" onClick={handleShowListings}>
        {showListings ? "Hide Lists" : "Show Lists"}
      </button>
      <p className=" text-red-700 text-sm">
        {showListingsError ? "Error showing the Lists" : ""}
      </p>
      {showListings && userListings && userListings.length > 0 && (
        <div className=" flex flex-col gap4">
          <h1 className=" text-center mt-7 text-2xl font-semibold">
            {" "}
            Your List
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className=" border rounded-lg justify-between items-center p-3 flex gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  className=" h-16 w-16 object-contain "
                  src={listing.imageUrls[0]}
                  alt="list-image"
                />
              </Link>
              <Link
                className=" flex-1 text-slate-700 font-semibold hover:underline truncate"
                to={`/list-page/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className=" flex flex-col gap-1 items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className=" text-red-700 uppercase text-center cursor-pointer"
                >
                  delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className=" cursor-pointer text-green-700 uppercase text-center">
                    edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;

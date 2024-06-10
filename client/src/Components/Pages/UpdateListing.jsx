import React, {useEffect, useState} from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {app} from "../../fireBase.js";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const [imgUploadError, setImgUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const {currentUser} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [fromData, setFromData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    typeOfPlace: "",
    price: 0,
    discountPrice: 0,
    barthRoom: 1,
    kitchenRoom: 1,
    badRoom: 2,
    offer: false,
    furnished: false,
    parking: false,
  });

  useEffect(() => {
    const fetcthListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFromData(data);
    };

    fetcthListing();
  }, []);

  // Image submit
  const handelImageSubmit = (e) => {
    if (files.length > 0 && files.length + fromData.imageUrls.length < 7) {
      setUploading(true);
      setImgUploadError(false);
      const promise = [];
      for (let i = 0; i < files.length; i++) {
        promise.push(storeImage(files[i]));
      }
      Promise.all(promise)
        .then((urls) => {
          setFromData({
            ...fromData,
            imageUrls: fromData.imageUrls.concat(urls),
          });
          setImgUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImgUploadError("Image uploading failed (4 mb per img)");
          setUploading(false);
        });
    } else {
      setImgUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  // Store image
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_change",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Delete image
  const handleRemoveImage = (index) => {
    setFromData({
      ...fromData,
      imageUrls: fromData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // Form input data
  const handelChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFromData({
        ...fromData,
        typeOfPlace: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFromData({
        ...fromData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFromData({
        ...fromData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // Send data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (fromData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+fromData.price < +fromData.discountPrice)
        return setError("Discount price must be lower than the Regular Price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/editlist/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...fromData,
          UserRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/list-page/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Edit a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="50"
            minLength="10"
            required
            onChange={handelChange}
            value={fromData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handelChange}
            value={fromData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handelChange}
            value={fromData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handelChange}
                checked={fromData.typeOfPlace === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handelChange}
                checked={fromData.typeOfPlace === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handelChange}
                checked={fromData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handelChange}
                checked={fromData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handelChange}
                checked={fromData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                required
                id="badRoom"
                className="p-3 border border-gray-300 rounded-lg"
                min="1"
                max="15"
                onChange={handelChange}
                value={fromData.badRoom}
              />
              <p>Bed Room</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                required
                id="barthRoom"
                className="p-3 border border-gray-300 rounded-lg"
                min="1"
                max="15"
                onChange={handelChange}
                value={fromData.barthRoom}
              />
              <p>Bath Room</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                required
                id="kitchenRoom"
                className="p-3 border border-gray-300 rounded-lg"
                min="1"
                max="15"
                onChange={handelChange}
                value={fromData.kitchenRoom}
              />
              <p>Kitchen</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                required
                id="price"
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handelChange}
                value={fromData.price}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {fromData.type === "rent" && (
                  <span className="text-green-700 text-sm">
                    (Rs: {fromData.price} / month)
                  </span>
                )}
              </div>
            </div>
            {fromData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  id="discountPrice"
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handelChange}
                  value={fromData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  {fromData.type === "rent" && (
                    <span className="text-green-700 text-sm">
                      (Rs: {fromData.discountPrice} / month)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="font-semibold">
            Image:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="imageURL"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handelImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-600 text-center">
            {imgUploadError && imgUploadError}
          </p>
          {fromData.imageUrls.length > 0 &&
            fromData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update List"}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}

import React from "react";

export default function Listing() {
  return (
    <main className=" p-3 max-w-4xl mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-7">
        {" "}
        Create a Listing
      </h1>
      <form className=" flex flex-col sm:flex-row gap-4">
        <div className=" flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className=" border p-3 rounded-lg"
            id="name"
            maxLength="50"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className=" border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className=" border p-3 rounded-lg"
            id="address"
            required
          />
          <div className=" flex gap-6 flex-wrap">
            <div className=" flex gap-2">
              <input type="checkbox" id="sale" className=" w-5" />
              <span>Sell</span>
            </div>
            <div className=" flex gap-2">
              <input type="checkbox" id="rest" className=" w-5" />
              <span>Rent</span>
            </div>
            <div className=" flex gap-2">
              <input type="checkbox" id="parking" className=" w-5" />
              <span>Parking</span>
            </div>
            <div className=" flex gap-2">
              <input type="checkbox" id="furnished" className=" w-5" />
              <span>Furnished</span>
            </div>
            <div className=" flex gap-2">
              <input type="checkbox" id="offer" className=" w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className=" flex flex-wrap gap-6">
            <div className=" flex items-center gap-2">
              <input
                type="number"
                required
                id="badRoom"
                className=" p-3 border border-gray-300 rounded-lg"
                min="1"
                max="15"
              />
              <p className="">Bed Room</p>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                required
                id="barthRoom"
                className=" p-3 border border-gray-300 rounded-lg"
                min="1"
                max="15"
              />
              <p className="">Bath Room</p>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                required
                id="kitchenRoom"
                className=" p-3 border border-gray-300 rounded-lg"
                min="1"
                max="15"
              />
              <p className="">Kitchen</p>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                required
                id="price"
                className=" p-3 border border-gray-300 rounded-lg"
              />
              <div className=" flex flex-col items-center">
                <p className="">Regular price</p>
                <span className=" text-sm">(Rs / month) </span>
              </div>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                required
                id="discountPrice"
                className=" p-3 border border-gray-300 rounded-lg"
              />
              <div className=" flex flex-col items-center">
                <p className="">Discounted price</p>
                <span className=" text-sm">(Rs / month) </span>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-1 flex-col gap-2">
          <p className=" font-semibold">
            Image:
            <span className=" font-normal text-gray-600 ml-2">
              The first image will be the cover (max 8)
            </span>
          </p>
          <div className=" flex gap-4">
            ,
            <input
              className=" p-3 border border-gray-300 rounded w-full"
              type="file"
              id="imageURL"
              accept="images/*"
              multiple
            />
            <button className=" p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className=" p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {" "}
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

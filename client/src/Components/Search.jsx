import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ListingItem from "./ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sideBareDate, setSideBareDate] = useState({
    searchText: "",
    typeOfPlace: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTextFromUrl = urlParams.get("searchText");
    const typeFromUrl = urlParams.get("typeOfPlace");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTextFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBareDate({
        searchText: searchTextFromUrl || "",
        typeOfPlace: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/search?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };
    fetchListing();
  }, [window.location.search]);

  const handelChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBareDate({...sideBareDate, typeOfPlace: e.target.id});
    }

    if (e.target.id === "searchText") {
      setSideBareDate({...sideBareDate, searchText: e.target.value});
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBareDate({
        ...sideBareDate,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBareDate({
        ...sideBareDate,
        sort,
        order,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchText", sideBareDate.searchText);
    urlParams.set("typeOfPlace", sideBareDate.typeOfPlace);
    urlParams.set("parking", sideBareDate.parking);
    urlParams.set("furnished", sideBareDate.furnished);
    urlParams.set("offer", sideBareDate.offer);
    urlParams.set("sort", sideBareDate.sort);
    urlParams.set("order", sideBareDate.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/search?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className=" flex flex-col md:flex-row">
      <div className=" p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className=" flex flex-col gap-8">
          <div className=" flex items-center gap-2">
            <label className=" whitespace-nowrap">Search Term:</label>
            <input
              className=" border rounded-lg p-3 w-full"
              type="text"
              id="searchText"
              placeholder="Search..."
              value={sideBareDate.searchText}
              onChange={handelChange}
            />
          </div>
          <div className=" flex gap-2 flex-wrap items-center">
            <label className=" font-semibold">Type:</label>
            <div className=" flex gap-2">
              <input
                checked={sideBareDate.typeOfPlace === "all"}
                onChange={handelChange}
                type="checkbox"
                id="all"
                className=" w-5"
              />
              <span>Rent & Seal</span>
            </div>
            <div className=" flex gap-2">
              <input
                checked={sideBareDate.typeOfPlace === "rent"}
                onChange={handelChange}
                type="checkbox"
                id="rent"
                className=" w-5"
              />
              <span>Rent</span>
            </div>
            <div className=" flex gap-2">
              <input
                checked={sideBareDate.typeOfPlace === "sale"}
                onChange={handelChange}
                type="checkbox"
                id="sale"
                className=" w-5"
              />
              <span>Seal</span>
            </div>
            <div className=" flex gap-2">
              <input
                checked={sideBareDate.offer}
                onChange={handelChange}
                type="checkbox"
                id="offer"
                className=" w-5"
              />
              <span>Offer</span>
            </div>
          </div>

          <div className=" flex gap-2 flex-wrap items-center">
            <label className=" font-semibold">Amenities:</label>
            <div className=" flex gap-2">
              <input
                checked={sideBareDate.parking}
                onChange={handelChange}
                type="checkbox"
                id="parking"
                className=" w-5"
              />
              <span>Parking</span>
            </div>
            <div className=" flex gap-2">
              <input
                checked={sideBareDate.furnished}
                onChange={handelChange}
                type="checkbox"
                id="furnished"
                className=" w-5"
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className=" flex gap-2 items-center">
            <label className=" font-semibold">Sort:</label>
            <select
              onChange={handelChange}
              defaultValue="created_at_desc"
              className=" border rounded-lg p-3"
              id="sort_order"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className=" bg-slate-700 p-3 text-white hover:bg-green-700 hover:opacity-95 rounded-lg uppercase">
            search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            Array.isArray(listings) &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

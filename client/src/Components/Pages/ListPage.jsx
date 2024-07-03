import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import {useSelector} from "react-redux";
import "swiper/css/bundle";
import {FaShare} from "react-icons/fa";
import {TbToolsKitchen3} from "react-icons/tb";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";
import Contact from "./Contact";

export default function ListPage() {
  SwiperCore.use([Navigation]);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const {currentUser} = useSelector((state) => state.user);
  //generateReceiptId
  const generateReceiptId = () => {
    return `receipt_${new Date().getTime()}_${Math.floor(
      Math.random() * 1000
    )}`;
  };

  //paymeny gateway
  const paymentHandel = async (event) => {
    const amount = listing.offer
      ? listing.discountPrice * 100
      : listing.price * 100; // Convert to paise for Razorpay
    const currency = "INR";
    const receiptId = generateReceiptId();

    const res = await fetch(`/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
    });
    const order = await res.json();
    // console.log("order", order);

    var option = {
      key: "",
      amount,
      currency,
      name: "Dram Home",
      description: "Test Transaction",
      image:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Fpng%2F22285976-letter-d-pink-alphabet-glossy&psig=AOvVaw3T5HCfYzA8vKUCjmDKLm66&ust=1720103317961000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKDes6iKi4cDFQAAAAAdAAAAABAE",
      order_id: order.id,
      handler: async function (response) {
        const body = {...response};
        const validateResponse = await fetch(`/validate/${params.listingId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        const jsonResponse = await validateResponse.json();
        if (jsonResponse.msg === "Transaction is legit!") {
          setListing((prevState) => ({...prevState, soldOut: true}));
        }

        console.log("jsonResponse", jsonResponse);
      },
      prefill: {
        name: currentUser.name,
        email: currentUser.email,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new window.Razorpay(option);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });

    rzp1.open();
    event.preventDefault();
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className=" text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className=" text-center text-red-700 my-7 text-2xl">
          Error fatching the data
        </p>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className=" h-[500px] "
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - Rs{" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.price.toLocaleString("en-US")}
              {listing.typeOfPlace === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.typeOfPlace === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  Rs {+listing.price - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.badRoom} beds `
                  : `${listing.badRoom} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.barthRoom} baths `
                  : `${listing.barthRoom} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <TbToolsKitchen3 className="text-lg" />
                {listing.kitchenRoom > 1
                  ? `${listing.kitchenRoom} kitchen Rooms `
                  : `${listing.kitchenRoom} kitchen Room `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && listing.UserRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
            {listing.soldOut ? (
              <p className="bg-red-500 text-white rounded-lg p-3 text-center">
                Sold Out
              </p>
            ) : (
              currentUser &&
              listing.UserRef !== currentUser._id && (
                <button
                  onClick={paymentHandel}
                  className=" bg-green-700 text-white rounded-lg  hover:opacity-95 p-3"
                >
                  {`Pay ${
                    listing.offer
                      ? listing.discountPrice.toLocaleString("en-US")
                      : listing.price.toLocaleString("en-US")
                  }`}
                </button>
              )
            )}
          </div>
        </>
      )}
    </main>
  );
}

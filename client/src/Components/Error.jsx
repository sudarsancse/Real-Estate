import React from "react";
import { Link } from "react-router-dom";
import NPF from "../Components/assets/image/6325254.jpg";

const NotFoundPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 bg-cover bg-center"
      style={{ backgroundImage: `url(${NPF})` }}
    >
      <div className="bg-white bg-opacity-75 p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-bold text-purple-600 mb-4">
          Page Not Found
        </h1>
        <div className="text-center text-gray-500 mb-8">
          <p>
            Oops! It seems you've reached a page that doesn't exist. The page
            you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <p>
            Please check the URL for any mistakes and try again. If you still
            can't find what you're looking for, go back to the homepage or
            contact us for further assistance.
          </p>
        </div>
        <Link
          to="/"
          className="mt-8 px-8 py-3 bg-red-500 text-white text-lg font-bold rounded-full hover:bg-red-600"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

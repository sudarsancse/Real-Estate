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
            Lorem ipsum dolor sit amet, sea putant suscipit invidunt cu. Nonumy
            scripserit id per. Cu quis theophrastus reprehendunt nec.
          </p>
          <p>
            Vero invidunt splendide te vim, cu mea voluptaria. Lorem consequat
            adversarium vel an.
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

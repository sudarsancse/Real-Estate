import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home";
import Signin from "./Components/Pages/Signin";
import SignUp from "./Components/Pages/SignUp";
import Profile from "./Components/Pages/Profile";
import About from "./Components/Pages/About";
import Header from "./Components/Header";
import PrivateRoute from "./Components/PrivateRoute";
import CreateListing from "./Components/Pages/Listing";
import UpdateListing from "./Components/Pages/UpdateListing";
import ListPage from "./Components/Pages/ListPage";
import Search from "./Components/Search";
import Footer from "./Components/Footer";
import ForgetPassword from "./Components/Pages/ForgetPassword";
import NewPassword from "./Components/Pages/NewPassword";
import NotFoundPage from "./Components/Error";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/list-page/:listingId" element={<ListPage />} />
        <Route path="/new-password/:id" element={<NewPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

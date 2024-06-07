import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./Components/Pages/Home";
import Signin from "./Components/Pages/Signin";
import SignUp from "./Components/Pages/SignUp";
import Profile from "./Components/Pages/Profile";
import About from "./Components/Pages/About";
import Header from "./Components/Header";
import PrivateRoute from "./Components/Pages/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<PrivateRoute />}>
          <Route path="/about" element={<About />} />
        </Route>
        <Route
          path="*"
          element={
            <h1 className=" text-center text-red-700 text-xl mt-10">
              {" "}
              404 page note found{" "}
            </h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

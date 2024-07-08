import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { app } from "../../fireBase";
import { signInSuccess } from "../../Redux/User/userSlice";
import { useNavigate } from "react-router-dom";

export default function Oauth() {
  const disPatch = useDispatch();
  const navigate = useNavigate();
  const handelGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      //console.log(result);

      const res = await fetch("/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      disPatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Could not sign in with google", error);
    }
  };

  return (
    <button
      onClick={handelGoogleClick}
      type="button"
      className=" bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      continue with google
    </button>
  );
}

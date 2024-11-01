import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInStart, signInSuccess } from "../redux/user/userSlice.js";
const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const response = await signInWithPopup(auth, provider);
      dispatch(signInStart());
      const res = await axios.post(
        "http://localhost:3000/user/google-login",
        {
          displayName: response.user.displayName,
          email: response.user.email,
          photoUrl: response.user.photoURL,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true
        }
      );
      if (res.status === 200) {
        dispatch(signInSuccess(res.data.user));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        onClick={handleAuth}
        type="button"
        className="text-[14px] bg-red-600 text-white uppercase p-2 rounded-lg"
      >
        Continue with Google
      </button>
    </>
  );
};

export default Auth;

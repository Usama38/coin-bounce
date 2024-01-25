import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

function useAutoLogin() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    //IIFE
    (async function autoLoginApiCall() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_INTERNAL_API_PATH}/refresh`,
          {
            withCredentials: true, //here we set true for sending cookies also with request
          }
        );
        if (response.status === 200) {
          //1. store in global userSlice state
          const user = {
            _id: response.data.user._id,
            username: response.data.user.username,
            email: response.data.user.email,
            auth: response.data.auth,
          };
          dispatch(setUser(user));
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return loading;
}
export default useAutoLogin;

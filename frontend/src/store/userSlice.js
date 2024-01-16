import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  email: "",
  username: "",
  auth: false,
};

export const userSlice = createSlice({
  //user global state
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      //here state: current state and action from user
      const { _id, email, username, auth } = action.payload;
      state._id = _id;
      state.email = email;
      state.username = username;
      state.auth = auth;
    },
    resetUser: (state) => {
      state._id = "";
      state.email = "";
      state.username = "";
      state.auth = false;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;

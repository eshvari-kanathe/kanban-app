import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
const initialState = {
  email: "",
  password: "",
  token: "",
  isAuthenticated: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onRegister: (state, action) => {
      state.email = action.payload.email;
      state.password = action.payload.password;

      // const token =
      //   Math.random().toString(36).substring(4) +
      //   Math.random().toString(36).substring(2);
      // state.token = token;

      // localStorage.setItem("token", token);

      console.log(state.email, "email");
      console.log(state.password, "passsword");
      // console.log(token, "token");

      //   console.log(state.token);
      toast.success("Register successfully")
    },

    onLogin: (state, action) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.isAuthenticated = true;
      const token =
        Math.random().toString(36).substring(4) +
        Math.random().toString(36).substring(2);

      state.token = token;

      localStorage.setItem("token", token);
      toast.success("Login successfully")
    },
    onLogOut:(state,action)=>{
        state.email="",
        state.password="",
        state.token="",
        state.isAuthenticated=false
        localStorage.removeItem("token")

    }
  },
});
export const { onRegister,onLogOut,onLogin } = AuthSlice.actions;
export default AuthSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialRoutes = [
  { path: "/home", component: "Home" },
  { path: "/category", component: "Categories" },
  { path: "/about", component: "About" },
  { path: "/profile", component: "Profile", protected: true },
  { path: "/login", component: "Login", guestOnly: true },
  { path: "/signup", component: "Signup", guestOnly: true },
];

const routesSlice = createSlice({
  name: "routes",
  initialState: initialRoutes,
  reducers: {
    updateRoutes: (state, action) => {
      const { isLoggedIn } = action.payload;
      return initialRoutes.filter((route) => {
        if (route.protected && !isLoggedIn) return false;
        if (route.guestOnly && isLoggedIn) return false;
        return true;
      });
    },
  },
});

export const { updateRoutes } = routesSlice.actions;
export default routesSlice.reducer;

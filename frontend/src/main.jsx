import  React from "react"
import  ReactDOM from "react-dom/client"
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from "./routers/router.jsx";
import { BrowserRouter  as Router } from "react-router-dom";
import {  Provider } from "react-redux";
import store from "./store/index.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
  

  </React.StrictMode>
);

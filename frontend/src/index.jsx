import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import "./styles/bootstrap/css/bootstrap.min.css"
import "./styles/bootstrap-icons/bootstrap-icons.css"
import "./styles/css/main.css"
import Login from './screens/Login';
import Register from './screens/Register';
import Index from './screens/Index';
import {createBrowserRouter,  RouterProvider} from "react-router-dom"
import DetectionHistory from './screens/DetectionHistory';


const root = ReactDOM.createRoot(document.getElementById('root'));
let router = createBrowserRouter([
  {
    path: "/",
    element : <Index/>
  },
  {
   path :"/login",
   element : <Login/> 
  },
  {
    path : "/register",
    element : <Register/>
  },
  {
    path : "/history/:id",
    element : <DetectionHistory/>
  },
  {
    path : "*",
    element  :<div>Not Found</div>
  },
 
])

root.render(
  
    <RouterProvider router  = {router}></RouterProvider>)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

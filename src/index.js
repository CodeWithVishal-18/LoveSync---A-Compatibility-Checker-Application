import React from 'react';
import ReactDOM from 'react-dom/client';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.min.js"
import "bootstrap-icons/font/bootstrap-icons.css";

import "./index.css"

import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';
import Result from './Result.jsx';

let routes=createBrowserRouter([
    {path:"/",element:<App/>,children:[
        {index:true,element:<Home/>},
        {path:"/result",element:<Result/>}
    ]}
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={routes}/>);
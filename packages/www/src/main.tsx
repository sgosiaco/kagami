import "./themes/reset.css";
import "./themes/variables.css";
import "./themes/common.css";

import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);

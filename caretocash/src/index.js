import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import Amplify, { Auth } from "aws-amplify";
import aws_exports from "./aws-exports";

import "@aws-amplify/ui/dist/style.css";
Amplify.configure(aws_exports);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();

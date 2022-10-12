import React from "react";
import * as ReactDOMClient from "react-dom/client";

// import StateApi from "state-api";
import App from "components/App";

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

root.render(<App />);
// root.render(<App store={store} />);

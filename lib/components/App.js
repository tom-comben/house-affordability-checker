import React from "react";
import InputMenu from "./InputMenu";
import Map from "./Map";
import "styles/app.scss";

const App = () => {
  return (
    <>
      <div id="header">
        <h1 id="title">House Affordability Checker</h1>
      </div>
      <div id="main">
        <InputMenu onSubmit={() => "hello"} />
        <Map />
      </div>
    </>
  );
};

export default App;

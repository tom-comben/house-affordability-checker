import React from "react";
import InputMenu from "./InputMenu";
import Map from "./Map";
import "styles/app.scss";

const App = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    console.log("submit");
  };

  return (
    <>
      <div id="header">
        <h1 id="title">House Affordability Checker</h1>
      </div>
      <div id="main">
        <InputMenu onSubmit={handleSubmit} />
        <Map />
      </div>
    </>
  );
};

export default App;

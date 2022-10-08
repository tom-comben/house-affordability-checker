import React, { useState } from "react";
import InputMenu from "./InputMenu";
import Map from "./Map";
import "styles/app.scss";
// import { json } from "express";

import countyMockData from "assets/mockData/county.json";
import districtMockData from "assets/mockData/district.json";

const App = () => {
  const [priceData, setPriceData] = useState({});
  const [maxBudget, setMaxBudget] = useState({});
  const [regionSize, setRegionSize] = useState("counties");
  const handleSubmit = (formData) => {
    const budget = getBudget(formData.income, formData.deposit);
    const priceData =
      formData.regionSize === "counties" ? countyMockData : districtMockData;
    setPriceData(priceData);
    setMaxBudget(budget.max);
    setRegionSize(formData.regionSize);
    console.log(budget);
  };

  // return maximum property price and whether it's capped by income or deposit
  const getBudget = (income, deposit) => {
    // TODO change mortgage settings to allow for advance search options
    const incomeMult = 4.5;
    const maxLtv = 0.9;
    const incomeCap = Math.floor(income * incomeMult + deposit);
    const ltvCap = Math.floor(deposit / (1 - maxLtv));
    if (incomeCap < ltvCap) {
      return { max: incomeCap, cappedBy: "income" };
    } else if (ltvCap < incomeCap) {
      return { max: ltvCap, cappedBy: "deposit" };
    } else {
      return { max: ltvCap, cappedBy: "both" };
    }
  };

  return (
    <>
      <div id="header">
        <h1 id="title">House Affordability Checker</h1>
      </div>
      <div id="main">
        <InputMenu handleSubmit={handleSubmit} />
        <Map
          priceData={priceData}
          maxBudget={maxBudget}
          regionSize={regionSize}
        />
      </div>
    </>
  );
};

export default App;

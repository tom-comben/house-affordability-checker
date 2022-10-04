import React, { useState } from "react";
import "styles/input-menu.scss";

const InputMenu = (props) => {
  const [menuVisible, setMenuVisible] = useState(true);
  const [income, setIncome] = useState("");
  const [deposit, setDeposit] = useState("");
  const [propertyTypes, setPropertyTypes] = useState({
    detached: true,
    "semi-detached": true,
    terraced: true,
    flat: true,
  });
  const [regionSize, setRegionSize] = useState("county");

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleChange = (event) => {
    switch (event.target.name) {
      case "income":
        setIncome(event.target.value);
        break;
      case "deposit":
        setDeposit(event.target.value);
        break;
      case "property-type":
        const propertyTypeValue = {};
        propertyTypeValue[event.target.id] = !propertyTypes[event.target.id];
        setPropertyTypes({ ...propertyTypes, ...propertyTypeValue });
        break;
      case "region-size":
        setRegionSize(event.target.id);
        break;
      default:
        console.log(event.target);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.handleSubmit({ income, deposit, propertyTypes, regionSize });
  };

  const renderForm = () => {
    if (menuVisible) {
      return (
        <div className="input-form-container" id="input-form-container">
          <form id="input-form" onSubmit={handleSubmit}>
            <h2>Search Data</h2>
            <div className="form-field">
              <label className="input-description" htmlFor="incomeInput">
                Income:
              </label>
              <div className="input-wrapper text-input-wrapper">
                <label className="currency-symbol">&#163;</label>
                <input
                  className="currency-text-input"
                  id="incomeInput"
                  onChange={handleChange}
                  value={income}
                  name="income"
                  type="text"
                  pattern="^\d+(,?\d{3})*(\d{3})*$"
                />
              </div>
            </div>
            <div className="form-field">
              <label className="input-description" htmlFor="depositInput">
                Deposit:
              </label>
              <div
                className="input-wrapper text-input-wrapper"
                id="depositInputWrapper"
              >
                <label className="currency-symbol">&#163;</label>
                <input
                  className="currency-text-input"
                  id="depositInput"
                  onChange={handleChange}
                  value={deposit}
                  name="deposit"
                  type="text"
                  pattern="^\d+(,?\d{3})*(\d{3})*$"
                />
              </div>
            </div>
            <div className="form-field">
              <label className="input-description">Property Types:</label>
              <div className="input-wrapper options-wrapper">
                <div className="option">
                  <input
                    type="checkbox"
                    id="detached"
                    name="property-type"
                    checked={propertyTypes["detached"]}
                    onChange={handleChange}
                  />
                  <label htmlFor="detached">Detached</label>
                </div>
                <div className="option">
                  <input
                    type="checkbox"
                    id="semi-detached"
                    name="property-type"
                    checked={propertyTypes["semi-detached"]}
                    onChange={handleChange}
                  />
                  <label htmlFor="semi-detached">Semi-Detached</label>
                </div>
                <div className="option">
                  <input
                    type="checkbox"
                    id="terraced"
                    name="property-type"
                    checked={propertyTypes["terraced"]}
                    onChange={handleChange}
                  />
                  <label htmlFor="terraced">Terraced</label>
                </div>
                <div className="option">
                  <input
                    type="checkbox"
                    id="flat"
                    name="property-type"
                    checked={propertyTypes["flat"]}
                    onChange={handleChange}
                  />
                  <label htmlFor="flat">Flat</label>
                </div>
              </div>
            </div>
            <div className="form-field">
              <label className="input-description">Region Size:</label>
              <div className="input-wrapper options-wrapper">
                <div className="option">
                  <input
                    type="radio"
                    id="county"
                    name="region-size"
                    checked={regionSize === "county"}
                    onChange={handleChange}
                  />
                  <label htmlFor="counties">Counties</label>
                </div>
                <div className="option">
                  <input
                    type="radio"
                    id="district"
                    name="region-size"
                    checked={regionSize === "district"}
                    onChange={handleChange}
                  />
                  <label htmlFor="districts">Districts</label>
                </div>
              </div>
            </div>
            <div className="btn-wrapper">
              <input type="submit" className="btn submit-btn" value="Search" />
            </div>
          </form>
        </div>
      );
    }
  };

  return (
    <div id="input-menu">
      <button className="btn menu-btn" onClick={() => toggleMenu()}>
        <div className="menu-btn-bar"></div>
        <div className="menu-btn-bar"></div>
        <div className="menu-btn-bar"></div>
      </button>
      {renderForm()}
    </div>
  );
};

export default InputMenu;

import React, { useState } from "react";
import "styles/inputMenu.scss";

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
  const [regionSize, setRegionSize] = useState("counties");

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleChange = (event) => {
    switch (event.target.name) {
      case "income":
        setIncome(handleUserInput(event));
        break;
      case "deposit":
        setDeposit(handleUserInput(event));
        break;
      case "propertyTypes":
        const propertyTypesValue = {};
        propertyTypesValue[event.target.id] = !propertyTypes[event.target.id];
        setPropertyTypes({ ...propertyTypes, ...propertyTypesValue });
        break;
      case "regionSize":
        setRegionSize(event.target.id);
        break;
      default:
        console.log(event.target);
    }
  };

  const handleUserInput = (event) => {
    // removes non-numeric chracters and any characters after a decimal
    const valueClean = event.target.value.replace(/\..*|[^\d]/g, "");
    // add commas to numeric string
    const newValue = valueClean.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
    return newValue;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const incomeClean = income.replace(/\..*|[^\d]/g, "");
    const depositClean = deposit.replace(/\..*|[^\d]/g, "");
    props.handleSubmit({
      income: incomeClean,
      deposit: depositClean,
      propertyTypes,
      regionSize,
    });
  };

  const renderForm = () => {
    if (menuVisible) {
      return (
        <div className="input-form-container" id="inputFormContainer">
          <form id="inputForm" onSubmit={handleSubmit}>
            <h2>Search Data</h2>
            <div className="form-field">
              <label className="input-description" htmlFor="incomeInput">
                Income
              </label>
              <div className="input-wrapper text-input-wrapper">
                <div className="currency-symbol" aria-hidden="true">
                  &#163;
                </div>
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
                Deposit
              </label>
              <div
                className="input-wrapper text-input-wrapper"
                id="depositInputWrapper"
              >
                <label className="currency-symbol" aria-hidden="true">
                  &#163;
                </label>
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
              <div id="propertyTypesLabel" className="input-description">
                Property Types
              </div>
              <div
                id="propertyTypes"
                role="group"
                aria-labelledby="propertyTypesLabel"
                className="input-wrapper options-wrapper"
              >
                <div className="option">
                  <input
                    type="checkbox"
                    id="detached"
                    name="propertyTypes"
                    checked={propertyTypes["detached"]}
                    onChange={handleChange}
                  />
                  <label htmlFor="detached">Detached</label>
                </div>
                <div className="option">
                  <input
                    type="checkbox"
                    id="semiDetached"
                    name="propertyTypes"
                    checked={propertyTypes["semi-detached"]}
                    onChange={handleChange}
                  />
                  <label htmlFor="semiDetached">Semi-Detached</label>
                </div>
                <div className="option">
                  <input
                    type="checkbox"
                    id="terraced"
                    name="propertyTypes"
                    checked={propertyTypes["terraced"]}
                    onChange={handleChange}
                  />
                  <label htmlFor="terraced">Terraced</label>
                </div>
                <div className="option">
                  <input
                    type="checkbox"
                    id="flat"
                    name="propertyTypes"
                    checked={propertyTypes["flat"]}
                    onChange={handleChange}
                  />
                  <label htmlFor="flat">Flat</label>
                </div>
              </div>
            </div>
            <div className="form-field">
              <div id="regionSizeLabel" className="input-description">
                Region Size
              </div>
              <div
                id="regionSize"
                role="radiogroup"
                aria-labelledby="regionSizeLabel"
                className="input-wrapper options-wrapper"
              >
                <div className="option">
                  <input
                    type="radio"
                    id="counties"
                    name="regionSize"
                    checked={regionSize === "counties"}
                    onChange={handleChange}
                  />
                  <label htmlFor="counties">Counties</label>
                </div>
                <div className="option">
                  <input
                    type="radio"
                    id="districts"
                    name="regionSize"
                    checked={regionSize === "districts"}
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
    <div id="inputMenu">
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

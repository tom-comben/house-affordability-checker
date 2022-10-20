import React, { useState } from "react";
import "styles/inputMenu.scss";

const InputMenu = (props) => {
  const [menuVisible, setMenuVisible] = useState(true);
  const [income, setIncome] = useState("");
  const [deposit, setDeposit] = useState("");
  const [propertyTypes, setPropertyTypes] = useState({
    detached: true,
    semiDetached: true,
    terraced: true,
    flat: true,
  });
  const [regionSize, setRegionSize] = useState("county");
  const [isValidInput, setIsValidInput] = useState({
    income: "valid",
    deposit: "valid",
    propertyTypes: "valid",
    regionSize: "valid",
  });

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleChange = (event) => {
    switch (event.target.name) {
      case "income":
        const newIncome = handleUserInput(event);
        if (newIncome.length > 0) {
          setIsValidInput({ ...isValidInput, income: "valid" });
        }
        setIncome(newIncome);
        break;
      case "deposit":
        const newDeposit = handleUserInput(event);
        if (newDeposit.length > 0) {
          setIsValidInput({ ...isValidInput, deposit: "valid" });
        }
        setDeposit(newDeposit);
        break;
      case "propertyTypes":
        const propertyTypesValue = {};
        propertyTypesValue[event.target.id] = !propertyTypes[event.target.id];
        const newTypes = { ...propertyTypes, ...propertyTypesValue };
        setIsValidInput({ ...isValidInput, propertyTypes: "valid" });
        setPropertyTypes({ ...propertyTypes, ...propertyTypesValue });

        break;
      case "regionSize":
        setIsValidInput({ ...isValidInput, regionSize: "valid" });
        setRegionSize(event.target.id);
        break;
      default:
        console.log(event.target);
    }
  };

  // TODO: fix issue causing cursor to jump to end of input when comma added or removed
  const handleUserInput = (event) => {
    // removes non-numeric chracters and any characters after a decimal
    const valueClean = event.target.value.replace(/\..*|[^\d]/g, "");
    // adds commas to numeric string
    const newValue = valueClean.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
    return newValue;
  };

  const handleSubmit = (event) => {
    const incomeClean = income.replace(/\..*|[^\d]/g, "");
    const depositClean = deposit.replace(/\..*|[^\d]/g, "");
    const propertyTypesArr = Object.keys(propertyTypes)
      .filter((key) => propertyTypes[key])
      .map((item) => item.substring(0, 1).toUpperCase());
    console.log("propTypesArr:", propertyTypesArr);
    event.preventDefault();
    if (validateForm(propertyTypesArr) === false) {
      return;
    }
    // removes non-numeric characters from the strings
    props.handleSubmit({
      income: parseInt(incomeClean),
      deposit: parseInt(depositClean),
      propertyTypes: propertyTypesArr,
      regionSize,
    });
  };

  const validateForm = (propertyTypesArr) => {
    const invalidInputs = {};
    const incomeClean = income.replace(/\,/g, "");
    const depositClean = deposit.replace(/\,/g, "");
    if (isNaN(incomeClean) || incomeClean.length === 0) {
      invalidInputs.income = "invalid";
    }
    if (isNaN(depositClean) || depositClean.length === 0) {
      invalidInputs.deposit = "invalid";
    }
    if (propertyTypesArr.length === 0) {
      invalidInputs.propertyTypes = "invalid";
    }
    if (Object.keys(invalidInputs).length > 0) {
      setIsValidInput({
        ...isValidInput,
        ...invalidInputs,
      });
      return false;
    }
    return true;
  };

  const renderErrorMessage = (field) => {
    let message = "";
    if (isValidInput[field] === "invalid") {
      console.log("field:", field);
      switch (field) {
        case "income":
          message = "Please enter a valid income";
          break;
        case "deposit":
          message = "Please enter a valid deposit";
          break;
        case "propertyTypes":
          message = "Please select a property type";
          break;
        case "regionSize":
          message = "How can this be invalid?";
          break;
        default:
          message = "Unknown input field";
      }
    }
    return <div className="error-text">{message}</div>;
  };

  const renderForm = () => {
    if (menuVisible) {
      return (
        <div className="input-form-container" id="inputFormContainer">
          <form id="inputForm" aria-label="input menu" onSubmit={handleSubmit}>
            <h2>Search Data</h2>
            <div className="form-field">
              <label className="input-description" htmlFor="incomeInput">
                Income
              </label>
              <div className="input-wrapper text-input-wrapper">
                <div
                  className={isValidInput.income + " text-input"}
                  id="incomeInputWrapper"
                >
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
                  />
                </div>
                {renderErrorMessage("income")}
              </div>
            </div>
            <div className="form-field">
              <label className="input-description" htmlFor="depositInput">
                Deposit
              </label>
              <div className="input-wrapper text-input-wrapper">
                <div
                  className={isValidInput.deposit + " text-input"}
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
                  />
                </div>
                {renderErrorMessage("deposit")}
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
                    checked={propertyTypes.detached}
                    onChange={handleChange}
                  />
                  <label htmlFor="detached">Detached</label>
                </div>
                <div className="option">
                  <input
                    type="checkbox"
                    id="semiDetached"
                    name="propertyTypes"
                    checked={propertyTypes.semiDetached}
                    onChange={handleChange}
                  />
                  <label htmlFor="semiDetached">Semi-Detached</label>
                </div>
                <div className="option">
                  <input
                    type="checkbox"
                    id="terraced"
                    name="propertyTypes"
                    checked={propertyTypes.terraced}
                    onChange={handleChange}
                  />
                  <label htmlFor="terraced">Terraced</label>
                </div>
                <div className="option">
                  <input
                    type="checkbox"
                    id="flat"
                    name="propertyTypes"
                    checked={propertyTypes.flat}
                    onChange={handleChange}
                  />
                  <label htmlFor="flat">Flat</label>
                </div>
                {renderErrorMessage("propertyTypes")}
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
                    id="county"
                    name="regionSize"
                    checked={regionSize === "county"}
                    onChange={handleChange}
                  />
                  <label htmlFor="county">Counties</label>
                </div>
                <div className="option">
                  <input
                    type="radio"
                    id="district"
                    name="regionSize"
                    checked={regionSize === "district"}
                    onChange={handleChange}
                  />
                  <label htmlFor="district">Districts</label>
                </div>
                {renderErrorMessage("regionSize")}
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
      <button
        aria-label="menu"
        className="btn menu-btn"
        onClick={() => toggleMenu()}
      >
        <div className="menu-btn-bar"></div>
        <div className="menu-btn-bar"></div>
        <div className="menu-btn-bar"></div>
      </button>
      {renderForm()}
    </div>
  );
};

export default InputMenu;

import React, { useState } from "react";
import "styles/input-menu.scss";

const InputMenu = (props) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderForm = () => {
    if (menuVisible) {
      return (
        <div className="input-form-container" id="input-form-container">
          <form id="input-form" onSubmit={() => props.onSubmit()}>
            <h2>Search Data</h2>
            <div className="form-field">
              <label className="input-description" htmlFor="incomeInput">
                Income:
              </label>
              <div className="input-wrapper text-input-wrapper">
                <label className="currency-symbol">&#163;</label>
                <input
                  className="currency-text-input"
                  name="income"
                  type="text"
                  pattern="^\d+(,?\d{3})*(\d{3})*$"
                  id="incomeInput"
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
                  name="deposit"
                  type="text"
                  pattern="^\d+(,?\d{3})*(\d{3})*$"
                  id="depositInput"
                />
              </div>
            </div>
            <div className="form-field">
              <label className="input-description">Property Types:</label>
              <div className="input-wrapper options-wrapper">
                <div className="option">
                  <input type="checkbox" id="detached" name="detached" />
                  <label htmlFor="detached">Detached</label>
                </div>
                <div className="option">
                  <input
                    type="checkbox"
                    id="semi-detached"
                    name="semi-detached"
                  />
                  <label htmlFor="semi-detached">Semi-Detached</label>
                </div>
                <div className="option">
                  <input type="checkbox" id="terraced" name="terraced" />
                  <label htmlFor="terraced">Terraced</label>
                </div>
                <div className="option">
                  <input type="checkbox" id="flat" name="flat" />
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
                    id="counties"
                    name="region-size"
                    value="county"
                  />
                  <label htmlFor="counties">Counties</label>
                </div>
                <div className="option">
                  <input
                    type="radio"
                    id="districts"
                    name="region-size"
                    value="district"
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

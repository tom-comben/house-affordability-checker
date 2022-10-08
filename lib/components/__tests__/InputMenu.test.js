/**
 * @jest-environment jsdom
 */

import { render, screen, toBeSelected } from "@testing-library/react";
import InputMenu from "components/InputMenu.js";

test("renders all input fields with correct labels", () => {
  render(<InputMenu />);
  expect(screen.getByLabelText("Income").id).toBe("incomeInput");
  expect(screen.getByLabelText("Deposit").id).toBe("depositInput");
  expect(screen.getByLabelText("Detached").id).toBe("detached");
  expect(screen.getByLabelText("Semi-Detached").id).toBe("semiDetached");
  expect(screen.getByLabelText("Terraced").id).toBe("terraced");
  expect(screen.getByLabelText("Flat").id).toBe("flat");
  expect(screen.getByLabelText("Counties").id).toBe("counties");
  expect(screen.getByLabelText("Districts").id).toBe("districts");
});

test("assigns correct label to input groups", () => {
  render(<InputMenu />);
  expect(screen.getByLabelText("Property Types").id).toBe("propertyTypes");
  expect(screen.getByLabelText("Region Size").id).toBe("regionSize");
  const propertyTypesGroup = screen.getByLabelText("Property Types");
  const regionSizeGroup = screen.getByLabelText("Region Size");
});

test("counties and all property types selected by default", () => {
  render(<InputMenu />);
  expect(screen.getByRole("checkbox", { name: "Detached" })).toBeChecked();
  expect(screen.getByRole("checkbox", { name: "Semi-Detached" })).toBeChecked();
  expect(screen.getByRole("checkbox", { name: "Terraced" })).toBeChecked();
  expect(screen.getByRole("checkbox", { name: "Flat" })).toBeChecked();
  expect(screen.getByRole("radio", { name: "Counties" })).toBeChecked();
  expect(screen.getByRole("radio", { name: "Districts" })).not.toBeChecked();
});

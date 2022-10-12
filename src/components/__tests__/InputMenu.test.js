/**
 * @jest-environment jsdom
 */
import { render, screen, toBeSelected } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

test("text inputs update correctly with validation", async () => {
  render(<InputMenu />);
  const incomeInput = screen.getByRole("textbox", { name: "Income" });
  const depositInput = screen.getByRole("textbox", { name: "Deposit" });
  await userEvent.type(incomeInput, "123456");
  await userEvent.type(depositInput, "1x23,4y,56.78cx,9");
  expect(incomeInput).toHaveValue("123,456");
  expect(depositInput).toHaveValue("123,456,789");
});

test("input form shown by default", async () => {
  render(<InputMenu />);
  screen.debug();
  const inputMenu = screen.getByRole("form", { name: "input menu" });
  expect(inputMenu).toBeVisible();
});

test("menu button hides and shows input form", async () => {
  render(<InputMenu />);
  screen.debug();
  const menuButton = screen.getByRole("button", { name: "menu" });
  await userEvent.click(menuButton);
  expect(
    screen.queryByRole("form", { name: "input menu" })
  ).not.toBeInTheDocument();
  await userEvent.click(menuButton);
  expect(
    screen.queryByRole("form", { name: "input menu" })
  ).toBeInTheDocument();
});

test("search button passes the formData to the InputMenu's handleSubmit prop", async () => {
  const mock = jest.fn();
  const expectedInput = {
    income: "40000",
    deposit: "20000",
    propertyTypes: {
      detached: true,
      semiDetached: true,
      terraced: false,
      flat: true,
    },
    regionSize: "districts",
  };
  render(<InputMenu handleSubmit={mock} />);
  const incomeInput = screen.getByRole("textbox", { name: "Income" });
  const depositInput = screen.getByRole("textbox", { name: "Deposit" });
  await userEvent.type(incomeInput, "40000");
  await userEvent.type(depositInput, "20000");
  await userEvent.click(screen.getByRole("checkbox", { name: "Terraced" }));
  await userEvent.click(screen.getByRole("radio", { name: "Districts" }));
  await userEvent.click(screen.getByRole("button", { name: "Search" }));
  expect(mock).lastCalledWith(expectedInput);
});

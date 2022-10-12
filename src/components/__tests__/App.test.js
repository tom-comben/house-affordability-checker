/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import App from "components/App.js";

test("test test", () => {
  render(<App />);
});

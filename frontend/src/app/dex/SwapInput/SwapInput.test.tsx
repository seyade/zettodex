import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SwapInput from "./SwapInput";

describe("SwapInput", () => {
  const mockOnChange = jest.fn();
  const mockOnClick = jest.fn();

  const props = {
    amountType: "sellAmount",
    value: "10",
    totalAmount: 10,
    cryptoIcon: "/assets/sol.png",
    onChange: mockOnChange,
    onClick: mockOnClick,
    inputTitle: "Sell",
    showTotal: true,
  };

  it("renders properly", () => {
    render(<SwapInput {...props} />);
    const swapInput = screen.getByText(/Sell/i);
    expect(swapInput).toBeInTheDocument();
  });
});

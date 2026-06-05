import { describe, it, expect } from "vitest";
import { cartReducer, initialState } from "@/context/CartContext";
import type { Product } from "@/types";

const mockProduct: Product = {
  id: "prod-1",
  name: "Test Gift",
  price: 1000,
  description: "A lovely test gift",
  category: "luxury",
  images: ["/test.jpg"],
  slug: "test-gift",
};

describe("Cart Logic (Reducer)", () => {
  it("should add a new item to the cart", () => {
    const action = { type: "ADD_ITEM" as const, payload: { product: mockProduct, quantity: 1 } };
    const nextState = cartReducer(initialState, action);
    
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].product.id).toBe("prod-1");
    expect(nextState.items[0].quantity).toBe(1);
  });

  it("should increment quantity when adding an existing item", () => {
    const stateWithItem = {
      ...initialState,
      items: [{ id: "prod-1", product: mockProduct, quantity: 1 }],
    };
    const action = { type: "ADD_ITEM" as const, payload: { product: mockProduct, quantity: 2 } };
    const nextState = cartReducer(stateWithItem, action);
    
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(3);
  });

  it("should remove an item from the cart", () => {
    const stateWithItem = {
      ...initialState,
      items: [{ id: "prod-1", product: mockProduct, quantity: 1 }],
    };
    const action = { type: "REMOVE_ITEM" as const, payload: "prod-1" };
    const nextState = cartReducer(stateWithItem, action);
    
    expect(nextState.items).toHaveLength(0);
  });

  it("should update item quantity", () => {
    const stateWithItem = {
      ...initialState,
      items: [{ id: "prod-1", product: mockProduct, quantity: 1 }],
    };
    const action = { type: "UPDATE_QUANTITY" as const, payload: { productId: "prod-1", quantity: 5 } };
    const nextState = cartReducer(stateWithItem, action);
    
    expect(nextState.items[0].quantity).toBe(5);
  });

  it("should remove item if updated quantity is 0 or less", () => {
    const stateWithItem = {
      ...initialState,
      items: [{ id: "prod-1", product: mockProduct, quantity: 5 }],
    };
    const action = { type: "UPDATE_QUANTITY" as const, payload: { productId: "prod-1", quantity: 0 } };
    const nextState = cartReducer(stateWithItem, action);
    
    expect(nextState.items).toHaveLength(0);
  });

  it("should clear the cart", () => {
    const stateWithItem = {
      ...initialState,
      items: [{ id: "prod-1", product: mockProduct, quantity: 1 }],
    };
    const action = { type: "CLEAR_CART" as const };
    const nextState = cartReducer(stateWithItem, action);
    
    expect(nextState.items).toHaveLength(0);
  });

  it("should apply a coupon code", () => {
    const mockCoupon = {
      id: "coupon-1",
      code: "HAPPY10",
      discountType: "percentage" as const,
      discountValue: 10,
      minOrderAmount: 0,
      active: true,
    };
    const action = { type: "SET_COUPON" as const, payload: mockCoupon };
    const nextState = cartReducer(initialState, action);
    
    expect(nextState.appliedCoupon?.code).toBe("HAPPY10");
  });
});

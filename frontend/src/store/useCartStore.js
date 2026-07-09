import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem("cart") || "[]"),

  addItem: (product, qty = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.id === product.id);
    let updated;
    if (existing) {
      updated = items.map((i) =>
        i.id === product.id ? { ...i, qty: i.qty + qty } : i
      );
    } else {
      updated = [...items, { ...product, qty }];
    }
    localStorage.setItem("cart", JSON.stringify(updated));
    set({ items: updated });
  },

  removeItem: (id) => {
    const updated = get().items.filter((i) => i.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    set({ items: updated });
  },

  updateQty: (id, qty) => {
    const updated = get().items.map((i) => (i.id === id ? { ...i, qty } : i));
    localStorage.setItem("cart", JSON.stringify(updated));
    set({ items: updated });
  },

  clear: () => {
    localStorage.removeItem("cart");
    set({ items: [] });
  },

  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
  count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}));

export default useCartStore;

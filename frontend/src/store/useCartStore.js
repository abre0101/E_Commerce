import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],

  addItem(product, length) {
    const key = `${product.id}-${length}`;
    set((s) => {
      const existing = s.items.find((i) => i.key === key);
      if (existing) {
        return { items: s.items.map((i) => i.key === key ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { items: [...s.items, { key, product, length, qty: 1 }] };
    });
  },

  removeItem(key) {
    set((s) => ({ items: s.items.filter((i) => i.key !== key) }));
  },

  updateQty(key, qty) {
    if (qty < 1) return;
    set((s) => ({ items: s.items.map((i) => i.key === key ? { ...i, qty } : i) }));
  },

  clearCart() { set({ items: [] }); },

  count() { return get().items.reduce((n, i) => n + i.qty, 0); },

  total() { return get().items.reduce((s, i) => s + i.product.price * i.qty, 0); },
}));

export default useCartStore;

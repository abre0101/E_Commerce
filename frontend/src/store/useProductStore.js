import { create } from "zustand";
import { products as seedProducts } from "../data/mockData";

const CUSTOM_KEY    = "yada_custom_products";
const OVERRIDE_KEY  = "yada_product_overrides";
const INVENTORY_KEY = "yada_inventory";

// ── helpers ──────────────────────────────────────────────────────────────────
function loadCustom()    { try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)    || "[]"); } catch { return []; } }
function loadOverrides() { try { return JSON.parse(localStorage.getItem(OVERRIDE_KEY)  || "{}"); } catch { return {}; } }
function loadInventory() { try { return JSON.parse(localStorage.getItem(INVENTORY_KEY) || "{}"); } catch { return {}; } }

function saveCustom(v)    { localStorage.setItem(CUSTOM_KEY,    JSON.stringify(v)); }
function saveOverrides(v) { localStorage.setItem(OVERRIDE_KEY,  JSON.stringify(v)); }
function saveInventory(v) { localStorage.setItem(INVENTORY_KEY, JSON.stringify(v)); }

// Derive a stable SKU from a product id
function toSku(id) {
  return String(id).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

// Default stock level per seed product (keyed by id)
const DEFAULT_STOCK = { "1": 2, "2": 15, "3": 8, "4": 1, "5": 12, "6": 10, "7": 6, "8": 14, "9": 3, "10": 9 };
const REORDER_LEVEL = 5;

// ── store ─────────────────────────────────────────────────────────────────────
const useProductStore = create((set, get) => ({
  custom:    loadCustom(),
  overrides: loadOverrides(),
  inventory: loadInventory(),

  // ── derived: all visible products with overrides applied ──────────────────
  getProducts() {
    const { custom, overrides } = get();
    return [...seedProducts, ...custom]
      .map(p => ({ ...p, ...(overrides[p.id] || {}) }))
      .filter(p => !overrides[p.id]?._deleted);
  },

  // ── inventory: stock count per product id ─────────────────────────────────
  getStock(productId) {
    const inv = get().inventory;
    if (inv[productId] !== undefined) return inv[productId];
    return DEFAULT_STOCK[String(productId)] ?? 10;
  },

  // ── admin actions ─────────────────────────────────────────────────────────
  toggleField(id, field) {
    const products = get().getProducts();
    const p = products.find(x => x.id === id);
    if (!p) return;
    const overrides = { ...get().overrides, [id]: { ...(get().overrides[id] || {}), [field]: !p[field] } };
    saveOverrides(overrides);
    set({ overrides });
  },

  addProduct(data) {
    const newProduct = { ...data, id: `custom_${Date.now()}`, _custom: true };
    const custom = [...get().custom, newProduct];
    const inventory = { ...get().inventory, [newProduct.id]: 0 };
    saveCustom(custom); saveInventory(inventory);
    set({ custom, inventory });
  },

  editProduct(id, data, isCustom) {
    if (isCustom) {
      const custom = get().custom.map(p => p.id === id ? { ...p, ...data } : p);
      saveCustom(custom); set({ custom });
    } else {
      const overrides = { ...get().overrides, [id]: { ...data, id } };
      saveOverrides(overrides); set({ overrides });
    }
  },

  deleteProduct(id, isCustom) {
    if (isCustom) {
      const custom = get().custom.filter(p => p.id !== id);
      saveCustom(custom); set({ custom });
    } else {
      const overrides = { ...get().overrides, [id]: { ...(get().overrides[id] || {}), _deleted: true } };
      saveOverrides(overrides); set({ overrides });
    }
  },

  addStock(productId, qty) {
    const current = get().getStock(productId);
    const inventory = { ...get().inventory, [productId]: current + qty };
    saveInventory(inventory); set({ inventory });

    // If stock goes above 0, ensure inStock = true
    if (current + qty > 0) {
      const overrides = get().overrides;
      const updated = { ...overrides, [productId]: { ...(overrides[productId] || {}), inStock: true } };
      saveOverrides(updated); set({ overrides: updated });
    }
  },

  setStock(productId, qty) {
    const inventory = { ...get().inventory, [productId]: qty };
    saveInventory(inventory); set({ inventory });

    const overrides = get().overrides;
    const updated = { ...overrides, [productId]: { ...(overrides[productId] || {}), inStock: qty > 0 } };
    saveOverrides(updated); set({ overrides: updated });
  },
}));

export default useProductStore;

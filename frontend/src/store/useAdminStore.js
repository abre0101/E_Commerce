import { create } from "zustand";

const SESSION_KEY = "yada_admin_session";
const STAFF_KEY   = "yada_staff_accounts";

// ── Helpers ──────────────────────────────────────────────
function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

function loadStaff() {
  try { return JSON.parse(localStorage.getItem(STAFF_KEY) || "[]"); }
  catch { return []; }
}

function saveStaff(list) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(list));
}

function hashPw(pw) {
  return btoa(unescape(encodeURIComponent(pw + "_yada_staff")));
}

// ── Permissions map ───────────────────────────────────────
export const PERMISSIONS = {
  admin: {
    viewRevenue:       true,
    viewCustomerData:  true,   // email, phone
    manageProducts:    true,   // toggle featured + stock
    deleteProducts:    true,
    manageStaff:       true,   // create/remove staff accounts
    updateOrderStatus: true,
    viewAllStats:      true,
  },
  staff: {
    viewRevenue:       false,
    viewCustomerData:  false,
    manageProducts:    false,  // stock toggle only via separate flag
    deleteProducts:    false,
    manageStaff:       false,
    updateOrderStatus: true,
    viewAllStats:      false,
    toggleStock:       true,   // only in-stock toggle, not featured
  },
};

// ── Store ─────────────────────────────────────────────────
const useAdminStore = create((set, get) => ({
  session: loadSession(), // { username, role: "admin"|"staff", name }

  get isLoggedIn() { return !!get().session; },
  get role()       { return get().session?.role || null; },
  get can()        { return (perm) => !!PERMISSIONS[get().session?.role]?.[perm]; },

  login(username, password) {
    const adminPw = import.meta.env.VITE_ADMIN_PASSWORD;

    // Check admin
    if (username === "yadeshi" && password === adminPw) {
      const session = { username: "yadeshi", role: "admin", name: "Yadeshi" };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      set({ session });
      return true;
    }

    // Check staff
    const staff = loadStaff();
    const member = staff.find(
      (s) => s.username === username && s.passwordHash === hashPw(password)
    );
    if (member) {
      const session = { username: member.username, role: "staff", name: member.name };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      set({ session });
      return true;
    }

    return false;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
    set({ session: null });
  },

  // ── Staff management (admin only) ──
  getStaff: () => loadStaff(),

  addStaff(name, username, password) {
    const list = loadStaff();
    if (list.find((s) => s.username === username)) {
      throw new Error("Username already exists.");
    }
    const updated = [...list, { id: Date.now().toString(), name, username, passwordHash: hashPw(password), createdAt: new Date().toISOString() }];
    saveStaff(updated);
  },

  removeStaff(id) {
    saveStaff(loadStaff().filter((s) => s.id !== id));
  },
}));

export default useAdminStore;

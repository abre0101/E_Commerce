import { create } from "zustand";

const USERS_KEY = "yada_users";
const SESSION_KEY = "yada_session";

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function hashPassword(password) {
  return btoa(unescape(encodeURIComponent(password + "_yada_salt")));
}

function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

const useAuthStore = create((set) => ({
  user: loadSession(),

  register({ firstName, lastName, email, phone, address, password }) {
    const users = loadUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const newUser = {
      id: Date.now().toString(),
      firstName, lastName,
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      phone, address,
      passwordHash: hashPassword(password),
    };
    saveUsers([...users, newUser]);
    const session = { id: newUser.id, name: newUser.name, firstName, lastName, email: newUser.email, phone, address };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    set({ user: session });
  },

  login(email, password) {
    const users = loadUsers();
    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user || user.passwordHash !== hashPassword(password)) {
      throw new Error("Invalid email or password.");
    }
    const session = {
      id: user.id, name: user.name,
      firstName: user.firstName, lastName: user.lastName,
      email: user.email, phone: user.phone, address: user.address,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    set({ user: session });
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
    set({ user: null });
  },
}));

export default useAuthStore;

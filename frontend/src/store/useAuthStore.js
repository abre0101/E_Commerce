import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    set({ user: res.data.user, token: res.data.token, loading: false });
    return res.data.user;
  },

  register: async (data) => {
    set({ loading: true });
    const res = await api.post("/auth/register", data);
    localStorage.setItem("token", res.data.token);
    set({ user: res.data.user, token: res.data.token, loading: false });
    return res.data.user;
  },

  fetchMe: async () => {
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data });
    } catch {
      set({ user: null, token: null });
      localStorage.removeItem("token");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  updateUser: (data) => set((s) => ({ user: { ...s.user, ...data } })),
}));

export default useAuthStore;

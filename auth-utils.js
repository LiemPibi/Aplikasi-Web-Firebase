import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

const redirectTo = (path) => {
  window.location.href = path;
};

const requireGuest = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) redirectTo("daftar-kontak.html");
  });
};

const requireAuth = (onReady) => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      redirectTo("login.html");
      return;
    }

    onReady(user);
  });
};

const bindLogout = (buttonId = "logoutBtn") => {
  const logoutBtn = document.getElementById(buttonId);
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      redirectTo("login.html");
    } catch (error) {
      window.alert(`Logout gagal: ${error.message}`);
    }
  });
};

const setAuthStatus = (email, elementId = "authStatus") => {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = `Login sebagai: ${email}`;
};

export { auth, requireGuest, requireAuth, bindLogout, setAuthStatus };

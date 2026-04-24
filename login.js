import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { auth, requireGuest } from "./auth-utils.js";

requireGuest();

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
    window.location.href = "daftar-kontak.html";
  } catch (error) {
    window.alert(`Login gagal: ${error.message}`);
  }
});

import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { auth, requireGuest } from "./auth-utils.js";

requireGuest();

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    registerForm.reset();
    window.location.href = "daftar-kontak.html";
  } catch (error) {
    window.alert(`Registrasi gagal: ${error.message}`);
  }
});

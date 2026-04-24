import { get, push, ref, set, update } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";
import { bindLogout, requireAuth, setAuthStatus } from "./auth-utils.js";
import { db } from "./firebase-config.js";

const contactForm = document.getElementById("contactForm");
const contactIdInput = document.getElementById("contactId");
const submitBtn = document.getElementById("submitBtn");
const fieldIds = ["name", "email", "phone", "city", "note"];

const setFormValues = (contact = {}) => {
  fieldIds.forEach((fieldId) => {
    document.getElementById(fieldId).value = contact[fieldId] ?? "";
  });
};

const getFormValues = () => ({
  name: document.getElementById("name").value.trim(),
  email: document.getElementById("email").value.trim(),
  phone: document.getElementById("phone").value.trim(),
  city: document.getElementById("city").value.trim(),
  note: document.getElementById("note").value.trim(),
  updatedAt: new Date().toISOString(),
});

const loadContactForEdit = async (uid, contactId) => {
  const snapshot = await get(ref(db, `users/${uid}/contacts/${contactId}`));
  if (!snapshot.exists()) {
    window.alert("Data kontak tidak ditemukan.");
    window.location.href = "daftar-kontak.html";
    return;
  }

  setFormValues(snapshot.val());
  submitBtn.textContent = "Update Data";
  contactIdInput.value = contactId;
};

requireAuth(async (user) => {
  setAuthStatus(user.email);
  bindLogout();

  const params = new URLSearchParams(window.location.search);
  const editId = params.get("id");

  if (editId) {
    await loadContactForEdit(user.uid, editId);
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const values = getFormValues();
    if (!values.name || !values.email || !values.phone || !values.city || !values.note) {
      window.alert("Semua field harus diisi.");
      return;
    }

    const editingId = contactIdInput.value;

    try {
      if (editingId) {
        await update(ref(db, `users/${user.uid}/contacts/${editingId}`), values);
      } else {
        const newContactRef = push(ref(db, `users/${user.uid}/contacts`));
        await set(newContactRef, {
          ...values,
          createdAt: new Date().toISOString(),
        });
      }

      window.location.href = "daftar-kontak.html";
    } catch (error) {
      window.alert(`Gagal menyimpan data: ${error.message}`);
    }
  });
});

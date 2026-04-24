import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import {
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";
import { auth, db } from "./firebase-config.js";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const authStatus = document.getElementById("authStatus");

const contactForm = document.getElementById("contactForm");
const contactIdInput = document.getElementById("contactId");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const contactTableBody = document.getElementById("contactTableBody");

const fieldIds = ["name", "email", "phone", "city", "note"];

let currentUser = null;
let unsubscribeContacts = null;

const toggleContactForm = (enabled) => {
  [...fieldIds, "submitBtn", "cancelEditBtn"].forEach((id) => {
    document.getElementById(id).disabled = !enabled;
  });

  if (!enabled) {
    contactForm.setAttribute("aria-disabled", "true");
    cancelEditBtn.classList.add("d-none");
    submitBtn.textContent = "Simpan Data";
    contactForm.reset();
    contactIdInput.value = "";
  } else {
    contactForm.setAttribute("aria-disabled", "false");
  }
};

const showEmptyRow = (message) => {
  contactTableBody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center text-secondary">${message}</td>
    </tr>
  `;
};

const getFormValues = () => ({
  name: document.getElementById("name").value.trim(),
  email: document.getElementById("email").value.trim(),
  phone: document.getElementById("phone").value.trim(),
  city: document.getElementById("city").value.trim(),
  note: document.getElementById("note").value.trim(),
  updatedAt: new Date().toISOString(),
});

const setFormValues = (contact = {}) => {
  fieldIds.forEach((fieldId) => {
    document.getElementById(fieldId).value = contact[fieldId] ?? "";
  });
};

const resetFormState = () => {
  contactForm.reset();
  contactIdInput.value = "";
  submitBtn.textContent = "Simpan Data";
  cancelEditBtn.classList.add("d-none");
};

const beginEditState = (id, contact) => {
  contactIdInput.value = id;
  setFormValues(contact);
  submitBtn.textContent = "Update Data";
  cancelEditBtn.classList.remove("d-none");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const contactsRefByUid = (uid) => ref(db, `users/${uid}/contacts`);

const createActionButtons = (id, contact) => {
  const wrapper = document.createElement("div");
  wrapper.className = "d-flex gap-2 justify-content-center";

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-sm btn-warning action-btn";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => beginEditState(id, contact));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm btn-danger action-btn";
  deleteBtn.textContent = "Hapus";
  deleteBtn.addEventListener("click", async () => {
    if (!currentUser) return;

    const isConfirmed = window.confirm(`Hapus data ${contact.name}?`);
    if (!isConfirmed) return;

    try {
      await remove(ref(db, `users/${currentUser.uid}/contacts/${id}`));
    } catch (error) {
      window.alert(`Gagal menghapus data: ${error.message}`);
    }
  });

  wrapper.append(editBtn, deleteBtn);
  return wrapper;
};

const startContactsListener = (uid) => {
  const contactsRef = contactsRefByUid(uid);

  unsubscribeContacts = onValue(contactsRef, (snapshot) => {
    const data = snapshot.val();
    contactTableBody.innerHTML = "";

    if (!data) {
      showEmptyRow("Belum ada data.");
      return;
    }

    Object.entries(data).forEach(([id, contact]) => {
      const row = document.createElement("tr");

      [contact.name, contact.email, contact.phone, contact.city, contact.note].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value || "-";
        row.appendChild(cell);
      });

      const actionCell = document.createElement("td");
      actionCell.className = "text-center";
      actionCell.appendChild(createActionButtons(id, contact));
      row.appendChild(actionCell);

      contactTableBody.appendChild(row);
    });
  });
};

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    registerForm.reset();
    window.alert("Registrasi berhasil. Anda sudah login.");
  } catch (error) {
    window.alert(`Registrasi gagal: ${error.message}`);
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
    window.alert("Login berhasil.");
  } catch (error) {
    window.alert(`Login gagal: ${error.message}`);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    window.alert(`Logout gagal: ${error.message}`);
  }
});

onAuthStateChanged(auth, (user) => {
  if (unsubscribeContacts) {
    unsubscribeContacts();
    unsubscribeContacts = null;
  }

  currentUser = user;

  if (currentUser) {
    authStatus.textContent = `Login sebagai: ${currentUser.email}`;
    logoutBtn.disabled = false;
    toggleContactForm(true);
    startContactsListener(currentUser.uid);
  } else {
    authStatus.textContent = "Belum login.";
    logoutBtn.disabled = true;
    toggleContactForm(false);
    showEmptyRow("Silakan login untuk melihat data.");
  }
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser) {
    window.alert("Silakan login terlebih dahulu.");
    return;
  }

  const values = getFormValues();
  const editingId = contactIdInput.value;

  if (!values.name || !values.email || !values.phone || !values.city || !values.note) {
    window.alert("Semua field harus diisi.");
    return;
  }

  try {
    const contactsRef = contactsRefByUid(currentUser.uid);

    if (editingId) {
      await update(ref(db, `users/${currentUser.uid}/contacts/${editingId}`), values);
    } else {
      const newContactRef = push(contactsRef);
      await set(newContactRef, {
        ...values,
        createdAt: new Date().toISOString(),
      });
    }

    resetFormState();
  } catch (error) {
    window.alert(`Gagal menyimpan data: ${error.message}`);
  }
});

cancelEditBtn.addEventListener("click", resetFormState);

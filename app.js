import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// Ganti dengan konfigurasi Firebase project milik Anda.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const contactsRef = ref(db, "contacts");

const contactForm = document.getElementById("contactForm");
const contactIdInput = document.getElementById("contactId");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const contactTableBody = document.getElementById("contactTableBody");

const fieldIds = ["name", "email", "phone", "city", "note"];

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
    const isConfirmed = window.confirm(`Hapus data ${contact.name}?`);
    if (!isConfirmed) return;

    try {
      await remove(ref(db, `contacts/${id}`));
    } catch (error) {
      window.alert(`Gagal menghapus data: ${error.message}`);
    }
  });

  wrapper.append(editBtn, deleteBtn);
  return wrapper;
};

onValue(contactsRef, (snapshot) => {
  const data = snapshot.val();
  contactTableBody.innerHTML = "";

  if (!data) {
    contactTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-secondary">Belum ada data.</td>
      </tr>
    `;
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

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const values = getFormValues();
  const editingId = contactIdInput.value;

  if (!values.name || !values.email || !values.phone || !values.city || !values.note) {
    window.alert("Semua field harus diisi.");
    return;
  }

  try {
    if (editingId) {
      await update(ref(db, `contacts/${editingId}`), values);
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

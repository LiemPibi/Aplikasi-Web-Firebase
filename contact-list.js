import { onValue, ref, remove } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";
import { bindLogout, requireAuth, setAuthStatus } from "./auth-utils.js";
import { db } from "./firebase-config.js";

const contactTableBody = document.getElementById("contactTableBody");

const showEmptyRow = (message) => {
  contactTableBody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center text-secondary">${message}</td>
    </tr>
  `;
};

const createActionButtons = (uid, id, contact) => {
  const wrapper = document.createElement("div");
  wrapper.className = "d-flex gap-2 justify-content-center";

  const editBtn = document.createElement("a");
  editBtn.className = "btn btn-sm btn-warning action-btn";
  editBtn.textContent = "Edit";
  editBtn.href = `form-kontak.html?id=${id}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm btn-danger action-btn";
  deleteBtn.textContent = "Hapus";
  deleteBtn.addEventListener("click", async () => {
    const isConfirmed = window.confirm(`Hapus data ${contact.name}?`);
    if (!isConfirmed) return;

    try {
      await remove(ref(db, `users/${uid}/contacts/${id}`));
    } catch (error) {
      window.alert(`Gagal menghapus data: ${error.message}`);
    }
  });

  wrapper.append(editBtn, deleteBtn);
  return wrapper;
};

requireAuth((user) => {
  setAuthStatus(user.email);
  bindLogout();

  onValue(ref(db, `users/${user.uid}/contacts`), (snapshot) => {
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
      actionCell.appendChild(createActionButtons(user.uid, id, contact));
      row.appendChild(actionCell);

      contactTableBody.appendChild(row);
    });
  });
});

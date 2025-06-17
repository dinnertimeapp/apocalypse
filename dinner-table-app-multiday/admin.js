import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 🔧 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCWNEUrrWYTdAZIL7e0bW75y5c-k8jxDlo",
  authDomain: "dinner-table-app.firebaseapp.com",
  projectId: "dinner-table-app",
  storageBucket: "dinner-table-app.appspot.com",
  messagingSenderId: "758580572102",
  appId: "1:758580572102:web:51eb2626540c2c29b2ccc7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔐 Admin password check
window.checkPassword = function () {
  const input = document.getElementById("admin-password").value;
  if (input === "apocalypse") {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("admin-content").style.display = "block";
    loadAdminMenu();
  } else {
    alert("Incorrect password");
  }
};

// ✏️ Load and render admin menu (description + guest list)
async function loadAdminMenu() {
  const ref = doc(db, "weeklymenu", "current");
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const descriptionInput = document.getElementById("description-input");
  const adminDiv = document.getElementById("admin-guest-list");

  if (!descriptionInput || !adminDiv) return;

  descriptionInput.value = data.description || "";
  adminDiv.innerHTML = "";

  const dinners = data.dinners || {};
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
for (const day of daysOfWeek) {
  const info = dinners[day];
  if (!info) continue;
    const guests = info.guests || [];

  const guestHTML = guests.map(guest => {
  const encodedName = encodeURIComponent(guest.name);
  return `
    <li>${guest.name} <button onclick="removeGuest('${day}', '${encodedName}')">❌</button></li>
  `;
}).join("");


    const block = document.createElement("div");
    block.className = "day-block";
    block.innerHTML = `
      <h2>${day}</h2>
      <p><strong>Dish:</strong> ${info.dish || "No dinner"}</p>
      <p><strong>Guests (${guests.length}/${info.cap || 0}):</strong></p>
      <ul>${guestHTML}</ul>
      <input type="text" id="new-${day}" placeholder="Add guest name" />
      <button onclick="addGuest('${day}')">+ Add Guest</button>
    `;

    adminDiv.appendChild(block);
  }
}

// ➕ Add guest
window.addGuest = async function (day) {
  const input = document.getElementById(`new-${day}`);
  const name = input.value.trim();
  if (!name) return;

  const ref = doc(db, "weeklymenu", "current");
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const currentGuests = data.dinners[day]?.guests || [];

  if (currentGuests.includes(name)) {
    alert("Guest already signed up.");
    return;
  }

  await updateDoc(ref, {
    [`dinners.${day}.guests`]: arrayUnion(name)
  });

  loadAdminMenu();
};

// ❌ Remove guest
window.removeGuest = async function(day, encodedName) {
  const name = decodeURIComponent(encodedName);

  const ref = doc(db, "weeklymenu", "current");
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const guests = data.dinners[day]?.guests || [];

  const guestToRemove = guests.find(g => g.name === name);
  if (!guestToRemove) {
    alert("Guest not found.");
    return;
  }

  await updateDoc(ref, {
    [`dinners.${day}.guests`]: arrayRemove(guestToRemove)
  });

  await loadAdminMenu();
};




// 💾 Save weekly description
window.saveDescription = async function () {
  const ref = doc(db, "weeklymenu", "current");
  const descriptionInput = document.getElementById("description-input");
  await updateDoc(ref, {
    description: descriptionInput.value.trim()
  });
  alert("Description updated!");
};

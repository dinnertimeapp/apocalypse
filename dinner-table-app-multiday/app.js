console.log("🧠 I AM THE REAL APP.JS — version 2");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore, doc, getDoc, updateDoc, arrayUnion
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

// Elements
const descriptionDiv = document.getElementById("menu-description");

const weeklyMenuDiv = document.getElementById("weekly-menu");

async function loadMenu() {
  const ref = doc(db, "weeklymenu", "current");
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const dinners = data.dinners || {};

  // Update description
  const descriptionDiv = document.getElementById("menu-description");
  descriptionDiv.textContent = data.description || "";

  // Clear the menu before rendering to avoid duplicates
  const weeklyMenuDiv = document.getElementById("weekly-menu");
  weeklyMenuDiv.innerHTML = "";

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
for (const day of weekdays) {
  const info = dinners[day];
  if (!info) continue;

  const guestCount = info.guests?.length || 0;
  const isFull = guestCount >= info.cap;

  let signupHTML = `<p><em>Not accepting guests</em></p>`;
  if (info.acceptingGuests) {
    signupHTML = isFull
      ? `<p><em>All tables booked</em></p>`
      : `
        <input type="text" id="name-${day}" placeholder="Your name" />
        <input type="email" id="email-${day}" placeholder="Your email" />
        <button onclick="signUp('${day}')">Sign Up</button>
      `;
  }

  const dayDiv = document.createElement("div");
  dayDiv.className = "day-block";
  dayDiv.innerHTML = `
    <h2>${day}</h2>
    <p><strong>Dish:</strong> ${info.dish || "No dinner"}</p>
    ${signupHTML}
  `;
  weeklyMenuDiv.appendChild(dayDiv);
}


    // Build the sign-up section
    let signupHTML = `<p><em>Not accepting guests</em></p>`;
    if (info.acceptingGuests) {
      signupHTML = isFull
        ? `<p><em>All tables booked</em></p>`
        : `
          <input type="text" id="name-${day}" placeholder="Your name" />
          <input type="email" id="email-${day}" placeholder="Your email" />
          <button onclick="signUp('${day}')">Sign Up</button>
        `;
    }

    // Create the day block
    const block = document.createElement("div");
    block.className = "day-block";
    block.innerHTML = `
      <h2>${day}</h2>
      <p><strong>Dish:</strong> ${info.dish || "No dinner"}</p>
      ${signupHTML}
    `;

    weeklyMenuDiv.appendChild(block);
  }


window.signUp = async function(day) {
  const name = document.getElementById(`name-${day}`)?.value.trim();
  const email = document.getElementById(`email-${day}`)?.value.trim();

  if (!name || !email) {
    alert("Please enter both your name and email.");
    return;
  }

  const ref = doc(db, "weeklymenu", "current");
  const snap = await getDoc(ref);
  const data = snap.data();
  const guests = data.dinners[day]?.guests || [];

  if (guests.includes(name)) {
    alert("You’ve already signed up!");
    return;
  }

 await updateDoc(ref, {
  [`dinners.${day}.guests`]: arrayUnion({ name, email })
});


  // ✅ Send confirmation email
  const menu = data.dinners[day]?.menu || "TBD";
  const templateParams = {
    guest_name: name,
    guest_email: email,
    dinner_date: day,
    menu: menu
  };

  emailjs.send("service_m28mod8", "template_h8i40tg", templateParams)
    .then(() => {
      console.log("✅ Email sent!");
      alert("You’ve signed up! A confirmation email has been sent.");
    })
    .catch((error) => {
      console.error("❌ Email failed to send:", error);
      alert("Signup saved, but email failed.");
    });

  loadMenu();
};


document.addEventListener("DOMContentLoaded", () => {
  loadMenu(); // ✅ Call loadMenu once DOM is ready

  document.querySelectorAll('.bottom-nav button').forEach(button => {
    button.addEventListener('click', () => {
      // Remove active state
      document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

      // Activate selected
      button.classList.add('active');
      const tabId = "tab-" + button.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });
});
window.signUp = async function(day) {
  const nameInput = document.getElementById(`name-${day}`);
  const emailInput = document.getElementById(`email-${day}`);
  const name = nameInput?.value.trim();
  const email = emailInput?.value.trim();

  if (!name || !email) {
    alert("Please enter both your name and email.");
    return;
  }

  const ref = doc(db, "weeklymenu", "current");
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const guests = data.dinners[day]?.guests || [];

  const alreadySignedUp = guests.some(g => g.name === name || g.email === email);
  if (alreadySignedUp) {
    alert("You're already signed up.");
    return;
  }

  await updateDoc(ref, {
    [`dinners.${day}.guests`]: arrayUnion({ name, email })
  });

  emailjs.send("service_m28mod8", "template_h8i40tg", {
  guest_name: name,
  dinner_date: day,
  menu: data.dinners[day]?.dish || "(no menu listed)"
})
.then(() => {
  alert("Signed up and confirmation email sent!");
})
.catch((error) => {
  console.error("❌ Email failed to send:", error);
  alert("Signed up, but email failed to send.");
});


};
document.addEventListener("DOMContentLoaded", () => {
  // Only run if password protection passes
  if (typeof checkPassword === "function") {
    // handled by login
  } else {
    loadAdminMenu();
  }
});

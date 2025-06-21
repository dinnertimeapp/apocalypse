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

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// This runs when the main page is loaded
window.onload = function() {
  const menuSection = document.getElementById("menu");

  // Fetch menu data from Firestore
  db.collection("weekly_menu").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const day = doc.id;
      const dish = doc.data().dish;
      const acceptingGuests = doc.data().accepting_guests;

      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");

      const dayHeader = document.createElement("h2");
      dayHeader.textContent = day.charAt(0).toUpperCase() + day.slice(1);  // Capitalize the first letter of the day
      dayDiv.appendChild(dayHeader);

      const dishParagraph = document.createElement("p");
      dishParagraph.textContent = dish ? `Dish: ${dish}` : "No dinner today";
      dayDiv.appendChild(dishParagraph);

      if (acceptingGuests) {
        const form = document.createElement("form");

        const nameLabel = document.createElement("label");
        nameLabel.setAttribute("for", `${day}-name`);
        nameLabel.textContent = "Your Name:";
        form.appendChild(nameLabel);

        const nameInput = document.createElement("input");
        nameInput.setAttribute("type", "text");
        nameInput.setAttribute("id", `${day}-name`);
        nameInput.setAttribute("placeholder", "Enter your name");
        form.appendChild(nameInput);

        const emailLabel = document.createElement("label");
        emailLabel.setAttribute("for", `${day}-email`);
        emailLabel.textContent = "Your Email:";
        form.appendChild(emailLabel);

        const emailInput = document.createElement("input");
        emailInput.setAttribute("type", "email");
        emailInput.setAttribute("id", `${day}-email`);
        emailInput.setAttribute("placeholder", "Enter your email");
        form.appendChild(emailInput);

        const submitButton = document.createElement("button");
        submitButton.setAttribute("type", "submit");
        submitButton.textContent = "Sign Up";
        form.appendChild(submitButton);

        dayDiv.appendChild(form);
      } else {
        const noGuestsParagraph = document.createElement("p");
        noGuestsParagraph.textContent = "Not accepting guests";
        dayDiv.appendChild(noGuestsParagraph);
      }

      menuSection.appendChild(dayDiv);
    });
  }).catch((error) => {
    console.error("Error fetching data: ", error);
  });
  const db = firebase.firestore();
const menuDiv = document.getElementById("menu");

async function loadMenu() {
  const ref = db.collection("weeklymenu").doc("current");
  const snap = await ref.get();
  if (!snap.exists) return;

  const data = snap.data();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  menuDiv.innerHTML = "";

  for (const day of days) {
    const item = data.dinners[day];
    const dish = item?.dish || "No dinner";

    const dayBlock = document.createElement("div");
    dayBlock.className = "day-block";
    dayBlock.innerHTML = `
      <h3>${day}</h3>
      <p>${dish}</p>
    `;
    menuDiv.appendChild(dayBlock);
  }
}

document.addEventListener("DOMContentLoaded", loadMenu);

};
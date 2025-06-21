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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

const form = document.getElementById('menuForm'); // Get the admin form

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const day = document.getElementById('day').value;  // Get the selected day
  const dish = document.getElementById('dish').value;  // Get the dish
  const acceptingGuests = document.getElementById('acceptingGuests').checked;  // Check if accepting guests

  // Save the data to Firestore
  db.collection("weekly_menu").doc(day).set({
    dish: dish,
    accepting_guests: acceptingGuests
  })
  .then(() => {
    alert("Menu updated successfully!");
  })
  .catch((error) => {
    console.error("Error updating document: ", error);
  });
  window.saveDish = async function(day) {
  const dishInput = document.getElementById(`dish-${day}`);
  const newDish = dishInput.value.trim();
  if (!newDish) return;

  const ref = doc(db, "weeklymenu", "current");
  try {
    await updateDoc(ref, {
      [`dinners.${day}.dish`]: newDish
    });
    console.log(`✅ Dish updated for ${day}: ${newDish}`);
    alert(`Dish updated for ${day}`);
  } catch (error) {
    console.error("❌ Error updating dish:", error);
    alert("Failed to update dish. Check console.");
  }
};

});
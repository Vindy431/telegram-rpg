// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB2IqL_eMminDAcj83IeK34IIa43dVbEI8",
  authDomain: "telegramrpg-ebc0a.firebaseapp.com",
  projectId: "telegramrpg-ebc0a",
  storageBucket: "telegramrpg-ebc0a.appspot.com",
  messagingSenderId: "580292998215",
  appId: "1:580292998215:web:34303854a83a889c45ed62",
  measurementId: "G-TR5PSFSQ43"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userId = "user_1234"; // Hardcoded user for now
const userRef = doc(db, "users", userId);

const coinsEl = document.getElementById("coins");
const storyEl = document.getElementById("story");

let userData = null;

async function initGame() {
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    userData = {
      coins: 50,
      currentNode: "start",
      lastLogin: new Date().toISOString()
    };
    await setDoc(userRef, userData);
  } else {
    userData = docSnap.data();
    const today = new Date().toISOString().split("T")[0];
    const lastLogin = userData.lastLogin?.split("T")[0];

    if (lastLogin !== today) {
      userData.coins += 50; // Daily bonus
      userData.lastLogin = new Date().toISOString();
      await updateDoc(userRef, {
        coins: userData.coins,
        lastLogin: userData.lastLogin
      });
    }
  }

  updateUI();
}

function updateUI() {
  coinsEl.innerText = `Coins: ${userData.coins}`;
  storyEl.innerText = `You are at the ${userData.currentNode} node. What will you do?`;
}

async function chooseOption(direction) {
  const cost = 10;
  if (userData.coins < cost) {
    alert("Not enough coins!");
    return;
  }

  userData.coins -= cost;
  userData.currentNode = direction === "left" ? "forest" : "castle";

  await updateDoc(userRef, {
    coins: userData.coins,
    currentNode: userData.currentNode
  });

  updateUI();
}

initGame();

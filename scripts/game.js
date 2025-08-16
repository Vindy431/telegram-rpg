import { db } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const userId = new URLSearchParams(window.location.search).get("id") || "guest_" + Math.floor(Math.random() * 1000000);
const userRef = doc(db, "users", userId);

const coinsEl = document.getElementById("coins");
const storyEl = document.getElementById("story");
const choicesEl = document.getElementById("choices");

const nodes = {
  start: {
    text: "You stand at a crossroads.",
    choices: [
      { text: "Enter the forest", next: "forest" },
      { text: "Go to the castle", next: "castle" }
    ]
  },
  forest: {
    text: "The forest is dark and full of whispers.",
    choices: [
      { text: "Follow the light", next: "fairy" },
      { text: "Climb a tree", next: "lookout" }
    ]
  },
  castle: {
    text: "You reach the castle gates guarded by a knight.",
    choices: [
      { text: "Talk to the knight", next: "knight" },
      { text: "Sneak inside", next: "dungeon" }
    ]
  },
  fairy: {
    text: "A fairy grants you 20 bonus coins!",
    reward: 20,
    choices: [{ text: "Return to start", next: "start" }]
  },
  lookout: {
    text: "From the tree, you see a village far away.",
    choices: [
      { text: "Head to the village", next: "village" },
      { text: "Jump down and return", next: "start" }
    ]
  },
  knight: {
    text: "The knight challenges you to a riddle. You win! +10 coins.",
    reward: 10,
    choices: [
      { text: "Enter the castle", next: "throne" },
      { text: "Leave quietly", next: "start" }
    ]
  },
  dungeon: {
    text: "You've been caught and lost 10 coins!",
    penalty: 10,
    choices: [{ text: "Return to start", next: "start" }]
  },
  throne: {
    text: "You sit on the throne and feel power surge through you.",
    choices: [{ text: "End Game", next: "start" }]
  },
  village: {
    text: "Villagers greet you warmly and give you food. +5 coins.",
    reward: 5,
    choices: [{ text: "Go back", next: "start" }]
  }
};

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
      userData.coins += 50;
      userData.lastLogin = new Date().toISOString();
      await updateDoc(userRef, {
        coins: userData.coins,
        lastLogin: userData.lastLogin
      });
    }
  }

  renderNode(userData.currentNode);
}

function renderNode(nodeId) {
  const node = nodes[nodeId];
  if (!node) return;

  if (node.reward) userData.coins += node.reward;
  if (node.penalty) userData.coins = Math.max(0, userData.coins - node.penalty);

  userData.currentNode = nodeId;
  updateDoc(userRef, {
    coins: userData.coins,
    currentNode: userData.currentNode
  });

  coinsEl.innerText = `Coins: ${userData.coins}`;
  storyEl.innerText = node.text;

  choicesEl.innerHTML = "";
  node.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice.text;
    btn.onclick = () => renderNode(choice.next);
    choicesEl.appendChild(btn);
  });
}

window.addEventListener("DOMContentLoaded", initGame);

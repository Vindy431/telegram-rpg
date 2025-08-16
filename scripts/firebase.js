import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2IqL_eMminDAcj83IeK34IIa43dVbEI8",
  authDomain: "telegramrpg-ebc0a.firebaseapp.com",
  projectId: "telegramrpg-ebc0a",
  storageBucket: "telegramrpg-ebc0a.appspot.com",
  messagingSenderId: "580292998215",
  appId: "1:580292998215:web:34303854a83a889c45ed62",
  measurementId: "G-TR5PSFSQ43"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

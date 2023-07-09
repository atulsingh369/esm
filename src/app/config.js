import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCxQHTNANO6GIWL4NHTAj23GOJ-TqnA6iM",
	authDomain: "esmcommunity-d37a5.firebaseapp.com",
	projectId: "esmcommunity-d37a5",
	storageBucket: "esmcommunity-d37a5.appspot.com",
	messagingSenderId: "111163830203",
	appId: "1:111163830203:web:669d8322746de5b5011e9e",
	measurementId: "G-NB0QB81NQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
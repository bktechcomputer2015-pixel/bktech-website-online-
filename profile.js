import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ===========================
   Load Student Profile
=========================== */

onAuthStateChanged(auth, async (user) => {

if (!user) {
window.location.href = "login.html";
return;
}

try {

const docRef = doc(db, "students", user.uid);
const docSnap = await getDoc(docRef);

document.getElementById("studentName").textContent =
docSnap.exists() ? docSnap.data().name : "Student";

document.getElementById("studentEmail").textContent =
user.email;

document.getElementById("profileName").textContent =
docSnap.exists() ? docSnap.data().name : "-";

document.getElementById("profileEmail").textContent =
user.email;

document.getElementById("profileMobile").textContent =
docSnap.exists() ? docSnap.data().mobile : "-";

document.getElementById("profileCourse").textContent =
docSnap.exists() && docSnap.data().course
? docSnap.data().course
: "Not Selected";

document.getElementById("profileDate").textContent =
docSnap.exists() && docSnap.data().createdAt
? docSnap.data().createdAt.toDate().toLocaleDateString()
: "-";

} catch (error) {

console.error(error);

}

});
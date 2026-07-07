// =====================================
// BKTech Student Dashboard
// student.js - Part 1
// =====================================

import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
collection,
query,
where,
getDocs,
getDoc,
doc,
limit
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =====================================
// Authentication
// =====================================

let currentStudent = null;

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";
return;

}

currentStudent = user;

document.getElementById("studentEmail").textContent = user.email;

await loadStudentProfile(user.email);

await loadLiveClass();

await loadNotices();

await loadPDFs();

await loadGallery();

hideLoader();

});


// =====================================
// Logout
// =====================================

window.studentLogout = async()=>{

await signOut(auth);

window.location.href="login.html";

};


// =====================================
// Student Profile
// =====================================

async function loadStudentProfile(email){

try{

const q = query(
collection(db,"students"),
where("email","==",email),
limit(1)
);

const snapshot = await getDocs(q);

if(snapshot.empty){

alert("Student Record Not Found");

return;

}

const student = snapshot.docs[0];

const data = student.data();

document.getElementById("studentName").textContent = data.name || "-";

document.getElementById("profileName").textContent = data.name || "-";

document.getElementById("summaryName").textContent = data.name || "-";

document.getElementById("studentMobile").textContent = data.mobile || "-";

document.getElementById("summaryMobile").textContent = data.mobile || "-";

document.getElementById("profileEmail").textContent = data.email || "-";

document.getElementById("summaryEmail").textContent = data.email || "-";

document.getElementById("studentId").textContent = student.id;

document.getElementById("dashboardStudentId").textContent = student.id;

document.getElementById("profileCourse").textContent = data.course || "-";

document.getElementById("dashboardCourse").textContent = data.course || "-";

document.getElementById("summaryCourse").textContent = data.course || "-";

}catch(err){

console.log(err);

}

}
// =====================================
// Live Class
// =====================================

async function loadLiveClass(){

try{

const snap = await getDoc(doc(db,"settings","liveClass"));

if(!snap.exists()) return;

const data = snap.data();

const btn = document.getElementById("liveClassBtn");

btn.href = data.url || "#";

}catch(err){

console.log(err);

}

}


// =====================================
// Load Notices
// =====================================

async function loadNotices(){

const box = document.getElementById("noticeContainer");

if(!box) return;

box.innerHTML = "";

try{

const snapshot = await getDocs(collection(db,"notices"));

if(snapshot.empty){

box.innerHTML = "<p>No Notice Available</p>";

return;

}

snapshot.forEach((docSnap)=>{

const n = docSnap.data();

box.innerHTML += `

<div class="notice-card">

<h3>${n.title || "-"}</h3>

<p>${n.message || "-"}</p>

</div>

`;

});

}catch(err){

console.log(err);

}

}


// =====================================
// Load PDFs
// =====================================

async function loadPDFs(){

const box = document.getElementById("pdfContainer");

if(!box) return;

box.innerHTML = "";

try{

const snapshot = await getDocs(collection(db,"pdfs"));

if(snapshot.empty){

box.innerHTML = "<p>No PDF Available</p>";

return;

}

snapshot.forEach((docSnap)=>{

const pdf = docSnap.data();

box.innerHTML += `

<div class="pdf-card">

<i class="fas fa-file-pdf"></i>

<h3>${pdf.name}</h3>

<a href="${pdf.url}" target="_blank">

Download PDF

</a>

</div>

`;

});

}catch(err){

console.log(err);

}

}
// =====================================
// Load Gallery
// =====================================

async function loadGallery(){

const box = document.getElementById("galleryContainer");

if(!box) return;

box.innerHTML = "";

try{

const snapshot = await getDocs(collection(db,"gallery"));

if(snapshot.empty){

box.innerHTML = "<p>No Images Available</p>";

return;

}

snapshot.forEach((docSnap)=>{

const g = docSnap.data();

box.innerHTML += `

<div class="gallery-card">

<img src="${g.image}" alt="Gallery Image">

</div>

`;

});

}catch(err){

console.log(err);

}

}


// =====================================
// Student Status
// =====================================

function updateStudentStatus(){

document.getElementById("studentStatus").textContent="Approved";

document.getElementById("dashboardStatus").textContent="Approved";

}


// =====================================
// Admission Date
// =====================================

function updateAdmissionDate(){

const today = new Date();

const date = today.toLocaleDateString("en-IN");

document.getElementById("admissionDate").textContent = date;

}


// =====================================
// Hide Loader
// =====================================

function hideLoader(){

const loader=document.getElementById("loading");

if(loader){

setTimeout(()=>{

loader.style.display="none";

},800);

}

}


// =====================================
// Initialize Dashboard
// =====================================

updateStudentStatus();

updateAdmissionDate();
// =====================================
// Auto Refresh Dashboard
// =====================================

async function refreshDashboard(){

try{

await loadLiveClass();

await loadNotices();

await loadPDFs();

await loadGallery();

}catch(err){

console.log(err);

}

}

// Refresh Every 60 Seconds
setInterval(refreshDashboard,60000);


// =====================================
// Network Status
// =====================================

window.addEventListener("offline",()=>{

alert("⚠️ Internet Connection Lost");

});

window.addEventListener("online",()=>{

console.log("Internet Connected");

refreshDashboard();

});


// =====================================
// Page Visibility Refresh
// =====================================

document.addEventListener("visibilitychange",()=>{

if(!document.hidden){

refreshDashboard();

}

});


// =====================================
// Image Error Handler
// =====================================

document.addEventListener("error",(e)=>{

if(e.target.tagName==="IMG"){

e.target.src="images/user.png";

}

},true);


// =====================================
// Prevent Right Click (Optional)
// =====================================

document.addEventListener("contextmenu",(e)=>{

e.preventDefault();

});


// =====================================
// Prevent F12 & DevTools Shortcut (Optional)
// =====================================

document.addEventListener("keydown",(e)=>{

if(
e.key==="F12" ||
(e.ctrlKey && e.shiftKey && (e.key==="I" || e.key==="J" || e.key==="C")) ||
(e.ctrlKey && e.key==="U")
){

e.preventDefault();

}

});


// =====================================
// Dashboard Ready
// =====================================

console.log("✅ BKTech Student Dashboard Loaded Successfully");
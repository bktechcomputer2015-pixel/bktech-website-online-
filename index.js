// =====================================
// BKTech Website
// Final index.js - Part 1
// =====================================

import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
getDoc,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =====================================
// Load Courses
// =====================================

async function loadCourses(){

const box=document.getElementById("courseContainer");

if(!box) return;

box.innerHTML="";

try{

const snapshot=await getDocs(query(collection(db,"courses"),orderBy("createdAt","desc")));

if(snapshot.empty){

box.innerHTML="<p>No Courses Available</p>";

return;

}

snapshot.forEach((docSnap)=>{

const c=docSnap.data();

box.innerHTML+=`

<div class="course-card">

<h3>${c.name}</h3>

<p>${c.description||""}</p>

<h4>₹ ${c.fee}</h4>

</div>

`;

});

}catch(err){

console.log(err);

}

}


// =====================================
// Load Notices
// =====================================

async function loadNotices(){

const box=document.getElementById("noticeContainer");

if(!box) return;

box.innerHTML="";

try{

const snapshot=await getDocs(query(collection(db,"notices"),orderBy("createdAt","desc")));

if(snapshot.empty){

box.innerHTML="<p>No Notice Available</p>";

return;

}

snapshot.forEach((docSnap)=>{

const n=docSnap.data();

box.innerHTML+=`

<div class="notice-card">

<h3>${n.title}</h3>

<p>${n.message}</p>

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

async function loadGallery() {

const box = document.getElementById("galleryContainer");

if (!box) return;

box.innerHTML = "";

try {

const snapshot = await getDocs(
query(collection(db, "gallery"), orderBy("createdAt", "desc"))
);

if (snapshot.empty) {

box.innerHTML = "<p>No Images Available</p>";

return;

}

snapshot.forEach((docSnap) => {

const g = docSnap.data();

box.innerHTML += `

<div class="gallery-item">

<img src="${g.image}"
alt="Gallery Image"
loading="lazy">

</div>

`;

});

} catch (err) {

console.log(err);

}

}


// =====================================
// Load PDF Notes
// =====================================

async function loadPDFs() {

const box = document.getElementById("pdfContainer");

if (!box) return;

box.innerHTML = "";

try {

const snapshot = await getDocs(
query(collection(db, "pdfs"), orderBy("createdAt", "desc"))
);

if (snapshot.empty) {

box.innerHTML = "<p>No PDF Available</p>";

return;

}

snapshot.forEach((docSnap) => {

const pdf = docSnap.data();

box.innerHTML += `

<div class="pdf-card">

<h3>${pdf.name}</h3>

<a href="${pdf.url}" target="_blank">

Download PDF

</a>

</div>

`;

});

} catch (err) {

console.log(err);

}

}


// =====================================
// Load Live Class
// =====================================

async function loadLiveClass() {

const btn = document.getElementById("liveClassBtn");

if (!btn) return;

try {

const snap = await getDoc(doc(db, "settings", "liveClass"));

if (!snap.exists()) return;

const data = snap.data();

btn.href = data.url;
btn.target = "_blank";

} catch (err) {

console.log(err);

}

}
// =====================================
// Refresh Website Data
// =====================================

async function refreshWebsite() {

await loadCourses();

await loadNotices();

await loadGallery();

await loadPDFs();

await loadLiveClass();

}


// =====================================
// Auto Refresh Every 30 Seconds
// =====================================

setInterval(() => {

refreshWebsite();

}, 30000);


// =====================================
// Initial Load
// =====================================

refreshWebsite();

console.log("✅ BKTech Website Loaded Successfully");
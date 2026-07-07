// =====================================
// BKTech Admin Dashboard
// Final Admin.js - Part 1
// =====================================

import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
collection,
addDoc,
getDocs,
getDoc,
getCountFromServer,
serverTimestamp,
doc,
setDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =====================================
// Cloudinary Config
// =====================================

const CLOUD_NAME = "bqfchyjg";
const UPLOAD_PRESET = "bktech_gallery";


// =====================================
// Authentication
// =====================================

onAuthStateChanged(auth, (user)=>{

if(!user){

window.location.href="login.html";
return;

}

const email=document.getElementById("adminEmail");

if(email){

email.textContent=user.email;

}

refreshDashboard();

});


// =====================================
// Logout
// =====================================

window.adminLogout=async()=>{

await signOut(auth);

window.location.href="login.html";

};


// =====================================
// Dashboard Counter
// =====================================

async function loadDashboard(){

try{

const students=await getCountFromServer(collection(db,"students"));

const courses=await getCountFromServer(collection(db,"courses"));

const notices=await getCountFromServer(collection(db,"notices"));

const enquiries=await getCountFromServer(collection(db,"enquiries"));

document.getElementById("studentCount").textContent=
students.data().count;

document.getElementById("courseCount").textContent=
courses.data().count;

document.getElementById("noticeCount").textContent=
notices.data().count;

document.getElementById("enquiryCount").textContent=
enquiries.data().count;

}catch(err){

console.log(err);

}

}


// =====================================
// Add Course
// =====================================

window.addCourse = async()=>{

const name=document.getElementById("courseName").value.trim();

const fee=document.getElementById("courseFee").value.trim();

const description=document.getElementById("courseDescription").value.trim();

if(name===""||fee===""){

alert("Please fill all required fields");

return;

}

try{

await addDoc(collection(db,"courses"),{

name,

fee:Number(fee),

description,

createdAt:serverTimestamp()

});

alert("✅ Course Added Successfully");

document.getElementById("courseName").value="";
document.getElementById("courseFee").value="";
document.getElementById("courseDescription").value="";

loadDashboard();

}catch(err){

console.log(err);

alert("Course Add Failed");

}

};


// =====================================
// Add Notice
// =====================================

window.addNotice=async()=>{

const title=document.getElementById("noticeTitle").value.trim();

const message=document.getElementById("noticeMessage").value.trim();

if(title===""||message===""){

alert("Please enter notice");

return;

}

try{

await addDoc(collection(db,"notices"),{

title,

message,

createdAt:serverTimestamp()

});

alert("✅ Notice Published");

document.getElementById("noticeTitle").value="";
document.getElementById("noticeMessage").value="";

loadDashboard();

}catch(err){

console.log(err);

alert("Notice Publish Failed");

}

};
// =====================================
// Live Class
// =====================================

window.updateLiveClass = async () => {

const link = document.getElementById("liveLink").value.trim();

if (link === "") {
alert("Enter YouTube Live Link");
return;
}

try {

await setDoc(doc(db, "settings", "liveClass"), {

url: link,
updatedAt: serverTimestamp()

});

alert("✅ Live Class Updated");

document.getElementById("liveLink").value = "";

} catch (err) {

console.log(err);

alert("Update Failed");

}

};


// =====================================
// Gallery Upload (Cloudinary)
// =====================================

window.uploadGallery = async () => {

const file = document.getElementById("galleryImage").files[0];

if (!file) {
alert("Select Image");
return;
}

try {

const formData = new FormData();

formData.append("file", file);

formData.append("upload_preset", UPLOAD_PRESET);

const response = await fetch(

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

{

method: "POST",

body: formData

}

);

const data = await response.json();

if (!data.secure_url) {

throw new Error("Upload Failed");

}

await addDoc(collection(db, "gallery"), {

image: data.secure_url,

publicId: data.public_id,

createdAt: serverTimestamp()

});

alert("✅ Image Uploaded Successfully");

document.getElementById("galleryImage").value = "";

} catch (err) {

console.log(err);

alert("❌ Image Upload Failed");

}

};


// =====================================
// PDF Upload (Cloudinary)
// =====================================

window.uploadPDF = async () => {

const file = document.getElementById("pdfFile").files[0];

if (!file) {

alert("Select PDF");

return;

}

try {

const formData = new FormData();

formData.append("file", file);

formData.append("upload_preset", UPLOAD_PRESET);

const response = await fetch(

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,

{

method: "POST",

body: formData

}

);

const data = await response.json();

if (!data.secure_url) {

throw new Error("Upload Failed");

}

await addDoc(collection(db, "pdfs"), {

name: file.name,

url: data.secure_url,

publicId: data.public_id,

createdAt: serverTimestamp()

});

alert("✅ PDF Uploaded Successfully");

document.getElementById("pdfFile").value = "";

} catch (err) {

console.log(err);

alert("❌ PDF Upload Failed");

}

};
// =====================================
// Load Students
// =====================================

async function loadStudents() {

const table = document.getElementById("studentTable");

if (!table) return;

table.innerHTML = "";

try {

const snapshot = await getDocs(collection(db, "students"));

if (snapshot.empty) {

table.innerHTML = `
<tr>
<td colspan="5" style="text-align:center;padding:20px;">
No Students Found
</td>
</tr>
`;

return;

}

snapshot.forEach((docSnap) => {

const s = docSnap.data();

table.innerHTML += `

<tr>

<td>${s.name || "-"}</td>

<td>${s.email || "-"}</td>

<td>${s.course || "-"}</td>

<td>${s.mobile || "-"}</td>

<td>

<button
onclick="deleteStudent('${docSnap.id}')"
style="background:#d32f2f;color:#fff;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;">

Delete

</button>

</td>

</tr>

`;

});

} catch (err) {

console.log(err);

}

}


// =====================================
// Delete Student
// =====================================

window.deleteStudent = async (id) => {

if (!confirm("Delete this student?")) return;

try {

await deleteDoc(doc(db, "students", id));

alert("✅ Student Deleted Successfully");

refreshDashboard();

} catch (err) {

console.log(err);

alert("❌ Delete Failed");

}

};


// =====================================
// Load Pending Admissions
// =====================================

async function loadAdmissions() {

const box = document.getElementById("admissionList");

if (!box) return;

box.innerHTML = "";

try {

const snapshot = await getDocs(collection(db, "admissions"));

if (snapshot.empty) {

box.innerHTML = "<p>No Admission Requests</p>";

return;

}

snapshot.forEach((docSnap) => {

const s = docSnap.data();

box.innerHTML += `

<div class="card" style="margin-bottom:15px;text-align:left;">

<h4>${s.name}</h4>

<p><b>Email:</b> ${s.email || "-"}</p>

<p><b>Mobile:</b> ${s.mobile || "-"}</p>

<p><b>Course:</b> ${s.course || "-"}</p>

<button onclick="approveAdmission('${docSnap.id}')">

✅ Approve

</button>

<button
onclick="rejectAdmission('${docSnap.id}')"
style="background:#d32f2f;margin-left:10px;">

❌ Reject

</button>

</div>

`;

});

} catch (err) {

console.log(err);

}

}


// =====================================
// Approve Admission
// =====================================

window.approveAdmission = async (id) => {

try {

const snap = await getDoc(doc(db, "admissions", id));

if (!snap.exists()) {

alert("Admission Not Found");

return;

}

await addDoc(collection(db, "students"), {

...snap.data(),

approvedAt: serverTimestamp()

});

await deleteDoc(doc(db, "admissions", id));

alert("✅ Admission Approved");

refreshDashboard();

} catch (err) {

console.log(err);

alert("❌ Approval Failed");

}

};


// =====================================
// Reject Admission
// =====================================

window.rejectAdmission = async (id) => {

if (!confirm("Reject this admission?")) return;

try {

await deleteDoc(doc(db, "admissions", id));

alert("❌ Admission Rejected");

refreshDashboard();

} catch (err) {

console.log(err);

alert("Reject Failed");

}

};
// =====================================
// Load Enquiries
// =====================================

async function loadEnquiries() {

const box = document.getElementById("enquiryList");

if (!box) return;

box.innerHTML = "";

try {

const snapshot = await getDocs(collection(db, "enquiries"));

if (snapshot.empty) {

box.innerHTML = "<p>No Enquiries Available</p>";

return;

}

snapshot.forEach((docSnap) => {

const e = docSnap.data();

box.innerHTML += `

<div class="card" style="margin-bottom:15px;text-align:left;">

<h4>${e.name || "-"}</h4>

<p><b>Email:</b> ${e.email || "-"}</p>

<p><b>Mobile:</b> ${e.mobile || "-"}</p>

<p><b>Course:</b> ${e.course || "-"}</p>

<p><b>Message:</b> ${e.message || "-"}</p>

</div>

`;

});

} catch (err) {

console.log(err);

}

}


// =====================================
// Refresh Dashboard
// =====================================

async function refreshDashboard() {

await loadDashboard();

await loadStudents();

await loadAdmissions();

await loadEnquiries();

}


// =====================================
// Auto Refresh
// =====================================

setInterval(() => {

refreshDashboard();

}, 30000);


// =====================================
// Initial Load
// =====================================

refreshDashboard();

console.log("✅ BKTech Admin Dashboard Loaded Successfully");
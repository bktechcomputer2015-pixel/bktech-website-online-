// =====================================
// BKTech Authentication System
// auth.js - Part 1
// =====================================

import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
doc,
setDoc,
getDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =====================================
// Register Student
// =====================================

window.registerStudent = async () => {

const name = document.getElementById("name").value.trim();
const mobile = document.getElementById("mobile").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;

if(name==="" || mobile==="" || email==="" || password===""){

alert("Please fill all fields");

return;

}

try{

const userCredential = await createUserWithEmailAndPassword(
auth,
email,
password
);

await setDoc(doc(db,"users",userCredential.user.uid),{

uid:userCredential.user.uid,
name:name,
mobile:mobile,
email:email,
role:"student",
createdAt:serverTimestamp()

});

alert("✅ Registration Successful");

window.location.href="login.html";

}catch(err){

console.log(err);

alert(err.message);

}

};


// =====================================
// Login
// =====================================

window.loginUser = async()=>{

const email=document.getElementById("email").value.trim();

const password=document.getElementById("password").value;

if(email==="" || password===""){

alert("Enter Email & Password");

return;

}

try{

const userCredential = await signInWithEmailAndPassword(
auth,
email,
password
);

const uid = userCredential.user.uid;

const userDoc = await getDoc(doc(db,"users",uid));

if(!userDoc.exists()){

alert("User Not Found");

await signOut(auth);

return;

}
  // =====================================
// Role Check & Redirect
// =====================================

const userData = userDoc.data();

if(userData.role === "admin"){

alert("✅ Admin Login Successful");

window.location.href = "admin.html";

}else{

alert("✅ Student Login Successful");

window.location.href = "student.html";

}

}catch(err){

console.log(err);

alert("❌ Invalid Email or Password");

}

};


// =====================================
// Logout
// =====================================

window.logoutUser = async()=>{

try{

await signOut(auth);

window.location.href="login.html";

}catch(err){

console.log(err);

}

};


// =====================================
// Current User
// =====================================

window.getCurrentUser = ()=>{

return auth.currentUser;

};
// =====================================
// Auto Login Check
// =====================================

onAuthStateChanged(auth, async(user)=>{

if(!user) return;

try{

const userDoc = await getDoc(doc(db,"users",user.uid));

if(!userDoc.exists()) return;

const userData = userDoc.data();

const page = window.location.pathname.split("/").pop();


// =====================================
// Admin Security
// =====================================

if(page==="admin.html"){

if(userData.role!=="admin"){

alert("Access Denied!");

window.location.href="student.html";

return;

}

}


// =====================================
// Student Security
// =====================================

if(page==="student.html"){

if(userData.role!=="student"){

window.location.href="admin.html";

return;

}

}


// =====================================
// Prevent Login After Login
// =====================================

if(page==="login.html" || page==="signup.html"){

if(userData.role==="admin"){

window.location.href="admin.html";

}else{

window.location.href="student.html";

}

}

}catch(err){

console.log(err);

}

});
// =====================================
// Session Management
// =====================================

window.checkLogin = ()=>{

const user = auth.currentUser;

if(!user){

window.location.href="login.html";

return false;

}

return true;

};


// =====================================
// Get User Role
// =====================================

window.getUserRole = async()=>{

const user = auth.currentUser;

if(!user) return null;

try{

const snap = await getDoc(doc(db,"users",user.uid));

if(!snap.exists()) return null;

return snap.data().role;

}catch(err){

console.log(err);

return null;

}

};


// =====================================
// Safe Logout
// =====================================

window.safeLogout = async()=>{

try{

await signOut(auth);

localStorage.clear();
sessionStorage.clear();

window.location.replace("login.html");

}catch(err){

console.log(err);

}

};


// =====================================
// Global Error Handler
// =====================================

window.addEventListener("unhandledrejection",(event)=>{

console.error("Unhandled Promise:",event.reason);

});

window.addEventListener("error",(event)=>{

console.error("JavaScript Error:",event.error);

});


// =====================================
// Auth Ready
// =====================================

console.log("✅ BKTech Authentication Loaded Successfully");
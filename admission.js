// ==========================================
// BKTech Computer & Library
// Admission Form
// File: public/js/admission.js
// ==========================================

import { db } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("admissionForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const loading = document.getElementById("loadingBox");
    const success = document.getElementById("successBox");

    loading.style.display = "block";
    success.style.display = "none";

    const student = {

        name: document.getElementById("studentName").value.trim(),

        fatherName: document.getElementById("fatherName").value.trim(),

        mobile: document.getElementById("mobile").value.trim(),

        email: document.getElementById("email").value.trim(),

        dob: document.getElementById("dob").value,

        gender: document.getElementById("gender").value,

        qualification: document.getElementById("qualification").value,

        course: document.getElementById("course").value,

        address: document.getElementById("address").value.trim(),

        message: document.getElementById("message").value.trim(),

        status: "Pending",

        createdAt: serverTimestamp()

    };

    try {

        await addDoc(collection(db, "admissions"), student);

        loading.style.display = "none";
        success.style.display = "block";

        form.reset();

        setTimeout(() => {

            success.style.display = "none";

        }, 4000);

    } catch (error) {

        loading.style.display = "none";

        console.error(error);

        alert("Admission submit failed. Please try again.");

    }

});
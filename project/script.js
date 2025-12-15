// JavaScript File: script.js

/*
    Full Name: [Your Name]
    Section: [Your Section]
    Date: [Current Date]
    Description: This script dynamically displays student information on a webpage using variables.
*/

// Declaring variables representing different data types

// String: Student's name
let studentName = "Cyril Kate Papelleras";

// Number: Student's age
let studentAge = 21;

// Boolean: Whether the student is enrolled or not
let studentEnrolled = true;

let studentSection = "2555C";

// Array: List of subjects the student is taking
let studentSubjects = ["Web System"];

// Dynamically displaying the variables on the webpage
document.getElementById("studentName").textContent = studentName;
document.getElementById("studentAge").textContent = studentAge;
document.getElementById("studentEnrolled").textContent = studentEnrolled ? "Yes" : "No";
document.getElementById("studentSection").textContent = studentSection;
document.getElementById("studentSubjects").textContent = studentSubjects.join(", ");

// Logging each variable's data type in the browser console
console.log("Data Type of studentName:", typeof studentName); // String
console.log("Data Type of studentAge:", typeof studentAge); // Number
console.log("Data Type of studentEnrolled:", typeof studentEnrolled); // Boolean
console.log("Data Type of studentEnrolled:", typeof studentSection);
console.log("Data Type of studentSubjects:", typeof studentSubjects); // Object (Array is technically an object in JavaScript)

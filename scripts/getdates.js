const currentYearSpan = document.querySelector("#currentyear");
const today = new Date();
currentYearSpan.textContent = today.getFullYear();

const lastModified = document.querySelector("#lastModified");
lastModified.textContent = 'Last Modification: ${document.lastModified}';
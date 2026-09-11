const footerSpan = document.querySelector(".footer-span");

footerSpan.innerHTML = '${(new Date().getFullYear())}';

document.getElementById("lastModified").textContent = document.lastModified;
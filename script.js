// =============================
// Hamburger menu
// =============================

function toggleMenu(){
    const menu = document.getElementById("navlinks");
    menu.classList.toggle("active");
}

// =============================
// Scroll bar
// =============================

window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.querySelector(".scrollbar").style.width = scrolled + "%";
};

// =============================
// DISCO EASTER EGG
// =============================

let clickCount = 0;
let discoOn = false;

const logo = document.querySelector(".brand");
const notes = document.querySelectorAll(".music-background span");

logo.addEventListener("click", () => {

    clickCount++;

    if(clickCount >= 5){

        discoOn = !discoOn;
        document.body.classList.toggle("disco-mode");

        if(discoOn){
            notes.forEach(note => {
                note.textContent = "🪩";
            });
        } else {
            const normal = ["♪","♫","♬","♪","♫","♬","♪","♫","♬","♪","♫","♬"];
            notes.forEach((note, i) => {
                note.textContent = normal[i];
            });
        }

        clickCount = 0;
    }

});

// =============================
// FOTO POPUP
// =============================

function openImage(img){
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popup-img");

    popup.style.display = "flex";
    popupImg.src = img.src;
}

function closeImage(){
    document.getElementById("popup").style.display = "none";
}
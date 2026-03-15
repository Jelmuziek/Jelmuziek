function toggleMenu(){
    const menu = document.getElementById("navlinks");
    menu.classList.toggle("active");
    }

window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.querySelector(".scrollbar").style.width = scrolled + "%";
};
const mediaQuery = window.matchMedia("(min-width: 820px)");
function ImageFocus(id, x, y) {
    if (mediaQuery.matches) {
        document.getElementById(id).style.objectPosition = `${x}% ${y}%`;
    }
}

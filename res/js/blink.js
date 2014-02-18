var blinkers;
window.addEventListener('load', init, false);
function init() {
    blinkers = document.getElementsByClassName('content');
    setInterval(function() { toggleBlinkHandler(); }, 750);
}
function toggleBlinkHandler() {
    toggleBlink();
    setTimeout(function() { toggleBlink(); }, 450);
}
function toggleBlink() {
    for(var i = 0; i < blinkers.length; i++) {
        if(blinkers[i].style.visibility == 'visible') {
            blinkers[i].style.visibility = 'hidden';
        } else {
            blinkers[i].style.visibility = 'visible';
        }
    }
}
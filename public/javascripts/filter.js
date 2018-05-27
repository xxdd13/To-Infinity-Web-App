let toggle = document.querySelector('.toggle');
let citytitle = document.getElementById('citytitle');
let cards = document.getElementsByClassName('cardX');
let backoff = false;
toggle.addEventListener('click', function(e) {
    if (backoff) return;
    setTimeout(() => backoff = false, 250);
    backoff = true;
    if (!toggle.classList.contains('activef')) {
        toggle.classList.remove('inactivef');
        citytitle.classList.remove('inactivef');
        toggle.classList.add('activef');
        citytitle.classList.add('activef');
        for(var i=0;i<cards.length;i++){
            if (cards[i].classList.contains('hideX')) {
                cards[i].classList.add("filterHide");
            }
        }

    } else {
        toggle.classList.add('inactivef');
        toggle.classList.remove('activef');
        citytitle.classList.add('inactivef');
        citytitle.classList.remove('activef');
        for(var i=0;i<cards.length;i++){
            if (cards[i].classList.contains('hideX')) {
                cards[i].classList.remove("filterHide");
            }
        }
    }
});
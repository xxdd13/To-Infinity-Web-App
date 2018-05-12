let toggle = document.querySelector('.toggle');
let citytitle = document.getElementById('citytitle');
let cards = document.getElementsByClassName('cardX');
let backoff = false;
toggle.addEventListener('click', function(e) {
    if (backoff) return;
    setTimeout(() => backoff = false, 250);
    backoff = true;
    if (!toggle.classList.contains('active')) {
        toggle.classList.remove('inactive');
        citytitle.classList.remove('inactive');
        toggle.classList.add('active');
        citytitle.classList.add('active');
        for(var i=0;i<cards.length;i++){
            if (cards[i].classList.contains('hideX')) {
                cards[i].classList.add("filterHide");
            }
        }

    } else {
        toggle.classList.add('inactive');
        toggle.classList.remove('active');
        citytitle.classList.add('inactive');
        citytitle.classList.remove('active');
        for(var i=0;i<cards.length;i++){
            if (cards[i].classList.contains('hideX')) {
                cards[i].classList.remove("filterHide");
            }
        }
    }
});
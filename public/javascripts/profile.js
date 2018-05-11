$(".e-list").slideUp(function() {
    $(".e-button").removeClass("open");
});

$(".e-button").on("click", function() {
    if ($(this).hasClass("open")) {
        $(".e-list").slideUp(function() {
            $(".e-button").removeClass("open");
        });
    } else {
        $(this).addClass("open");
        setTimeout(function() {
            $(".e-list").stop().slideDown();
        }, 200);
    }
});

var tl = anime.timeline({});

tl
    .add({
        targets: '.hero-sides__left',
        height: [0, '100vh'],
        easing: 'easeInOutSine',
        duration: 100
    })
    .add({
        targets: '.hero-sides__right',
        height: [0, '100vh'],
        easing: 'easeInOutSine',
        duration: 100
    })
    .add({
        targets: '#letters',
        scale: [0, 1],
        easing: 'easeInOutSine',
        duration: 100,
        delay: function(el, i) { return i * 150 },
        elasticity: function(el, i, l) {
            return (100 + i * 100);
        }
    })




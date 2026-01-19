function initializeNavigation() {
    const $menu = $('.main-navigation .menu').clone();
    $('.mobile-navigation').html($menu).hide();
    $('.menu-toggle').on('click', function (e) {
        e.preventDefault();
        $(".mobile-navigation").slideToggle();
    });
    $(document).on('click', '.mobile-navigation a', function () {
        $(".mobile-navigation").hide();
    });
}
function initializeIsotope() {
    if ($('.filterable-items').length) {
        const $grid = $('.filterable-items').isotope({
            itemSelector: '.photo-item',
            layoutMode: 'fitRows'
        });
        $(document).on('click', '.filter-btn', function (e) {
            e.preventDefault();
            const filterValue = $(this).attr('data-filter');
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            $grid.isotope({ filter: filterValue });
        });
    }
}
function waitForjQueryAndInit() {
    if (typeof $ !== 'undefined' && document.readyState !== 'loading') {
        initializeNavigation();
        initializeIsotope();
    }
    else if (typeof $ !== 'undefined') {
        $(document).ready(function () {
            initializeNavigation();
            initializeIsotope();
        });
    }
    else {
        setTimeout(waitForjQueryAndInit, 100);
    }
}
waitForjQueryAndInit();
export {};
//# sourceMappingURL=app.js.map
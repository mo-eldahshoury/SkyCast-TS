declare var $: any;
function initializeNavigation() {
	const $menu = $('.main-navigation .menu').clone();
	$('.mobile-navigation').html($menu).hide();

	$('.menu-toggle').on('click', function (e: any) {
		e.preventDefault();
		$(".mobile-navigation").slideToggle();
	});
	$(document).on('click', '.mobile-navigation a', function () {
		$(".mobile-navigation").hide();
	});
}

function initializeIsotope() {
	if ($('.filterable-items').length) {
		const $grid = ($('.filterable-items') as any).isotope({
			itemSelector: '.photo-item',
			layoutMode: 'fitRows'
		});

		$(document).on('click', '.filter-btn', function (this: HTMLElement, e: any) {
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
	} else if (typeof $ !== 'undefined') {
		$(document).ready(function() {
			initializeNavigation();
			initializeIsotope();
		});
	} else {
		setTimeout(waitForjQueryAndInit, 100);
	}
}

waitForjQueryAndInit();


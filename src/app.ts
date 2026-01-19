declare var $: any;

$(function () {
	// Clone menu to mobile navigation on page load and hide it
	const $menu = $('.main-navigation .menu').clone();
	$('.mobile-navigation').html($menu).hide();

	$(document).on('click', '.menu-toggle', function (e: any) {
		e.preventDefault();
		$(".mobile-navigation").slideToggle();
	});

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
});


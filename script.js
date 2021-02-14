window.onload = () => {
	const productsDisplayButtons = document.querySelectorAll('.view__button');
	for(let i = 0; i < productsDisplayButtons.length; i++) {
		productsDisplayButtons[i].addEventListener('click', () => {changeProductsDisplay(productsDisplayButtons[i])});
	}
	
	function changeProductsDisplay(elem) {
		changeIcon(elem);
		
		function changeIcon(elem) {
			const activeClass = 'view__button_active';
			document.querySelector(`.${activeClass}`).classList.remove(activeClass);
			elem.classList.add(activeClass);
		}
	}
}
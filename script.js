window.onload = () => {
	
	const productsDisplay = {
		data: {
			'tile': {
				'button': document.querySelector('.view__button-tile-display'),
				'class': 'products__content_tile'
			},
			'column': {
				'button': document.querySelector('.view__button-column-display'),
				'class': 'products__content_column'
			},
			'products': document.querySelector('.products__content'),
			'buttonActiveClass': 'view__button_active',
			'activeDisplay': 'products__content_tile'
		},
		changeTo: function (type) {
			changeIcon.call(this, this.data[type]['button']);
			this.data['products'].classList.remove(this.data['activeDisplay']);
			this.data['activeDisplay'] = this.data[type]['class'];
			this.data['products'].classList.add(this.data['activeDisplay']);
			
			function changeIcon(elem) {
			document.querySelector(`.${this.data['buttonActiveClass']}`).classList.remove(this.data['buttonActiveClass']);
			elem.classList.add(this.data['buttonActiveClass']);
			}
		}
	}
	productsDisplay.data['tile']['button'].addEventListener('click', function() {productsDisplay.changeTo('tile'); });	
	productsDisplay.data['column']['button'].addEventListener('click', function() {productsDisplay.changeTo('column'); });
}
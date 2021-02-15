window.onload = () => {
	
	//Смена отображения товаров
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
	
	//Смена наименования товара
	const productTitle = {
		data: {
			'titles': document.querySelectorAll('.product__title'),
			'activeTitle': null,
			'titleText': null
		},
		buttonSubmit: function(){
			let button = document.createElement('div');
			button.classList.add('product__button-change-title');
			button.textContent = 'Готово';
			button.contentEditable = 'false';
			button.addEventListener('click', function() {			
				productTitle.deleteButton();
				saveChange.call(productTitle);
				//productTitle.data['activeTitle'].dispatchEvent(new Event('focusout'));

				fetch('localhost', {
				    method: 'POST',
				    headers: {
				        'Content-Type': 'application/json;charset=utf-8'
				    },
				    body: JSON.stringify({
						'id': productTitle.data['activeTitle'].parentNode.querySelector('.product__id').textContent,
						'newText': productTitle.data['activeTitle'].textContent
					})
				});
			});
			return button;

			function saveChange() {
				this.data['titleText'] = this.data['activeTitle'].textContent;
			}
		}(),
		addButton: function() {
			this.data['activeTitle'].appendChild(this.buttonSubmit);
		},
		deleteButton: function() {
			let button = document.querySelector('.product__button-change-title');
			if(button) this.data['activeTitle'].removeChild(button);
		},
		returnState: function() {
			this.data['activeTitle'].textContent = this.data['titleText'];
			this.data['activeTitle'] = null;
			this.data['titleText'] = null;
		}
	}
	for(let i = 0; i < productTitle.data['titles'].length; i++) {
		productTitle.data['titles'][i].addEventListener('focusin', function() {
			productTitle.data['activeTitle'] = this;
			productTitle.data['titleText'] = this.textContent;
			productTitle.addButton();
		});
		productTitle.data['titles'][i].addEventListener('focusout', function() {			
			productTitle.deleteButton();			
			productTitle.returnState();
		});
	}
}
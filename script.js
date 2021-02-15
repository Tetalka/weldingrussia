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
	for(let i = 0, titles = productTitle.data['titles']; i < titles.length; i++) {
		titles[i].contentEditable = true;
		titles[i].spellcheck = false;
		titles[i].addEventListener('focusin', function() {
			productTitle.data['activeTitle'] = this;
			productTitle.data['titleText'] = this.textContent;
			productTitle.addButton();
		});
		titles[i].addEventListener('focusout', function() {			
			productTitle.deleteButton();			
			productTitle.returnState();
		});
	}
	
	//Изменение порядка товаров путём перемещения
	const productsPlace = document.querySelector('.products__content');
	for(let i = 0, buttons = document.querySelectorAll('.product__button-drag'), products = document.querySelectorAll('.product'); i < buttons.length; i++) {
		buttons[i].addEventListener('mousedown', () => {products[i].draggable = true});
		products[i].addEventListener('dragend', () => {products[i].draggable = false});
	}
	for(let product of document.querySelectorAll('.product')) {
		product.querySelector('.product__image').draggable = false;
	}
	productsPlace.addEventListener('dragstart', (e) => {
		e.target.classList.add('product_drag-selected');
	});
	productsPlace.addEventListener('dragend', (e) => {
		e.target.classList.remove('product_drag-selected');
	});
	productsPlace.addEventListener('dragover', (e)=> {
		const activeProduct = productsPlace.querySelector('.product_drag-selected');
		const targetProduct = e.target;
		const isDragable = (activeProduct !== targetProduct) && (targetProduct.classList.contains('product'));
		
		if(!isDragable) return;
		
		const nextProduct = (targetProduct === activeProduct.nextSibling) ? targetProduct.nextSibling : targetProduct;
		productsPlace.insertBefore(activeProduct, nextProduct);
	});
}

//Генерация пар скобок
function getBrackets(num) {
	const brackets = ['()', '{}', '[]'];
	let notClosed = [];
	let str = '';
	
	for(let i = 0; i < num;) {
		let act = getAction();
		if( act === 1 || notClosed.length === 0) {
			str += openBracket();
			i++;
		}
		else {
			str += closeBracket();
		}
	}
	while(notClosed.length != 0) {
		str += closeBracket();
	}
	return str;
	
	function getAction() {
		return Math.floor(Math.random()*2);
	}
	function openBracket() {
		let random = Math.floor(Math.random()*3);
		let bracket = brackets[random][0];
		notClosed.unshift(brackets[random][1]);
		return bracket;
	}
	function closeBracket() {
		let bracket = notClosed[0];
		notClosed = notClosed.slice(1);
		return bracket;
	}
}

//Проверка генерации пар скобок
function checkBrackets(str) {	
	const brackets = ['()', '{}', '[]'];
	let opened = [];
	let index = 0;
	for(let bracket of str) {
		let isOpened = false;
		for(let i = 0; i < brackets.length; i++) {
			if(bracket === brackets[i][0]) {
				isOpened = true;
				opened.push(bracket);
				index = i;
				break;
			}
		}
		if(!isOpened) {
			for(let j = 0; j < brackets.length; j++) {
				if(opened[opened.length-1] === brackets[j][0]) {
					index = j;
					break;
				}
			}
			if(bracket !== brackets[index][1]) return false;
			else opened.pop();
		}
	}
	return true;
}
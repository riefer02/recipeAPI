import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
	elements.searchInput.value = '';
};

export const clearResults = () => {
	elements.searchResultsList.innerHTML = '';
	elements.searchResPages.innerHTML = '';
};

export const highlightSelected = (id) => {
	const resultsArr = Array.from(document.querySelectorAll('.results-link'));
	resultsArr.forEach(el => {
		el.classList.remove('.results__link--active');
	})
	document.querySelector(`.results__link[href="#${id}"]`).classList.add('.results__link--active'); //Select an element that has a href attribute = to the #id
};

//function that limits the length of a recipes to about three words!
//iterates through adding to the acc until it reaches the limit of 17 and then is no longer
//pushed into the newTitle array

export const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];

	if(title.length > limit) {
		title.split(' ').reduce((acc, cur) => {
			if ( acc + cur.length < limit) {
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0);

		//return the result
		return `${newTitle.join(' ')}...`;
	}
	return title
};

const renderRecipe = recipe => {
	const markup = `
			<li>
	            <a class="results__link" href="#${recipe.recipe_id}">
	                <figure class="results__fig">
	                    <img src="${recipe.image_url}" alt="${recipe.title}">
	                </figure>
	                <div class="results__data">
	                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
	                    <p class="results__author">${recipe.publisher}</p>
	                </div>
	            </a>
	        </li>
	`;
	elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};

//Pagination algorithm is here!!!!


//type: 'prev' or 'next'
const createButton = (page, type) => `
				<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                </button>
`;

const renderButtons = (page, numResults, resultsPerPage) => {
	const pages = Math.ceil(numResults / resultsPerPage);
	let button;

	if (page === 1 && pages > 1) {
		//Button to go to next page
		button = createButton(page, 'next');
	} else if (page < pages) {
		//Both Pages
		button = `
		${createButton(page, 'prev')}
		${createButton(page, 'next')}
		`;
	} else if (page === pages) {
		//Only button to go to previous page
		button = createButton(page, 'prev');
	}

	elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
	//render results of current page
	const start = (page - 1) * resultsPerPage;
	const end = page * resultsPerPage;

	recipes.slice(start, end).forEach(renderRecipe);

	//render pagination buttons
	renderButtons(page, recipes.length, resultsPerPage);
};
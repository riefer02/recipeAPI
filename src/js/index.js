import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';


/** Global State of the App
/* -Search object
/* - Current recipe object
/* - Shopping list object
/* - Liked Recipes
*/

const state = {};


/*
****SEARCH CONTROLLER****
*/
const controlSearch = async () => {
	// 1. Get Query from the view
	const query = searchView.getInput(); //TODO


	if (query) {
		// 2. New Search Object and add to State
		state.search = new Search(query);

		// 3. Prepare UI - LOADING SPINNER!
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try {
			// 4. Search for Recipes
			await state.search.getResults();

			// 5. Render results on the UI!
			clearLoader();
			searchView.renderResults(state.search.result);
		} catch(error) {
			alert('Something went wrong!');
			clearLoader();
		}
	
	}

}

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

// //*********Just for Development Testing******
// window.addEventListener('load', e => {
// 	e.preventDefault();
// 	controlSearch();
// });

elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');

	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}

});


/*
****RECIPE CONTROLLER****
*/

const controlRecipe = async () => {
	// Get ID from the URL
	const id = window.location.hash.replace('#', '');

	if (id) {
		// 1. Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		//HIghlightSelected search item
		if (state.search) searchView.highlightSelected(id);

		// 2. Create new recipe object
		state.recipe = new Recipe(id);

		// //Testing Purposes
		// window.r = state.recipe;

		try {
				// 3. Get Recipe Data and parse ingredients
				await state.recipe.getRecipe();
				state.recipe.parseIngredients();

				// 4. Calculate servings and cook time
				state.recipe.calcServings();
				state.recipe.calcTime();

				// 5. Render Recipe to DOM
				clearLoader();
				recipeView.renderRecipe(
					state.recipe,
					state.likes.isLiked(id)
					);

			} catch(error) {
				console.log(error);
				alert('Error Processing Recipe!');
			}

	
	}
}

//Using one line of code to detect two events and run the same function! :)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/*
List Controller*
*/
const controlList = () => {
	// Create a new list if there is none yet
	if (!state.list) state.list = new List();

	// Add each ingredient to the list and UI
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
}

//Handle Delete and Update List Item Events

	elements.shopping.addEventListener('click', e => {
		const id = e.target.closest('.shopping__item').dataset.itemid; //gets the id

		//handle the delete button
		if (e.target.matches('.shopping__delete, .shopping__delete *')) {
			//Delete from state
				state.list.deleteItem(id);
			// Delete from UI
				listView.deleteItem(id);

			//Handle the count update
		} else if (e.target.matches('.shopping__count--value')) {
			const val = parseFloat(e.target.value, 10);
			state.list.updateCount(id, val);
		}
	});


/*************************
*****Like Controller******
************************/
const controlLike = () => {
	if (!state.likes) state.likes = new Likes();
	const currentID = state.recipe.id;

	//User has NOT yet liked current recipe
	if (!state.likes.isLiked(currentID)) {
		//Add likes to the state
		const newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img
		);
		//Toggle the like button
		likesView.toggleLikeBtn(true);

		//Add like to the UI list
		likesView.renderLike(newLike);
		

	//User has liked current recipe
	} else {
		//Remove likes to the state
		state.likes.deleteLike(currentID);
		//Toggle the like button
		likesView.toggleLikeBtn(false);

		//Remove like to the UI list
		likesView.deleteLike(currentID);
	}

	likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Get Data from localStorage - Restore Like Recipes on page load

window.addEventListener('load', () => {
	state.likes = new Likes();

	//Restore likes
	state.likes.readStorage();

	//Toggle like menu button
	likesView.toggleLikeMenu(state.likes.getNumLikes());

	//Render the existing likes
	state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling Recipe Button Clicks
elements.recipe.addEventListener('click', e => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		//Decrease button ise clicked

		if(state.recipe.servings > 1) {
				state.recipe.updateServings('dec');
				recipeView.updateServingsIngredients(state.recipe);
		}
	
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		//Increase button ise clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		//Add ingredients to shopping list
		controlList();
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		//Like controller
		controlLike();
	}
	
});
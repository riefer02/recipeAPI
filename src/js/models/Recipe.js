import axios from 'axios'; //how to import installed packages by just using its name

export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	async getRecipe() {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;

		} catch(error) {
			console.log('Error!');
			alert('Something went wrong! Please Try Again!');
		}	
	}

	calcTime() {
		//Assuming that we need 15 mins for each 3 ingredients!
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}

	calcServings() {
		this.servings = 4;
	}

	parseIngredients() {
		const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'Ozs', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']

        const newIngredients = this.ingredients.map(el => {

            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

			// 3. Parse Ingredients into Count, Unit, and Ingredient

			//***Test if there is a numbered unit in a string***
			const arrIng = ingredient.split(' '); //Each space defines a new element in an array
			const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); //to find the position of a unit when we don't know which unit were looking for if it passes the test (callback func)
			
			let objIng;
			if (unitIndex > -1) {
				//There is a unit
				//Example 3 1/4 cups will result in arrCount is [3, 1/4] -->eval() will make this 3.25
				//Example 4 cups, arrCount is [3]
				const arrCount = arrIng.slice(0, unitIndex); 

				let count;
				if (arrCount.length === 1) {
					count = eval(arrIng[0].replace('-', '+'));
				} else {
					count = eval(arrCount.slice(0, unitIndex).join('+'));
				}

				objIng = {
					count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex+1).join(' ')
				}

			} else if (parseInt(arrIng[0], 10)) {
				//There is No unit, but the 1st element is a number
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: '',
					ingredient: arrIng.slice(1).join(' ')
				}
			} else if (unitIndex === -1) {
				//There is no unit and no Number in the first position
				objIng = {
					count: 1,
					unit: '',
					ingredient
				}
			}



			return objIng;
		});

		this.ingredients = newIngredients;
	}

	updateServings(type) {
		//Servings Update
		const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

		//Ingredient Update

		this.ingredients.forEach(ing => {
			ing.count *= (newServings/this.servings);
		});

		this.servings = newServings;
		console.log(newServings);
	}

}
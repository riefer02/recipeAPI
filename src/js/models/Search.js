import axios from 'axios'; //how to import installed packages by just using its name

export default class Search {
	constructor(query) {
		this.query = query;
	}

	async getResults(query) {

		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`); // ? is adding a parameter to the URL!
			this.result = res.data.recipes;
			console.log(this.result);
		} catch(error) {
			alert('error!');
		}
	}
}


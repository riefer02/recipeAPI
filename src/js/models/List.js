import uniqid  from 'uniqid';

export default class List {
	constructor() {
		this.items = [];
	}

	addItem (count, unit, ingredient) {
		const item = {
			id: uniqid(),
			count,
			unit,
			ingredient
		}
		this.items.push(item);
		return item;
	}

	deleteItem (id) {
		const index = this.items.findIndex(el => el.id === id);
		// Splice[2, 4, 8] i.e. splice (1,1) starts at position one and deletes one --> returns 4, 
		//original array becomes [2,8]

		//Slice Example 2 - [2, 4, 8] slice (1, 1) --->returns 4, 
		//and original array intact [2,4,8]

		this.items.splice(index, 1);
	}

	updateCount(id, newCount) {
		this.items.find(el => el.id === id).count = newCount;

	}
}
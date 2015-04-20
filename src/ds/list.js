/*
	List datastructure, as described in
	"Data Structures and Algorithms with Javascript", O'Reilly

	Iterator implementation example:
	for(names.front(); names.currPos() < names.length(); names.next()) { 
		print(names.getElement());
	}
*/

function List()
{
	this.listSize = 0;
	this.pos = 0;
	this.dataStore = [];
	this.clear = clear;
	this.find = find;
	this.toString = toString;
	this.insert = insert;
	this.append = append;
	this.remove = remove;
	this.front = front;
	this.end = end;
	this.prev = prev;
	this.next = next;
	this.length = length;
	this.currPos = currPos;
	this.moveTo = moveTo;
	this.getElement = getElement;
	this.length = length;
	this.contains = contains;

	this.append = function(element) { 
		this.dataStore[this.listSize++] = element;
	}

	this.find = function(element) {
		for (var i = 0; i < this.dataStore.length; ++i) {
			if (this.dataStore[i] == element) { 
				return i;
			} 
		}
		return -1; 
	}

	this.remove = function(element) {
		var foundAt = this.find(element); 
		if (foundAt > -1) {
			this.dataStore.splice(foundAt,1); --this.listSize;
			return true;
		}
		return false; 
	}

	this.length = function() { 
		return this.listSize;
	}

	this.toString = function() { 
		return this.dataStore;
	}

	this.insert = function(element, after) { 
		var insertPos = this.find(after); 
		if (insertPos > -1) {
			this.dataStore.splice(insertPos+1, 0, element); ++this.listSize;
			return true;
		}
		return false; 
	}

	this.clear = function() {
		delete this.dataStore; this.dataStore = []; 
		this.listSize = this.pos = 0;
	}

	this.contains = function(element) {
		for (var i = 0; i < this.dataStore.length; ++i) {
			if (this.dataStore[i] == element) { 
				return true;
			} 
		}
		return false; 
	}

	this.front = function() { 
		this.pos = 0;
	}

	this.end = function() {
		this.pos = this.listSize-1;
	}

	this.prev = function() {
		if (this.pos > 0) {
		--this.pos; 
		}
	}

	this.next = function() {
		if (this.pos < this.listSize-1) {
			++this.pos; 
		}
	}

	this.currPos = function() { 
		return this.pos;
	}

	this.moveTo = function(position) { 
		this.pos = position;
	}

	this.getElement = function() {
		return this.dataStore[this.pos];
	}


}

Array.zeroFilledArray = function(size) {
    return new Array(size + 1).join('0').split('');
}

Array.prototype.getRandom = function(){
	var result = this[Math.floor(Math.random()*this.length)];
	return result;
}

// Splits an array in multiple subarrays with arbitrary length
Array.prototype.chunk = function(chunkSize) {
    var R = [];
    for (var i=0; i<this.length; i+=chunkSize)
        R.push(this.slice(i,i+chunkSize));
    return R;
}
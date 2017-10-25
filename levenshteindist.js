/*  Levehnstein Distance Algorithm
*	Arranged by : Mira N. (github.com/6miramira)
*	Compares 2 strings, checks the similarity
*	The output is : Minimum Edit Distance matrix, the value of MED, and the allignment of strings
*	Use node.js to run
*/

/* The string inputed in node terminal */
var string1 = process.argv[2].toUpperCase()
var string2 = process.argv[3].toUpperCase()

/* Init the matrix and calculate the distance value of edit */
function levenshteindist(string1, string2) {
	var m = string1.length + 1
	var n = string2.length + 1
	
	var matriks = new Array(m)
	for (var i = 0; i < m; i++) {
	  matriks[i] = new Array(n)
	}
	
	/* Fill the first row of matrix */
	/* Default init */
	for (var i = 0; i < m; i++) {
		matriks[i][0] = i
	}

	/* Fill the first column of matrix */
	/* Default init */
	for (var j = 0; j < n; j++) {
		matriks[0][j] = j
	}

	/* Fill the rest cell of matrix by implementing Levenshtein Distance method */
	for (var i = 1; i < m; i++) {
		for (var j = 1; j < n; j++) {

			/* Check whether string is different */
			var same = 0
			if (string1.charAt(i-1)!=string2.charAt(j-1)) {
				same = 2
			}

			matriks[i][j] = 
				Math.min(
				matriks[i-1][j] + 1, // + 1 if do deletion
				matriks[i][j-1] + 1,  // + 1 if do insertion
				matriks[i-1][j-1] + same) // + 2 if do substitution
		}
	}

	return matriks
}

/* BACKTRACING STARTED FROM right-below corner of the matrix*/
function backTracing(matrix) {
	var editPath = []	
	var m = matrix.length
	var n = matrix[0].length

	/* init editPath object */
	for (var i = 0; i < m + n; i++) {
		editPath[i] = {
			row: 0, 
			col: 0,
			act: "ex"
		}
	}

	var a = 0
	var i = m-1
	var j = n-1
	// console.log(i, j)

	/* implement the Levenshtein Distance Algorithm */
	do {
		/* make shure the cell isn't offside */
		if (i-1>=0 && j-1>=0) {

			/* choose the smallest between the cells above, upper left and left of current cell */
			var smallest = Math.min(
							matrix[i-1][j],
							matrix[i][j-1],
							matrix[i-1][j-1])
			// console.log(smallest)

			/* if the smallest come from the cell above */
			if (smallest == matrix[i-1][j]) {
				editPath[a].row = i
				editPath[a].col = j 
				editPath[a].act = "del" //it must be deletion
				i -= 1

			/* if the smallest come from the cell in left */
			} else if (smallest == matrix[i][j-1]) {
				editPath[a].row = i
				editPath[a].col = j 
				editPath[a].act = "ins" // it must be insertion
				j -= 1

			/* so if the smallest come from upper left cell */
			} else if (smallest == matrix[i-1][j-1]) {
				// console.log('...'+smallest, matrix[i][j], i, j)
				
				/* if the value in the cell is equal to current cell */
				if (matrix[i][j] == matrix[i-1][j-1]) {
					editPath[a].row = i
					editPath[a].col = j 
					editPath[a].act = "no" // then it's equal
					i -= 1
					j -= 1
				} else { // if the value is different
					editPath[a].row = i
					editPath[a].col = j 
					editPath[a].act = "rep" // then replace / subtitution
					i -= 1
					j -= 1
				}
			}

		/* if one of the cell index is offside (because will there a case where string1.length > 
		*	string2. length and vice versa
		*/
		} else {
			if (j-1 < 0) {
				editPath[a].row = i
				editPath[a].col = j
				editPath[a].act = "del"
				i -= 1
			} else if (i-1 < 0) {
				editPath[a].row = 0
				editPath[a].col = j
				editPath[a].act = "ins"
				j -= 1
			}
		}
		a += 1
	} while(i>=0 && j>=0)

	return editPath
}

/*console.log(string2.length)
console.log(matrix.length)
console.log(matrix[0].length) */

// console.log(editPath)

var matrix = levenshteindist(string1, string2)
var editPath = backTracing(matrix)

console.log()
console.log('=======================================================')
console.log('            LEVENSHTEIN DISTANCE ALGORITHM              ')
console.log('=======================================================')
console.log()
console.log('Comparing "'+string1+'" and "'+string2+'" with Levensthein Distance Algorithm')
console.log('So we have this matrix after calculation process : ')
console.log()

/* PRINT THE MATRIX CALCULATION RESULT FOR USER */
for (var i = 0; i <= string2.length+1; i++) {
	if (i==0) {
		process.stdout.write('    ')
	} else if (i==1) {
		process.stdout.write('#   ')
	} else {
		process.stdout.write(string2[i-2])
		if (i!=string2.length+1) {
			process.stdout.write('   ')
		} 
	}
}
console.log()

for (var i = 0; i <= string1.length; i++) {
	if (i==0) {
		process.stdout.write('#   ')
	} else {
		process.stdout.write(string1[i-1]+'   ')
	}
	for (var j = 0; j <= string2.length; j++) {
		var space = 3
		var path1 = 0
		if (matrix[i][j].toString().length>1) {
			space = space-matrix[i][j].toString().length+1
		}

		for (var o = 0; o < editPath.length; o++) {
			if ((i==editPath[o].row) && (j==editPath[o].col)) {
				path1 = 1
			}	
		}
		if (path1==1) {
			space = space - 1
			process.stdout.write(''+matrix[i][j]+'|')
		} else {
			process.stdout.write(''+matrix[i][j]+'')
		}
		if (j!=string2.length) {
			for (var x = 0; x < space; x++) {
				process.stdout.write(' ')
			}
		}
	}
	console.log()
}

console.log()


console.log()
console.log('Here is the alignment result : ')
console.log()
var maks = 0

/* PRINT THE ALIGNMENT RESULT */
if (string1.length>string2.length) {
	maks = string1.length
} else {
	maks = string2.length
}
var a = 0
for (var i = (maks); i >= 0; i--) {
	if (editPath[i].act != 'ex') {
		if (editPath[i].act=='ins') {
			process.stdout.write(' '+string2.charAt(editPath[i].col-1)+' ')
		} else if (editPath[i].act=='del' && editPath[i].col != 0) {
			process.stdout.write(' * ')
		} else if (editPath[i].act=='no' || editPath[i].act == 'rep') {
			process.stdout.write(' '+string2.charAt(editPath[i].col-1)+' ')	
		}
	}
}

console.log()

for (var i = (maks); i >= 0; i--) {
	if (editPath[i].act != 'ex') {
		if (editPath[i].act=='ins') {
			process.stdout.write(' * ')
		} else if (editPath[i].act=='del' && editPath[i].row != 0) {
			process.stdout.write(' . ')
		} else if (editPath[i].act=='no' || editPath[i].act == 'rep') {
			if (editPath[i].act=='no') {
				process.stdout.write(' | ')
			} else {
				process.stdout.write(' / ')
			}
		}
	}
}

console.log()

for (var i = (maks); i >= 0; i--) {
	if (editPath[i].act != 'ex') {
		if (editPath[i].act=='ins') {
			process.stdout.write(' * ')
		} else if (editPath[i].act=='del' && editPath[i].row != 0) {
			process.stdout.write(' '+string1.charAt(editPath[i].row-1)+' ')
		} else if (editPath[i].act=='no' || editPath[i].act == 'rep') {
			process.stdout.write(' '+string1.charAt(editPath[i].row-1)+' ')
		}
	}
}

console.log()
console.log()
console.log('Minimum edit distance : '+matrix[string1.length][string2.length])
console.log('Note : ')
console.log('/ = substitution; value = 2')
console.log('. = deletion; value = 1')
console.log('* = insertion; value = 1')
console.log('| = equal; value = 1')
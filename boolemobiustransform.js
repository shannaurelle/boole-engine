function powerOfTwoBitstringToInt(string) {
    let n = string.length;
    let result = [];
    for(let i=0; i < n; i++){
        result.push(parseInt(string[i]));
    }
    return result;
}

function intToPowerOfTwoBitstring(bitarray) {
    return bitarray.join("");
}

function generateBooleMobiusMatrix(n) {
  const size = 1 << n;
  const matrix = Array.from({ length: size }, () => new Array(size).fill(0));

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // (i & j) === i checks if subset j is a subset of i
      if ((i & j) === i) {
        matrix[i][j] = 1;
      }
    }
  }
  return matrix;
}

function multiplyMatrices(matrixA, matrixB) {
    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const rowsB = matrixB.length;
    const colsB = matrixB[0].length;

    // Validate dimensions
    if (colsA !== rowsB) {
        throw new Error("Cannot multiply: Columns of A must match Rows of B.");
    }

    // Initialize result matrix with zeros
    let result = Array(rowsA).fill(null).map(() => Array(colsB).fill(0));

    // Three nested loops for matrix multiplication
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                // swapped addition for XOR, multiplication with AND
                result[i][j] ^= matrixA[i][k] & matrixB[k][j];
            }
        }
    }

    return result;
}

function boole_mobius_transform(bitarray){
    let b_a = [bitarray];
    let n = Math.floor(Math.log2(bitarray.length));
    let b_t = generateBooleMobiusMatrix(n);
    return multiplyMatrices(b_a,b_t);
}

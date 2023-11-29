let archivo_actual ;
function normalizardatos(matrix){
  const columnMeans = [];
  for (let col = 0; col < matrix[0].length; col++) {
    let sum = 0;
    for (let row = 0; row < matrix.length; row++) {
      sum += matrix[row][col];
    }
    const mean = sum / matrix.length;
    columnMeans.push(mean);
  }

  const columnStdDeviations = [];
  for (let col = 0; col < matrix[0].length; col++) {
    let squaredDiffSum = 0;
    for (let row = 0; row < matrix.length; row++) {
      const diff = matrix[row][col] - columnMeans[col];
      squaredDiffSum += diff * diff;
    }
    const variance = squaredDiffSum / matrix.length;
    const stdDeviation = Math.sqrt(variance);
    columnStdDeviations.push(stdDeviation);
  }
  for (let col = 0; col < matrix[0].length; col++) {
    for (let row = 0; row < matrix.length; row++) {
      matrix[row][col] = (matrix[row][col] - columnMeans[col]) / columnStdDeviations[col];      
    }
  }

  return matrix;
}


function multiply(a, b) {
  var aNumRows = a.length, aNumCols = Object.values(a[0]).length,
       bNumCols = Object.values(b[0]).length,
      m = new Array(aNumRows); 

  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); 
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;   
      for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += Object.values(a[r])[i] * Object.values(b[i])[c];            
      }      
    }
         
  }
  m = normalizardatos(m);
  return m;
}

window.pintarGrafico = function(archive,matrix){
  if(archive == null){
    archive = archivo_actual;
  }else{
    archivo_actual = archive;
  }
  var burbujas = document.querySelector('#bubblesrealdata');
  var m  = multiply(archive,matrix);
  burbujas.setAttribute('bubbles-simplified',{'axis':true,'data':JSON.stringify(m),'dataMatrix':JSON.stringify(matrix)});
}


AFRAME.registerComponent('multiply-matrix', {
    schema:{
        archivo: { type:'string',default:''},
        matriz: { type: 'string',default:''}
    },
    init: function(){
      //cambio altura
      this.el.setAttribute('geometry','height', 0.05);
      //fin cambio altura
      var  archivo = this.data.archivo;
      var  matrizdato = this.data.matriz;

      

      this.el.addEventListener('click', function(){

            fetch(archivo)
              .then(function(response) {
                return response.json();
              })
              .then(function(archive) {
                fetch(matrizdato)
                  .then(function(response) {
                    return response.json();
                  })
                  .then(function(matrix) {
                    pintarGrafico(archive,matrix);
                  });
              });     
      })      
    }             
  });



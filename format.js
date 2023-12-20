let archivos =[];
let archivo_actual;
let num_grafico= 0;
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

window.pintarGrafico = function(archive,matrix,myEntityId,myMirrorId){
  var burbujas;
  var graficosOnScreen = Array.from(document.querySelectorAll('[bubbles-star-coordinates]')).filter(element => element.getAttribute('bubbles-star-coordinates').onMirror != true);
  if(myEntityId && graficosOnScreen.length>1){
    //Tendremos más de un gráfico en la escena
    burbujas = document.querySelector('#'+myEntityId);
    if(archive == null || burbujas.getAttribute('numero')){
      archive = archivos[burbujas.getAttribute('numero')];
    }else{
      archivos[num_grafico] = archive;
      burbujas.setAttribute('numero',num_grafico);
      num_grafico++;
    }
  }else{
    //Solo tenemos un gráfico en la escena
    burbujas = document.querySelector('[bubbles-star-coordinates]'); 
    if(archive == null ){
      archive = archivo_actual;
   }else{
      archivo_actual = archive;
   }
    
  }
  var m  = multiply(archive,matrix);
  burbujas.setAttribute('bubbles-star-coordinates',{'graphicPosition':myEntityId,'mirrorPosition':myMirrorId,'axis':true,'data':JSON.stringify(m),'dataMatrix':JSON.stringify(matrix)});
}


AFRAME.registerComponent('toprint-config', {
    schema:{
        myMirrorId:{type:'string'},
        myEntityId:{type:'string'},
        withButton:{type:'boolean',default:false},
        archivo: { type:'string',default:''},
        matriz: { type: 'string',default:''}
    },
    init: function(){
      var  archivo = this.data.archivo;
      var  matriz = this.data.matriz;
      var  myEntityId = this.data.myEntityId;
      var  myMirrorId = this.data.myMirrorId;
      var  withButton = this.data.withButton;
      if(withButton){
        this.el.addEventListener('click', function(){
          formatfiles(archivo,matriz,myEntityId,myMirrorId);
        })    
      }else{
        formatfiles(archivo,matriz,myEntityId,myMirrorId);
      }
        
    }             
  });

function formatfiles(archivo,matriz,myEntityId,myMirrorId){
  fetch(archivo)
    .then(function(response) {
      return response.json();
    })
    .then(function(archive) {
      fetch(matriz)
        .then(function(response) {
          return response.json();
        })
        .then(function(matrix) {
          pintarGrafico(archive,matrix,myEntityId,myMirrorId);
        });
    }); 
}

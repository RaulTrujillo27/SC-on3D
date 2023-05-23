function multiply(a, b) {
  var aNumRows = a.length, aNumCols = Object.values(a[0]).length,
      bNumRows = b.length, bNumCols = Object.values(b[0]).length,
      m = new Array(aNumRows);  // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols+1); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;             // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += Object.values(a[r])[i] * Object.values(b[i])[c];            
      }      
    }
    m[r][3] =1; 
    m[r] = Object.assign({},m[r]);
  }
  return m;
}
AFRAME.registerComponent('multiply-matrix', {
    schema:{
        archivo: { type:'string',defaul:''},
        matriz: { type: 'string',default:''}  
    },
    init: function(){
      var  archivo = this.data.archivo;
      var  matriz = this.data.matriz;
      this.el.addEventListener('click', function(){
            //------------------------------------------------- 
            var eso = this;
            var burbujas = document.querySelector('#bubblesrealdata');
            //var datos1 = document.querySelectorAll('[babia-queryjson]');
            //burbujas.setAttribute('babia-bubbles','from',datos1[1].id);
            //-------------------------------------------------     
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
                    var m  = multiply(archive,matrix);
                    burbujas.setAttribute('babia-bubbles','data',JSON.stringify(m));
                  });
              });
            
      })
      
    }             
  });


let finalPosition;
var libre = true;
var previousBubblePosition;
AFRAME.registerComponent('cambiar-posicion', {
  schema:{
    previousBubblePositionVec: { type:'string',default:''}
  },
  init: function () {
    this.grabbed = false;
    
    this.previousMousePosition = { x: 0, y: 0 };
    
    /*if(libre){
      previousBubblePosition= this.el.getAttribute('position');
      libre = false;
      console.log("libre si");
    }else{
      console.log("libre no");
    }*/
    

    window.addEventListener('mousemove', (event1) => {
      this.el.addEventListener('mousedown', (event) => {
        
        this.grabbed = true;
        this.previousMousePosition.x = event1.clientX;
        this.previousMousePosition.y = event1.clientY;
      });
      
    });
    
    window.addEventListener('mousemove', (event) => {
      if (this.grabbed) {
        const currentMousePosition = { x: event.clientX, y: event.clientY };
        const currentPosition= this.el.getAttribute('position');
        
        const rotationSpeed = 0.25;
        const deltaMouseX = currentMousePosition.x - this.previousMousePosition.x;
        const deltaMouseY = currentMousePosition.y - this.previousMousePosition.y;
        
        
        this.el.setAttribute('position', {
          x: currentPosition.x + deltaMouseX * rotationSpeed,
          y: currentPosition.y - deltaMouseY * rotationSpeed,
          z: currentPosition.z - (deltaMouseX * rotationSpeed + deltaMouseY * rotationSpeed)*rotationSpeed
        });
        this.previousMousePosition = currentMousePosition;
      }
      
      
    });

    window.addEventListener('mouseup', () => {
      if(this.grabbed){
        this.grabbed = false;
        let finalPosition = this.el.getAttribute('position');
        let matrizdato = JSON.parse(document.querySelector('#burbujasmatriz').getAttribute('babia-bubbles').data);
        let previousBubblePosition = this.data.split(",");
        let num_burbuja = this.el.getAttribute('num_burbuja');
        let resta = {x: finalPosition.x -previousBubblePosition[0], y: finalPosition.y -previousBubblePosition[1] ,z: finalPosition.z - previousBubblePosition[2]};
        matrizdato[num_burbuja][0] = matrizdato[num_burbuja][0] + resta.x;
        matrizdato[num_burbuja][1] = matrizdato[num_burbuja][1] + resta.y;
        matrizdato[num_burbuja][2] = matrizdato[num_burbuja][2] + resta.z;
        window.crearproxyburbujas(matrizdato);
        window.pintarGrafico(null,matrizdato);
      }
    });
  }
  });

 
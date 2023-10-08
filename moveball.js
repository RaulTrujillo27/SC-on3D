let finalPosition;
var libre = true;
var previousBubblePosition;
AFRAME.registerComponent('cambiar-posicion', {
    update: function () {
      this.grabbed = false;
      
      this.previousMousePosition = { x: 0, y: 0 };
      
      if(libre){
        previousBubblePosition = this.el.getAttribute('position');
        libre = false;
     }

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
          
          finalPosition = currentPosition;
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
          let matrizdato = JSON.parse(document.querySelector('#burbujasmatriz').getAttribute('babia-bubbles').data);
          let num_burbuja = this.el.getAttribute('num_burbuja');
          let resta = {x: (finalPosition.x -previousBubblePosition.x)/previousBubblePosition.x , y: (finalPosition.y -previousBubblePosition.y)/previousBubblePosition.y ,z: (finalPosition.z - previousBubblePosition.z)/previousBubblePosition.z };    
          matrizdato[num_burbuja][0] = matrizdato[num_burbuja][0] * resta.x;
          matrizdato[num_burbuja][1] = matrizdato[num_burbuja][1] * resta.y;
          matrizdato[num_burbuja][2] = matrizdato[num_burbuja][2] * resta.z;
          console.log(matrizdato);
          window.pintarGrafico(null,matrizdato);
        }
      });
    }
  });
  

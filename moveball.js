
AFRAME.registerComponent('cambiar-posicion', {
    init: function () {
        this.grabbed = false;
        this.previousMousePosition = { x: 0, y: 0 };
    
        this.el.addEventListener('mousedown', (event) => {
          this.grabbed = true;
          this.previousMousePosition.x = event.detail.intersection.point.x;
          this.previousMousePosition.y = event.detail.intersection.point.y;
          console.log(this.previousMousePosition);
        });
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
            const rotationSpeed = 0.25;
            const deltaMouseX = currentMousePosition.x - this.previousMousePosition.x;
            const deltaMouseY = currentMousePosition.y - this.previousMousePosition.y;
            const deltaDiff = deltaMouseX -deltaMouseY;
            const currentPosition= this.el.getAttribute('position');
            this.el.setAttribute('position', {
              x: currentPosition.x + deltaMouseX * rotationSpeed,
              y: currentPosition.y - deltaMouseY * rotationSpeed,
              z: currentPosition.z - (deltaMouseX * rotationSpeed + deltaMouseY * rotationSpeed)*rotationSpeed
            });
            this.previousMousePosition = currentMousePosition;
            if(currentPosition!=null){
                
                console.log(currentPosition);
              }
          }
          
        });
    
        window.addEventListener('mouseup', () => {
          this.grabbed = false;
        });
      }
  });
  
      
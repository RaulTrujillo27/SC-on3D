AFRAME.registerComponent('rotate-on-grab', {
  init: function () {
    this.grabbed = false;
    this.previousMousePosition = { x: 0, y: 0 };

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
        const rotationSpeed = 1.5;
        const deltaMouseX = currentMousePosition.x - this.previousMousePosition.x;
        const deltaMouseY = currentMousePosition.y - this.previousMousePosition.y;
        const currentRotation = this.el.getAttribute('rotation');
        this.el.setAttribute('rotation', {
          x: currentRotation.x + deltaMouseY * rotationSpeed,
          y: currentRotation.y + deltaMouseX * rotationSpeed,
          z: currentRotation.z 
        });
        this.previousMousePosition = currentMousePosition;
      }
    });

    window.addEventListener('mouseup', () => {
      this.grabbed = false;
    });
  }
});

AFRAME.registerComponent('upanddown-on-grab', {
  init: function () {
    this.grabbed = false;
    this.previousMousePosition = { x: 0, y: 0 };

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
        const rotationSpeed = 0.025;
        const deltaMouseX = currentMousePosition.x - this.previousMousePosition.x;
        const deltaMouseY = this.previousMousePosition.y - currentMousePosition.y;
        const currentPosition = this.el.getAttribute('position');
        var positionY = currentPosition.y + deltaMouseY * rotationSpeed;
        if(positionY>1.5){
          positionY = 1.5;
        }else if(positionY<-1.5){
          positionY= -1.5;
        }
        this.el.setAttribute('position', {
          x: currentPosition.x,
          y: positionY,
          z: currentPosition.z 
        });
        this.previousMousePosition = currentMousePosition;
      }
    });

    window.addEventListener('mouseup', () => {
      this.grabbed = false;
    });
  }
});
 
    

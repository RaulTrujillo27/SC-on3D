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
  schema:{
      axis: { type:'string',default:''}
  },
  init: function () {
    this.grabbed = false;
    this.previousMousePosition = { x: 0, y: 0 };

    window.addEventListener('mousemove', (event1) => {
      this.el.addEventListener('mousedown', (event) => {
        this.grabbed = true;
        //document.querySelector('#camera').setAttribute('mouseEnabled', 'false');
        this.previousMousePosition.x = event1.clientX;
        this.previousMousePosition.y = event1.clientY;
      });
    });
    
    
    window.addEventListener('mousemove', (event) => {
      if (this.grabbed) {
        const currentMousePosition = { x: event.clientX, y: event.clientY };
        const rotationSpeed = 0.01;
        const deltaMouseX =  currentMousePosition.x - this.previousMousePosition.x;
        const deltaMouseY = this.previousMousePosition.y - currentMousePosition.y;
        const currentPosition = this.el.getAttribute('position');
        var newPositionX = currentPosition.x + deltaMouseX * rotationSpeed;
        var newPositionY = currentPosition.y + deltaMouseY * rotationSpeed;
        var positionX = currentPosition.x;
        var positionY = currentPosition.y;
        if(this.data.axis == 'x'){
          if(newPositionX<1 && newPositionX>0){
            positionX = newPositionX;
          }
        }else{
          if(newPositionY<1 && newPositionY>0){
            positionY = newPositionY;
          }
        }
        this.el.setAttribute('position', {
          x: positionX,
          y: positionY,
          z: currentPosition.z 
        });
        this.previousMousePosition = currentMousePosition;
      }
    });

    window.addEventListener('mouseup', () => {
      if(this.grabbed){
        var position = this.el.getAttribute('position');
        var posAnt = this.el.getAttribute('posicion-anterior');
        var scalebubbles = document.querySelector('#bubblesrealdata').getAttribute('scale');
        document.querySelector('#bubblesrealdata').setAttribute('scale',{
          x:scalebubbles.x + (position.x - posAnt.x)*0.2,
          y:scalebubbles.y + (position.y - posAnt.y)*0.2,
          z:scalebubbles.z + (position.z - posAnt.z)
        });
        this.el.setAttribute('posicion-anterior',{
          x:position.x,
          y:position.y,
          z:position.z
        });
      }
      //document.querySelector('#camera').setAttribute('mouseEnabled', 'true');
      this.grabbed = false;
    });
  }
});


 
    

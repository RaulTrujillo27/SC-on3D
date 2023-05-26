AFRAME.registerComponent('rotate-on-grab', {
  init: function () {
    this.grabbed = false;
    this.previousMousePosition = { x: 0, y: 0 };

    this.el.addEventListener('mousedown', (event) => {
      this.grabbed = true;
      this.previousMousePosition.x = event.detail.intersection.point.x;
      this.previousMousePosition.y = event.detail.intersection.point.y;
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



AFRAME.registerComponent('axis-move', {
  schema:{
      axis: { type:'string',default:''},

  },
  init: function () {
    
  },
  tick: function(){
    let positionActual = this.el.getAttribute('position');
    if(this.data.axis =='x'){
      this.el.setAttribute('position',{
        x : positionActual.x>1  ? 1 : (positionActual.x<0 ? 0 : this.el.getAttribute('position').x),
        y : this.el.getAttribute('posicion-anterior').y,
        z : this.el.getAttribute('posicion-anterior').z
      });
    }else if(this.data.axis =='y'){
      this.el.setAttribute('position',{
        x : this.el.getAttribute('posicion-anterior').x,
        y : positionActual.y>1  ? 1 : (positionActual.y<0 ? 0 : this.el.getAttribute('position').y),
        z : this.el.getAttribute('posicion-anterior').z
      });
    }else{
      this.el.setAttribute('position',{
        x : this.el.getAttribute('posicion-anterior').x,
        y : this.el.getAttribute('posicion-anterior').y,
        z : positionActual.z>1  ? 1 : (positionActual.z<0 ? 0 : this.el.getAttribute('position').z),
      });
    }

    if(this.el.components.grabbable.grabbed){
      this.isGrabbed=true;
    }
    if(!this.el.components.grabbable.grabbed && this.isGrabbed){
      this.isGrabbed=false;
      var position = this.el.getAttribute('position');
      var posAnt = this.el.getAttribute('posicion-anterior');
      var scalebubbles = document.querySelector('#bubblesrealdata').getAttribute('scale');
      document.querySelector('#bubblesrealdata').setAttribute('scale',{
        x:scalebubbles.x + (position.x - posAnt.x)*0.2,
        y:scalebubbles.y + (position.y - posAnt.y)*0.2,
        z:scalebubbles.z + (position.z - posAnt.z)*0.2
      });
      this.el.setAttribute('posicion-anterior',{
        x:position.x,
        y:position.y,
        z:position.z
      });
    }
  }
});
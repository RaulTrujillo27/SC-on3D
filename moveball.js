
AFRAME.registerComponent('recalculate-graphic', {
  schema:{
    mirrorPositionId:{type:'string'}
  },
  init: function () {
    this.isGrabbed=false;
  },

  tick: function(){
    if(this.el.components.grabbable.grabbed){
      this.isGrabbed=true;
    }
    if(!this.el.components.grabbable.grabbed && this.isGrabbed || this.el.getAttribute('refrescar')){
      this.el.setAttribute('refrescar',false)
      this.isGrabbed=false;
      let finalPosition = this.el.getAttribute('position');
      let previousBubblePosition = this.el.getAttribute('posicionInicial').split(",");
      if(finalPosition.x!=previousBubblePosition[0] ||finalPosition.y!=previousBubblePosition[1] ||finalPosition.z!=previousBubblePosition[2]){
        let matrizdato = JSON.parse(this.el.parentEl.parentEl.getAttribute('bubbles-star-coordinates').dataMatrix);
        let num_burbuja = this.el.getAttribute('num-burbuja');
        let proportionX = this.el.getAttribute('proportionX');
        let proportionY = this.el.getAttribute('proportionY');
        let proportionZ = this.el.getAttribute('proportionZ');
        let resta = {x: finalPosition.x -previousBubblePosition[0], y: finalPosition.y -previousBubblePosition[1] ,z: finalPosition.z - previousBubblePosition[2]};
        matrizdato[num_burbuja][0] = matrizdato[num_burbuja][0] + resta.x/proportionX;
        matrizdato[num_burbuja][1] = matrizdato[num_burbuja][1] + resta.y/proportionY;
        matrizdato[num_burbuja][2] = matrizdato[num_burbuja][2] + resta.z/proportionZ;
        let mpId= this.data.mirrorPositionId;
        if(this.data.mirrorPositionId){
          document.querySelector('#espejo'+mpId).remove();
        }
        window.pintarGrafico(null,matrizdato,this.el.parentEl.parentEl.getAttribute('id'));
      }
      
    }
  }
  
});

AFRAME.registerComponent('mirror-positioning', {
  schema:{
    repositionEntityId:{type:'string'}
  },
  init: function () {
    var mirrorBubbles;
    let repositionated = this.data.repositionEntityId;
    if(repositionated){
      mirrorBubbles = document.querySelector('#'+repositionated).querySelectorAll('[num-burbuja="'+this.el.getAttribute('num-burbuja')+'"]');
    }else{
      mirrorBubbles = this.el.parentEl.parentEl.parentEl.parentEl.querySelectorAll('[num-burbuja="'+this.el.getAttribute('num-burbuja')+'"]');
    }
    let el = this.el;
    let value;
    mirrorBubbles.forEach(function(entity) {
      if(entity.getAttribute('radius') != el.getAttribute('radius')){
        value = entity;
      } 
    });
    this.mirror = value;
    this.isGrabbed=false;
  },

  tick: function(){
    if(this.el.components.grabbable.grabbed){
      
      this.isGrabbed=true;
      let bubblePosition =this.el.getAttribute('position');
      
      this.mirror.setAttribute('position',{
        x:(bubblePosition.x/this.el.getAttribute('proportionX'))*this.mirror.getAttribute('proportionX'),
        y:(bubblePosition.y/this.el.getAttribute('proportionY'))*this.mirror.getAttribute('proportionY'),
        z:(bubblePosition.z/this.el.getAttribute('proportionZ'))*this.mirror.getAttribute('proportionZ')
      });
    }
    if(!this.el.components.grabbable.grabbed && this.isGrabbed){
      this.mirror.setAttribute('refrescar',true);


      this.isGrabbed=false;
    }
  }
});


 
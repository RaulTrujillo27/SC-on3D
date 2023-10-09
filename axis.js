function create_button(axis){
    let axisButton = document.createElement('a-box');
    axis.appendChild(axisButton);
    axisButton.setAttribute('height',0.1);
    axisButton.setAttribute('depth',0.1);
    axisButton.setAttribute('width',0.1);
    return axisButton;
}

AFRAME.registerComponent('create-axis', {

    init: function () {
        let xAxisEl = document.createElement('a-entity');
        this.el.appendChild(xAxisEl);
        let xAxisButton = create_button(xAxisEl);
              
        xAxisButton.setAttribute('upanddown-on-grab','axis:x');
        xAxisButton.setAttribute('position',{x:0.25,y:0,z:0});
        xAxisButton.setAttribute('posicion-anterior',{x:0.25,y:0,z:0});
        xAxisEl.setAttribute('babia-axis-x',{'length': 1,'palette': this.data.palette});
        xAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});
        
  
        let yAxisEl = document.createElement('a-entity');
        this.el.appendChild(yAxisEl);
        let yAxisButton = create_button(yAxisEl);
        yAxisButton.setAttribute('upanddown-on-grab','axis:y');
        yAxisButton.setAttribute('position',{x:0,y:0.25,z:0});
        yAxisButton.setAttribute('posicion-anterior',{x:0,y:0.25,z:0});
        yAxisEl.setAttribute('babia-axis-y',{'length': 1});
        yAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});
  
        let zAxisEl = document.createElement('a-entity');
        this.el.appendChild(zAxisEl);
        let zAxisButton = create_button(zAxisEl);
        zAxisButton.setAttribute('position',{x:0,y:0,z:0.25});
        zAxisButton.setAttribute('posicion-anterior',{x:0,y:0,z:0.25});
        zAxisEl.setAttribute('babia-axis-z',{'length': 1});
        zAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});

        

    }
});

AFRAME.registerComponent('posicion-anterior', {
    
  
    init: function () {
      
    }
  }); 

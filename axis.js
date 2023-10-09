AFRAME.registerComponent('create-axis', {
    

    init: function () {
        let xAxisEl = document.createElement('a-entity');
        this.el.appendChild(xAxisEl);
        console.log(this.el);
        let ticks = [0.1,0.2,0.3,0.4,0.5];
        xAxisEl.setAttribute('babia-axis-x',{'labels':[1,2,5,10,20],'ticks':ticks,'length': 1,'palette': this.data.palette});
        xAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});
  
        let yAxisEl = document.createElement('a-entity');
        this.el.appendChild(yAxisEl);
        yAxisEl.setAttribute('babia-axis-y',{'length': 1});
        yAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});
  
        let zAxisEl = document.createElement('a-entity');
        this.el.appendChild(zAxisEl);
        zAxisEl.setAttribute('babia-axis-z',{'labels':[1,2,5,10,20],'ticks':ticks,'length': 1});
        zAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});

        

    }
});

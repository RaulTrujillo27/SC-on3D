
AFRAME.registerComponent('bubbles-simplified', {
    schema: {
        data: { type: 'string' },
        dataMatrix: {type:'string'},
        height: { type: 'string', default: 'height' },
        x_axis: { type: 'string', default: 'x_axis' },
        z_axis: { type: 'string', default: 'z_axis' },
        color: {type:'string',default:'#7C93C3'},
        colorMatrix: {type:'string',default:'#c1121f'},
        from: { type: 'string' },
        legend: { type: 'boolean' },
        legend_lookat: { type: 'string', default: "[camera]" },
        legend_scale: { type: 'number', default: 1 },
        axis: { type: 'boolean', default: true },
        heightMax: { type: 'number' ,default:10},
        lengthMax: { type: 'number' ,default:10},
        widthMax: { type: 'number' ,default:10},
        radiusMax: { type: 'number' },
        mirror:{type:'boolean',default:false},
        onMirror:{type:'boolean',default:false}
    },
    
    visProperties: ['height', 'radius', 'x_axis', 'z_axis'],

        init: function () {
            
        },

    /**
    * Called when component is attached and when component data changes.
    * Generally modifies the entity based on the data.
    */

    update: function (oldData) {
        updateFunction(this, oldData)
    },

    /**
     * Where the data is gonna be stored
     */
    newData: undefined,

    newDataMatrix: undefined,

    /*
    * Update chart
    */
    updateChart: function () {
        const dataToPrint = this.newData;
        const dataToPrintMatrix = this.newDataMatrix;
        const data = this.data;
        const el = this.el;
        const color = data.color;
        const colorMatrix = data.colorMatrix;
        let onMirror =  data.onMirror;
    
        let heightMax = data.heightMax
        let lengthMax = data.lengthMax
        let widthMax = data.widthMax
        let radiusMax = data.radiusMax

        let xLabels = [];
        let zLabels = [];
        let stepX = 0
        let stepZ = 0
        let radius = 1
        let valueMaxXData = 0;
        let valueMaxYData = 0;
        let valueMaxZData = 0;
        let valueMaxXMatrix = 0;
        let valueMaxYMatrix = 0;
        let valueMaxZMatrix = 0;
        if(dataToPrint.length>0){
            valueMaxXData = Math.max(Math.abs(Math.max.apply(Math, dataToPrint.map(function (o) { return o[data.x_axis]; }))),Math.abs(Math.min.apply(Math, dataToPrint.map(function (o) { return o[data.x_axis]; }))))
            valueMaxYData = Math.max(Math.abs(Math.max.apply(Math, dataToPrint.map(function (o) { return o[data.height]; }))),Math.abs(Math.min.apply(Math, dataToPrint.map(function (o) { return o[data.height]; }))))      
            valueMaxZData = Math.max(Math.abs(Math.max.apply(Math, dataToPrint.map(function (o) { return o[data.z_axis]; }))),Math.abs(Math.min.apply(Math, dataToPrint.map(function (o) { return o[data.z_axis]; }))))
            
        }
        if(dataToPrintMatrix.length>0){
            valueMaxXMatrix = Math.max(Math.abs(Math.max.apply(Math, dataToPrintMatrix.map(function (o) { return o[data.x_axis]; }))),Math.abs(Math.min.apply(Math, dataToPrintMatrix.map(function (o) { return o[data.x_axis]; }))))
            valueMaxYMatrix = Math.max(Math.abs(Math.max.apply(Math, dataToPrintMatrix.map(function (o) { return o[data.height]; }))),Math.abs(Math.min.apply(Math, dataToPrintMatrix.map(function (o) { return o[data.height]; }))))      
            valueMaxZMatrix = Math.max(Math.abs(Math.max.apply(Math, dataToPrintMatrix.map(function (o) { return o[data.z_axis]; }))),Math.abs(Math.min.apply(Math, dataToPrintMatrix.map(function (o) { return o[data.z_axis]; }))))  
        }
        let valueMaxX = Math.max(valueMaxXData,valueMaxXMatrix);
        let valueMaxY = Math.max(valueMaxYData,valueMaxYMatrix);
        let valueMaxZ = Math.max(valueMaxZData,valueMaxZMatrix);

        proportionX = lengthMax / valueMaxX
        proportionY = heightMax / valueMaxY
        proportionZ = widthMax / valueMaxZ

        
        if (!radiusMax) {
            radiusMax = radius
        }

        radius_scale = radiusMax / radius
        this.chartEl = document.createElement('a-entity');
        this.chartEl.classList.add('babiaxrChart')
        el.appendChild(this.chartEl)
    
        
        if(this.data.mirror && dataToPrintMatrix.length>0){
            this.data.mirror=false;
            let mirrorSpace = document.createElement('a-box');
            el.appendChild(mirrorSpace);
            mirrorSpace.setAttribute('opacity',0.1);
            mirrorSpace.setAttribute('width',widthMax/2);
            mirrorSpace.setAttribute('height',heightMax/2);
            mirrorSpace.setAttribute('depth',lengthMax/2);
            mirrorSpace.setAttribute('position',{
                x:lengthMax+mirrorSpace.getAttribute('width')/2,
                y:-heightMax+mirrorSpace.getAttribute('width')/2,
                z:lengthMax+mirrorSpace.getAttribute('depth')/2
            });
            let espejo = document.createElement('a-entity');
            mirrorSpace.appendChild(espejo);
            espejo.setAttribute('bubbles-simplified',{'radiusMax': radiusMax/2, 'heightMax':heightMax/4, 'lengthMax':lengthMax/4, 
                'widthMax':widthMax/4,'data':[],'dataMatrix':data.dataMatrix,'x_axis': 0, 'z_axis': 2, 'height': 1,'onMirror':true});
            this.data.mirror=true;
        }
        
        let i = 0;
        for (let bubble of dataToPrintMatrix) {
            let xLabel = bubble[data.x_axis]
            let zLabel = bubble[data.z_axis]
            let height = bubble[data.height]
            
                
            stepX = xLabel * proportionX
            xLabels.push(xLabel)
               
            stepZ = zLabel * proportionZ
            zLabels.push(zLabel)

            
            
            let bubbleEntity = generateBubble(height,radius, stepX, stepZ, proportionX, proportionY, proportionZ, radius_scale, colorMatrix);
            this.chartEl.appendChild(bubbleEntity);
            if(onMirror){
                bubbleEntity.setAttribute('mirror-positioning','');
            }else{
                bubbleEntity.setAttribute('posicionInicial',bubbleEntity.components.position.attrValue.x +"," + bubbleEntity.components.position.attrValue.y  +"," + bubbleEntity.components.position.attrValue.z );
                bubbleEntity.setAttribute('recalculate-graphic','');
            }
            setTimeout(setGrabbable(bubbleEntity),5000);
            bubbleEntity.setAttribute('num-burbuja',i);
            i++;
            //Prepare legend
            if (data.legend) {
               showLegend(data, bubbleEntity, bubble, el)
            }
        }
        for (let bubble of dataToPrint) {
            let xLabel = bubble[data.x_axis]
            let zLabel = bubble[data.z_axis]
            let height = bubble[data.height]
            
                
            stepX = xLabel * proportionX
            

            xLabels.push(xLabel)
            //xTicks.push(stepX)
               
            stepZ = zLabel * proportionZ
             
            zLabels.push(zLabel)
            //zTicks.push(stepZ)
    
            
            let bubbleEntity = generateBubble(height,radius, stepX, stepZ,proportionX,proportionY,proportionZ, radius_scale,color);
            this.chartEl.appendChild(bubbleEntity);
            
            //Prepare legend
            if (data.legend) {
               showLegend(data, bubbleEntity, bubble, el)
            }
        }
    
        //Print axis
        if (data.axis) {
            const lengthX = lengthMax
            const lengthZ = widthMax
            const lengthY = heightMax
            this.updateAxis(lengthX,lengthZ,lengthY);
        }
    },
    /*
    * Update axis
    */
    updateAxis: function(lengthX, lengthZ, lengthY) {
        let xAxisEl = document.createElement('a-entity');
        this.chartEl.appendChild(xAxisEl);
        xAxisEl.setAttribute('axis-x',{'length': lengthX});
        xAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});
  
        let yAxisEl = document.createElement('a-entity');
        this.chartEl.appendChild(yAxisEl);
        yAxisEl.setAttribute('axis-y',{'length': lengthY});
        yAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});
  
        let zAxisEl = document.createElement('a-entity');
        this.chartEl.appendChild(zAxisEl);
        zAxisEl.setAttribute('axis-z',{'length': lengthZ});
        zAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});
    },

    /*
    * Process data obtained from producer
    */
    processData: function (data,dataMatrix) {
        this.newData = data;
        this.newDataMatrix = dataMatrix;
        while (this.el.firstChild)
            this.el.firstChild.remove();
        this.updateChart()
    }
})


function setGrabbable(burbuja){
    burbuja.setAttribute('grabbable','');
    
}

function generateBubble( height, radius, positionX, positionZ, proportionX, proportionY, proportionZ, radius_scale, color) {
    if (proportionY) {
        height = proportionY * height
    }
    if (radius_scale) {
        radius = radius_scale * radius
    }
    let entity = document.createElement('a-sphere');
    entity.setAttribute('radius', radius);
    entity.setAttribute('color',color);
    entity.setAttribute('proportionX',proportionX);
    entity.setAttribute('proportionY',proportionY);
    entity.setAttribute('proportionZ',proportionZ);
    entity.setAttribute('position', { x: positionX, y: height, z: positionZ });

    return entity;
}

function generateLegend(data, bubble, bubbleEntity) {
    let text = 'Length:' + bubble[data.x_axis] + '\nHeight:' + bubble[data.height] + '\nWidth:' + bubble[data.z_axis];

    let width = 2;
    if (text.length > 16)
        width = text.length / 8;

    let bubblePosition = bubbleEntity.getAttribute('position')
    let bubbleRadius = parseFloat(bubbleEntity.getAttribute('radius'))
    let entity = document.createElement('a-plane');
    entity.setAttribute('position', {
        x: bubblePosition.x, 
        y: bubblePosition.y + bubbleRadius + 0.1,
        z: bubblePosition.z + 0.1
    });
    entity.setAttribute('rotation', { x: 0, y: 0, z: 0 });
    entity.setAttribute('height', '1');
    entity.setAttribute('width', width);
    entity.setAttribute('color', 'white');
    entity.setAttribute('text', {
        'value': text,
        'align': 'center',
        'width': 6,
        'color': 'black'
    });
    entity.classList.add("babiaxrLegend")
    entity.setAttribute('babia-lookat', data.legend_lookat);
    entity.setAttribute('scale',{x: data.legend_scale, y: data.legend_scale, z: data.legend_scale});
    return entity;
}

function showLegend(data, bubbleEntity, bubble, element) {
    bubbleEntity.addEventListener('mouseenter', function () {
        this.setAttribute('scale', { x: 1.1, y: 1.1, z: 1.1 });
        legend = generateLegend(data, bubble, bubbleEntity);
        element.appendChild(legend);
    });

    bubbleEntity.addEventListener('mouseleave', function () {
        this.setAttribute('scale', { x: 1, y: 1, z: 1 });
        element.removeChild(legend);
    });
}
let parseJson = (json) => {
    let object;
    if (typeof (json) === 'string' || json instanceof String) {
        object = JSON.parse(json);
    } else {
        object = json;
    };
    return object;
}

let updateFunction = (self, oldData) => {
    let data = self.data;
    let el = self.el;

    if (data.data && oldData.data !== data.data || data.dataMatrix && oldData.dataMatrix !== data.dataMatrix) {
        let _data = parseJson(data.data);
        let _dataMatrix = parseJson(data.dataMatrix);
        self.processData(_data,_dataMatrix);
    } else if (data.from !== oldData.from) {
        if (self.slice_array) {
            self.slice_array = [];
        }
        // Unregister from old producer
        if (self.prodComponent) {
            self.prodComponent.notiBuffer.unregister(self.notiBufferId);
        };
        self.prodComponent = findProdComponent(data, el);
        if (self.prodComponent.notiBuffer) {
            self.notiBufferId = self.prodComponent.notiBuffer
                .register(self.processData.bind(self));
        }
    }
    // If changed whatever, re-print with the current data
    else if (data !== oldData && self.newData || data !== oldData && self.newDataMatrix) {
        if (self.slice_array) {
            self.slice_array = [];
        }
        if (self.bar_array) {
            self.bar_array = [];
        }
        self.processData(self.newData,self.newDataMatrix);
    }
}

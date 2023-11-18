
AFRAME.registerComponent('bubbles-simplified', {
    schema: {
        data: { type: 'string' },
        height: { type: 'string', default: 'height' },
        x_axis: { type: 'string', default: 'x_axis' },
        z_axis: { type: 'string', default: 'z_axis' },
        from: { type: 'string' },
        legend: { type: 'boolean' },
        legend_lookat: { type: 'string', default: "[camera]" },
        legend_scale: { type: 'number', default: 1 },
        axis: { type: 'boolean', default: true },
        heightMax: { type: 'number' },
        radiusMax: { type: 'number' },
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

    /*
    * Update chart
    */
    updateChart: function () {
        const dataToPrint = this.newData;
        const data = this.data;
        const el = this.el;
    
        let heightMax = data.heightMax
        let radiusMax = data.radiusMax

        let xLabels = [];
        let xTicks = [];
        let zLabels = [];
        let zTicks = [];
        let stepX = 0
        let stepZ = 0
        let radius = 1
    
        let maxX = 0
        let maxZ = 0
    
    
        let valueMax = Math.max.apply(Math, dataToPrint.map(function (o) { return o[data.height]; }))
        if (!heightMax) {
            heightMax = valueMax
        }
        proportion = heightMax / valueMax

        if (!radiusMax) {
            radiusMax = radius
        }
        radius_scale = radiusMax / radius
        this.chartEl = document.createElement('a-entity');
        this.chartEl.classList.add('babiaxrChart')
        el.appendChild(this.chartEl)
    
            maxX = 1 * radius_scale;
            maxZ = 1 * radius_scale;

    
        for (let bubble of dataToPrint) {
            let xLabel = bubble[data.x_axis]
            let zLabel = bubble[data.z_axis]
            let height = bubble[data.height]
            
                
            stepX = xLabel * proportion


            xLabels.push(xLabel)
            //xTicks.push(stepX)
               
            stepZ = zLabel * proportion
            
            zLabels.push(zLabel)
            //zTicks.push(stepZ)
    
            if (stepX > maxX){
                maxX = stepX
            }
            if (stepZ > maxZ){
                maxZ = stepZ
            }
    
            let bubbleEntity = generateBubble(height,radius, stepX, stepZ,proportion, radius_scale);
            this.chartEl.appendChild(bubbleEntity);
            
            //Prepare legend
            if (data.legend) {
               showLegend(data, bubbleEntity, bubble, el)
            }
        }
    
        //Print axis
        if (data.axis) {
            const lengthX = maxX
            const lengthZ = maxZ
            const lengthY = heightMax
            this.updateAxis([], xTicks, lengthX, [], zTicks, lengthZ, valueMax, lengthY);
        }
    },

    /*
    * Update axis
    */
    updateAxis: function(xLabels, xTicks, lengthX, zLabels, zTicks, lengthZ, valueMax, lengthY) {
        let xAxisEl = document.createElement('a-entity');
        this.chartEl.appendChild(xAxisEl);
        xAxisEl.setAttribute('babia-axis-x',{'labels': xLabels, 'ticks': xTicks, 'length': lengthX});
        xAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});
  
        let yAxisEl = document.createElement('a-entity');
        this.chartEl.appendChild(yAxisEl);
        yAxisEl.setAttribute('babia-axis-y',{'maxValue': valueMax, 'length': lengthY});
        yAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});
  
        let zAxisEl = document.createElement('a-entity');
        this.chartEl.appendChild(zAxisEl);
        zAxisEl.setAttribute('babia-axis-z',{'labels': zLabels, 'ticks': zTicks, 'length': lengthZ});
        zAxisEl.setAttribute('position', {x: 0, y: 0, z: 0});

        if (this.data.axis_name){
            xAxisEl.setAttribute('babia-axis-x', 'name', this.data.x_axis);
            yAxisEl.setAttribute('babia-axis-y', 'name', this.data.height);
            zAxisEl.setAttribute('babia-axis-z', 'name', this.data.z_axis);
        }
    },

    /*
    * Process data obtained from producer
    */
    processData: function (data) {
        this.newData = data;
        while (this.el.firstChild)
            this.el.firstChild.remove();
        this.updateChart()
    }
})


function generateBubble(height, radius,positionX, positionZ, proportion, radius_scale) {
    if (proportion || radius_scale) {
        if (proportion) {
            height = proportion * height
        }
        if (radius_scale) {
            radius = radius_scale * radius
        }
    }
    let entity = document.createElement('a-sphere');
    entity.setAttribute('radius', radius);
    entity.setAttribute('color','#7C93C3');
    entity.setAttribute('proportion',proportion);
    entity.setAttribute('position', { x: positionX, y: height, z: positionZ });

    return entity;
}

function generateLegend(data, bubble, bubbleEntity) {
    let text = bubble[data.x_axis] + ': \n Radius:' + bubble[data.radius] + '\nHeight:' + bubble[data.height];

    let width = 2;
    if (text.length > 16)
        width = text.length / 8;

    let bubblePosition = bubbleEntity.getAttribute('position')
    let bubbleRadius = parseFloat(bubbleEntity.getAttribute('radius'))
    let entity = document.createElement('a-plane');
    entity.setAttribute('position', {
        x: bubblePosition.x, y: bubblePosition.y + bubbleRadius + 1,
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

    if (data.data && oldData.data !== data.data) {
        let _data = parseJson(data.data);
        self.processData(_data);
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
    else if (data !== oldData && self.newData) {
        if (self.slice_array) {
            self.slice_array = [];
        }
        if (self.bar_array) {
            self.bar_array = [];
        }
        self.processData(self.newData);
    }
}

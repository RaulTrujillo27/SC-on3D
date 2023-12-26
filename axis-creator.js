class Axis {

    constructor(el, axis) {
        this.el = el;
        this.axis = axis;
    }

    updateLine(length) {
        const axis = this.axis;
        const el = this.el;

        const comp = `line__${axis}axis`
        let end = { x: 0, y: 0, z: 0};
        end[axis] = length;
        let start = { x: 0, y: 0, z: 0};
        start[axis] = -length;
        el.setAttribute(comp, {
            'start': start,
            'end': end,
            'color':'black'
        });


    };

    removeLabels() {
        const el = this.el;
        
        let labels = el.querySelectorAll('[text]');
        for (const label of labels) {
            
            label.remove();

        };
    };

    updateLabels(length,ticks, labels, align) {
        const axis = this.axis;
        let el = this.el;
        
        for (let i = 0; i < ticks.length; ++i) {
            let label = document.createElement('a-entity');
            label.setAttribute('text', {
                'value': labels[i],
                'align': 'right',
                'width': length*0.75,
                'opacity': 0,
                'color':'black'
            });
            let pos;
            if (axis === 'x') {
                if (align == 'behind'){
                    pos = { x: ticks[i], y: 0, z: 0.275*length };
                } else {
                    pos = { x: ticks[i], y: 0, z: 0.38*length };
                }
            } else if (axis === 'y') {
                if (align == "right"){
                    pos = { x: -0.3*length, y: ticks[i], z: 0 };
                } else {
                    pos = { x: -0.4*length, y: ticks[i], z: 0 };
                }
            } else if (axis === 'z'){
                if (align == "right"){
                    pos = { x: -0.3*length, y: 0, z: ticks[i] };
                } else {
                    pos = { x: -0.4*length, y: 0, z: ticks[i] };
                }
            }
            label.setAttribute('position', pos);
            if (axis === 'x') {
                label.setAttribute('rotation', { x: -90, y: 90, z: 0 });
            } else if (axis === 'z'){
                label.setAttribute('rotation', { x: -90, y: 0, z: 0 });
            }
            label.setAttribute('text', {'opacity': 1})
            //label.setAttribute('scale',scale);
            el.appendChild(label);
        };
    }
}
AFRAME.registerComponent('axis-y', {
    schema: {
        length: { type: 'number' },
        align: { type: 'string', default: 'left'},
        minSteps: { type: 'number', default: 10}
    },
 
    init: function() {
        this.axis = new Axis(this.el, 'y');
    },

    update: function (oldData) {
        const data = this.data;
        let length = this.data.length;
        let minSteps = this.data.minSteps;

        updateValues(this,data,length,oldData,minSteps);
        
    }
});      

AFRAME.registerComponent('axis-x', {
    schema: {
        length: { type: 'number' },
        align: { type: 'string', default: 'behind'},
        minSteps: { type: 'number', default: 10}
    },

    init: function() {
        this.axis = new Axis(this.el, 'x');
    },

    update: function (oldData) {
        const data = this.data;
        let length = this.data.length;
        let minSteps = this.data.minSteps;

        updateValues(this,data,length,oldData,minSteps);
     }

});


AFRAME.registerComponent('axis-z', {
    schema: {
        length: { type: 'number' },
        align: { type: 'string', default: 'left'},
        minSteps: { type: 'number', default: 10}
    },

    init: function() {
        this.axis = new Axis(this.el, 'z');
    },

    update: function (oldData) {
        const data = this.data;
        let length = this.data.length;
        let minSteps = this.data.minSteps;

        updateValues(this,data,length,oldData,minSteps);
     }

});

function updateValues(el,data,length,oldData,minSteps){
    if (length != oldData.length) {
            
        let step = length/minSteps;
        // Set axis line
        el.axis.updateLine(length);
        // Remove old labels
        el.axis.removeLabels();

        // Create new labels
        let ticks = [];
        let labels = [];
        let acum = step;
        while(acum <= length){
            ticks.push(acum);
            ticks.push(-acum);
            labels.push(acum.toFixed(2));
            labels.push((-acum).toFixed(2));
            acum += step;
        }
        el.axis.updateLabels(length,ticks, labels, data.align);
    };
}


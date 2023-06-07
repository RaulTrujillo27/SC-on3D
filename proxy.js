var encendido = true;
AFRAME.registerComponent('switch', {
    
    
    init: function () {
        this.el.addEventListener('click', function(){
            
            var proxy = document.querySelector("#proxys");

            if (encendido){
                this.setAttribute('color',"#ac242c");    
                           
                encendido =false;
                proxy.setAttribute('visible',encendido);
            }else{
                this.setAttribute('color',"#e1b020");
                encendido = true;
                proxy.setAttribute('visible',encendido);
            }
            

        })
    }
});

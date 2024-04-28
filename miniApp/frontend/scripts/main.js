let scheme = document.querySelector(".scheme");
let x, y;
let schemePaddingLeft = Number(window.getComputedStyle(scheme, null).getPropertyValue("padding-left").slice(0, -2)),
    schemePaddingTop = Number(window.getComputedStyle(scheme, null).getPropertyValue("padding-top").slice(0, -2));
let svg = null;
    
let connections = {
    "connecting": false,
    "connects" : []
};



let blockActivation = function(selector){
    let blocks = document.querySelectorAll(selector);
    let block = blocks[blocks.length - 1];
    
    block.onmousedown = function(event) {
        let blockSize = {
            "x": block.getBoundingClientRect().width,
            "y": block.getBoundingClientRect().height,
        };
        let shiftX = event.clientX - block.getBoundingClientRect().left;
        let shiftY = event.clientY - block.getBoundingClientRect().top;

        if (shiftX > blockSize["x"]/3 && shiftX < 2*blockSize["x"]/3){
            if (shiftY < blockSize["y"]/3) {
                console.log("top");

                if (connections["connecting"]){
                    console.log(connections["connects"])
                    connections["connects"][connections["connects"].length-1].push({
                        "block" : block,
                        "point" : "top"
                    });
                    connections["connecting"] = false
                }
                else{

                    connections["connects"].push({
                        "block" : block,
                        "point" : "top"
                    });
                    connections["connecting"] = true

                }


            }
            else if(shiftY > 2*blockSize["y"]/3){
                console.log("bottom");
                
                if (connections["connecting"]){
                    
                    connections["connects"][connections["connects"].length-1].push({
                        "block" : block,
                        "point" : "bottom"
                    });
                    connections["connecting"] = false
                }
                else{

                    connections["connects"].push([{
                        "block" : block,
                        "point" : "bottom"
                    }]);
                    connections["connecting"] = true

                }





            }
            else {
                console.log("center");
            }
        }

        else{

            if (block.classList.contains("non-parent")){
                block.insertAdjacentHTML('beforebegin', block.outerHTML);
            }

            block.style.position = 'relative';
            block.style.zIndex = 1000;

            

            moveAt(event.movementX, event.movementY);

            if (block.classList.contains("non-parent")){
                x = block.getBoundingClientRect().x;
                y = block.getBoundingClientRect().y;
                block.style.left = event.pageX - shiftX - x + "px";
                block.style.top = event.pageY - shiftY - y + "px";
            }

            document.addEventListener('mousemove', onMouseMove);
        }
            function onMouseMove(event) {
            moveAt(event.movementX, event.movementY);
            block.scrollIntoView({ block: "nearest", inline: "nearest" });
            }
        
            function moveAt(movementX, movementY) {
                if (block.classList.contains("non-parent")) scheme.append(block);
            
                let newX = Number(block.style.left.slice(0, -2)) + movementX;
                let newY = Number(block.style.top.slice(0, -2)) + movementY;
            
                // if(newX > -schemePaddingLeft) 
                block.style.left = newX + 'px';
                // else block.style.left = -schemePaddingLeft
            
                // if(newY > -schemePaddingTop) 
                block.style.top = newY + 'px';
                // else block.style.top = -schemePaddingTop
            
            }
        
            document.onmouseup = function(event) {
                block.onmouseup = null;
                if (block.classList.contains("non-parent")) scheme.append(block);

                block.style.left = Number(block.style.left.slice(0, -2)) + event.movementX + 'px';
                block.style.top = Number(block.style.top.slice(0, -2)) + event.movementY + 'px';

                document.removeEventListener('mousemove', onMouseMove);

                if (block.classList.contains("non-parent")){
                    block.classList.remove("non-parent");
                    blockActivation(selector);
                }

                if (!connections["connecting"]){
                    if (svg) svg.remove()
                    for (let i = 0; i < connections["connects"].length; i++){
                        let obj1 = connections["connects"][i][0]
                        let obj2 = connections["connects"][i][1]
                        let x1, x2, y1, y2;
                        if (obj1.point == "top"){
                            x1 = Number(obj1.block.style.left.slice(0, -2)) + obj1.block.getBoundingClientRect().width/2
                            y1 = Number(obj1.block.style.top.slice(0, -2))
                        }
                        else if (obj1.point == "bottom"){
                            x1 = Number(obj1.block.style.left.slice(0, -2)) + obj1.block.getBoundingClientRect().width/2
                            y1 = Number(obj1.block.style.top.slice(0, -2)) + obj1.block.getBoundingClientRect().height
                        }

                        if (obj2.point == "top"){
                            x2 = Number(obj2.block.style.left.slice(0, -2)) + obj2.block.getBoundingClientRect().width/2
                            y2 = Number(obj2.block.style.top.slice(0, -2)) + 75
                        }
                        else if (obj2.point == "bottom"){
                            x2 = Number(obj2.block.style.left.slice(0, -2)) + obj2.block.getBoundingClientRect().width/2
                            y2 = Number(obj2.block.style.top.slice(0, -2)) + obj2.block.getBoundingClientRect().height + 75
                        }
                        console.log(x1, y1, x2, y2);
                
                        makeLine(x1, y1, x2, y2);
                
                    }
                }





            }
            block.ondragstart = function() {
                return false;
            
        }
    }

}

//пошла работа
blockActivation('.question-block');
blockActivation('.text-block');
blockActivation('.start-block');

// -------------------------------------------------------------


function makeLine(x1, y1, x2, y2){

    
    let width = x2 - x1,
        height = y2 - y1;
    
    svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
    svg.style.left = x1 + 'px';
    svg.style.top = y1 + 'px';
    svg.setAttribute( 'width', x2 - x1 );
    svg.setAttribute( 'height', y2 - y1 );
    svg.setAttribute( 'viewBox', `0 0 ${width} ${height}` );
    
    let path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
    path.setAttribute( 'stroke', 'black' );
    path.setAttribute( 'stroke-width', '3' );
    path.setAttribute( 'd', `M 0,0 L ${width},${height}` );
    
    svg.appendChild(path);
    
    document.body.appendChild(svg);
}

// makeLine(20, 20, 300, 300);


let scheme = document.querySelector(".scheme");
let x, y;
let schemePaddingLeft = Number(window.getComputedStyle(scheme, null).getPropertyValue("padding-left").slice(0, -2)),  //why was I alone?
    schemePaddingTop = Number(window.getComputedStyle(scheme, null).getPropertyValue("padding-top").slice(0, -2));    //What did I do to deserve this?
let svg = null;
let svgs = document.getElementsByClassName("svg");
    

let addTextArea = document.querySelector(".add-text");
let addAnswerArea = document.querySelector(".add-answer");

let connections = {
    "connecting": false,
    "connects" : []
};
let svgArea = document.querySelector(".svg-area");
let blockArea = document.querySelector(".block-area");

let svgBorder = document.querySelector(".svg-border");


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
                    
                    connections["connects"][connections["connects"].length-1].push({
                        "block" : block,
                        "point" : "top"
                    });
                    connections["connecting"] = false;
                }
                else{

                    connections["connects"].push([{
                        "block" : block,
                        "point" : "top"
                    }]);
                    connections["connecting"] = true;
                }
            }
            else if(shiftY > 2*blockSize["y"]/3){
                console.log("bottom");
                
                if (connections["connecting"]){
                    
                    connections["connects"][connections["connects"].length-1].push({   //why did Ivan do this?
                        "block" : block,
                        "point" : "bottom"
                    });
                    connections["connecting"] = false;
                }
                else{

                    connections["connects"].push([{
                        "block" : block,
                        "point" : "bottom"
                    }]);
                    connections["connecting"] = true;

                }
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
                // lul
                x = block.getBoundingClientRect().x;
                y = block.getBoundingClientRect().y;
                block.style.left = event.pageX - shiftX - x + "px";
                block.style.top = event.pageY - shiftY - y + "px";
            }

            document.addEventListener('mousemove', onMouseMove);
        }
            function onMouseMove(event) {
            moveAt(event.movementX, event.movementY);
            if (! block.classList.contains("non-parent")) block.scrollIntoView({ block: "nearest", inline: "nearest" });
            updateLines();
            }
        
            function moveAt(movementX, movementY) {
                if (block.classList.contains("non-parent")) blockArea.append(block);
            
                let newX = Number(block.style.left.slice(0, -2)) + movementX;
                let newY = Number(block.style.top.slice(0, -2)) + movementY;
            
                block.style.left = newX + 'px';
                block.style.top = newY + 'px';
            
            }

            function updateLines(){
                
                if (!connections["connecting"]){
                    svgArea.innerHTML = '';
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
                        makeLine(x1, y1, x2, y2);
                    }
                }
            }

        
            document.onmouseup = function(event) {
                block.onmouseup = null;
                if (block.classList.contains("non-parent")) blockArea.append(block);

                block.style.left = Number(block.style.left.slice(0, -2)) + event.movementX + 'px'; //pashalka
                block.style.top = Number(block.style.top.slice(0, -2)) + event.movementY + 'px';

                document.removeEventListener('mousemove', onMouseMove);

                if (block.classList.contains("non-parent")){
                    block.classList.remove("non-parent");
                    blockActivation(selector);
                    
                }
                updateLines()

                


            }
            updateLines();
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
    svgArea.insertAdjacentHTML('afterbegin', '<svg><line id="line" class="svg" viewBox="0 0 700 700" stroke="black" stroke-width="5"/></svg>');

    
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1 - line.getBoundingClientRect().y);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2 - line.getBoundingClientRect().y);
    line.style.zIndex = 100000;

    line.addEventListener("click", ()=>{
        
     })
}

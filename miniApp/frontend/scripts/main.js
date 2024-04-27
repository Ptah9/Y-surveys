let schemeArea = document.querySelector(".scheme");
let x, y;
let schemePaddingLeft = Number(window.getComputedStyle(schemeArea, null).getPropertyValue("padding-left").slice(0, -2)),
    schemePaddingTop = Number(window.getComputedStyle(schemeArea, null).getPropertyValue("padding-top").slice(0, -2));

    
let drug = function(selector){

    let blocks = document.querySelectorAll(selector)

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











                // let from = block,
                //     to = document.querySelector('.to'),
                //     mousePressed = false,
                //     pointFrom,
                //     pointTo,
                //     svg;

                // from.addEventListener( 'mousedown', e => {
                //     mousePressed = true;
                //     pointFrom = {
                //         x: e.clientX,
                //         y: e.clientY,
                //     };
                // });

                // document.addEventListener( 'mousemove', e => {
                //     if( !mousePressed ) return;
                //     pointTo = {
                //         x: e.clientX,
                //         y: e.clientY,
                //     };
                //     updateLine();
                // });

                // document.addEventListener( 'mouseup', e => {
                //     if( !mousePressed ) return;
                //     mousePressed = false;
                //     svg = null;
                // });

                // function updateLine(){
                //     if(svg) svg.remove();
                    
                //     let width = pointTo.x - pointFrom.x,
                //         height = pointTo.y - pointFrom.y;
                    
                //     svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
                //     svg.style.left = pointFrom.x + 'px';
                //     svg.style.top = pointFrom.y + 'px';
                //     svg.setAttribute( 'width', pointTo.x - pointFrom.x );
                //     svg.setAttribute( 'height', pointTo.y - pointFrom.y );
                //     svg.setAttribute( 'viewBox', `0 0 ${width} ${height}` );
                    
                //     let path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
                //     path.setAttribute( 'stroke', 'black' );
                //     path.setAttribute( 'd', `M 0,0 L ${width},${height}` );
                    
                //     svg.appendChild(path);
                    
                //     document.body.appendChild(svg);
                // }


















            }
            else if(shiftY > 2*blockSize["y"]/3){
                console.log("bottom")
            }
            else {
                console.log("center")
            }
        }

        else{



        if (block.classList.contains("non-parent")){
            block.insertAdjacentHTML('beforebegin', block.outerHTML);
        }
        block.style.position = 'relative';
        block.style.zIndex = 1000;
        // document.body.append(block); 

        function moveAt(movementX, movementY) {
            if (block.classList.contains("non-parent")){
                schemeArea.append(block); 
            }
            // block.style.left = 0 + "px";
            // block.style.top = 0 + "px";
            console.log()
            let newX = Number(block.style.left.slice(0, -2)) + movementX;
            let newY = Number(block.style.top.slice(0, -2)) + movementY;

            // if(newX > -schemePaddingLeft) 
            block.style.left = newX + 'px';
            // else block.style.left = -schemePaddingLeft

            // if(newY > -schemePaddingTop) 
            block.style.top = newY + 'px';
            // else block.style.top = -schemePaddingTop

          }

        moveAt(event.movementX, event.movementY);
        if (block.classList.contains("non-parent")){
            x = block.getBoundingClientRect().x
            y = block.getBoundingClientRect().y
            block.style.left = event.pageX - shiftX - x + "px";
            block.style.top = event.pageY - shiftY - y + "px";
        }
        //   let sx = 0
        //   let sy = 0
        // function scrollScheme(pageX, pageY){
        //     if (pageX - shiftX + blockSize["x"] > schemeArea.getBoundingClientRect().width){
        //         // sy+=1
        //         sx+=10
        //         console.log("lol")
        //         schemeArea.scroll(sx, sy)
                
        //         console.log(schemeArea.scrollLeft)
        //     }
        // }


      
        // переносит блок на координаты (pageX, pageY),
        // дополнительно учитывая изначальный сдвиг относительно указателя мыши

        function onMouseMove(event) {
          moveAt(event.movementX, event.movementY);
          block.scrollIntoView({ block: "nearest", inline: "nearest" })
        }
      
        // передвигаем блок при событии mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // отпустить блок, удалить ненужные обработчики
        document.onmouseup = function(event) {
            // block.style.position = 'relative';

            // if (block.classList.contains("in-scheme")){


            // }
            // else{
            //     if (event.pageY + blockSize["y"] - shiftY > schemeArea.getBoundingClientRect().height){
            //         block.onmouseup = null;
            //         block.parentNode.removeChild(block);
            //     }
            //     else{
                    block.onmouseup = null;
                    if (block.classList.contains("non-parent")){
                        schemeArea.append(block); 
                    }
                    block.style.left = Number(block.style.left.slice(0, -2)) + event.movementX + 'px';
                    block.style.top = Number(block.style.top.slice(0, -2)) + event.movementY + 'px';
                    

            //     }
            // }

            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
            if (block.classList.contains("non-parent")){
                block.classList.remove("non-parent");
                drug(selector)
            }

        };
        
      };
      
      block.ondragstart = function() {
        return false;
      };
        }

}













drug('.question-block');
drug('.text-block');
drug('.start-block');
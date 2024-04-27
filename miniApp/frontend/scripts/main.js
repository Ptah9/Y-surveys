// let questionBlock = document.querySelector('.question-block'),
    // textBlock = document.querySelector('.text-block');

// console.log(questionBlock)

let drug = function(selector){
    let block = document.querySelector(selector)
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











                let from = block,
                    to = document.querySelector('.to'),
                    mousePressed = false,
                    pointFrom,
                    pointTo,
                    svg;

                from.addEventListener( 'mousedown', e => {
                    mousePressed = true;
                    pointFrom = {
                        x: e.clientX,
                        y: e.clientY,
                    };
                });

                document.addEventListener( 'mousemove', e => {
                    if( !mousePressed ) return;
                    pointTo = {
                        x: e.clientX,
                        y: e.clientY,
                    };
                    updateLine();
                });

                document.addEventListener( 'mouseup', e => {
                    if( !mousePressed ) return;
                    mousePressed = false;
                    svg = null;
                });

                function updateLine(){
                    if(svg) svg.remove();
                    
                    let width = pointTo.x - pointFrom.x,
                        height = pointTo.y - pointFrom.y;
                    
                    svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
                    svg.style.left = pointFrom.x + 'px';
                    svg.style.top = pointFrom.y + 'px';
                    svg.setAttribute( 'width', pointTo.x - pointFrom.x );
                    svg.setAttribute( 'height', pointTo.y - pointFrom.y );
                    svg.setAttribute( 'viewBox', `0 0 ${width} ${height}` );
                    
                    let path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
                    path.setAttribute( 'stroke', 'black' );
                    path.setAttribute( 'd', `M 0,0 L ${width},${height}` );
                    
                    svg.appendChild(path);
                    
                    document.body.appendChild(svg);
                }


















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
            block.classList.remove("non-parent");
        }
        block.style.position = 'absolute';
        block.style.zIndex = 1000;
        document.body.append(block); //TODO: выбрать лучшее место, при помещении в схему перемещать его туда

        function moveAt(pageX, pageY) {
            block.style.left = pageX - shiftX + 'px';
            block.style.top = pageY - shiftY + 'px';
          }

        moveAt(event.pageX, event.pageY);
      
        // переносит блок на координаты (pageX, pageY),
        // дополнительно учитывая изначальный сдвиг относительно указателя мыши

      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // передвигаем блок при событии mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // отпустить блок, удалить ненужные обработчики
        block.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            block.onmouseup = null;
            drug(selector)
        };
        
      };
      
      block.ondragstart = function() {
        return false;
      };
        }

}













drug('.question-block');
drug('.text-block');
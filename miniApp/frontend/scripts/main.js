// let questionBlock = document.querySelector('.question-block'),
    // textBlock = document.querySelector('.text-block');

// console.log(questionBlock)

let drug = function(selector){
    let block = document.querySelector(selector)
    block.onmousedown = function(event) {
    
        let shiftX = event.clientX - block.getBoundingClientRect().left;
        let shiftY = event.clientY - block.getBoundingClientRect().top;
        

        if (block.classList.contains("non-parent")){
            block.insertAdjacentHTML('beforebegin', block.outerHTML);
            block.classList.remove("non-parent");
        }
        block.style.position = 'absolute';
        block.style.zIndex = 1000;
        document.body.append(block);
      
        moveAt(event.pageX, event.pageY);
      
        // переносит мяч на координаты (pageX, pageY),
        // дополнительно учитывая изначальный сдвиг относительно указателя мыши
        function moveAt(pageX, pageY) {
          block.style.left = pageX - shiftX + 'px';
          block.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // передвигаем мяч при событии mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // отпустить мяч, удалить ненужные обработчики
        block.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            block.onmouseup = null;
            // questionBlock = document.querySelector('.question-block');
            drug(selector)
          
          
        };
        
      
      };
      
      block.ondragstart = function() {
        return false;
      };
}

drug('.question-block');
drug('.text-block');
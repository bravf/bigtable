declare let $

export function getDeltaFromEvent(e){
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
}

export function drag($target, callfn){
    let isDrag = false
    let x = 0
    let y = 0

    $target.on('mousedown', function (e){
        isDrag = true
        x = e.clientX
        y = e.clientY
    })

    $('body').on('mousemove', function (e){
        if (isDrag){
            callfn(e.clientX - x, e.clientY - y)

            x = e.clientX
            y = e.clientY
        }
    })
    .on('mouseup', function (){
        isDrag = false
    })
}
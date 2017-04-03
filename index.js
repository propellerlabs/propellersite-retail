window.onload = function() {
  var canvasHeader = document.getElementById('canvas-header');
  var canvasFooter = document.getElementById('canvas-footer');
  var headerHoverContainer = document.getElementById('canvas-header-hover');
  var footerHoverContainer = document.getElementById('canvas-footer-hover');
  var headerContainer = document.getElementById('main-header');
  var footerContainer = document.getElementById('footer');
  setInteractiveCanvas(canvasHeader, headerHoverContainer, headerContainer);
  setInteractiveCanvas(canvasFooter, footerHoverContainer, footerContainer);

  window.onresize = function() {
    setInteractiveCanvas(canvasHeader, headerHoverContainer, headerContainer);
    setInteractiveCanvas(canvasFooter, footerHoverContainer, footerContainer);
  };

  function setInteractiveCanvas(canvas, hoverContainer, content) {
    var context = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = content.clientHeight;

    canvas.width = width;
    canvas.height = height;
    hoverContainer.width = width;
    hoverContainer.height = height;
    canvas.style.backgroundColor = 'rgb(32, 32, 32)';

    var bgColor = function() { return randomIntFromInterval(25, 32) };
    var paintColor = function() {
      const picker = randomIntFromInterval(0, 2);
      switch(picker) {
      case 0:
        return '#881c05';
      case 1:
        return '#ff471f';
      case 2:
        return '#ffa31f';
      }
    }

    var translateX = 10;
    var translateY = 10;

    var rectWidth = 8;
    var rectHeight = 8;

    context.save();
    drawBg();
    context.restore();
    hoverContainer.addEventListener('mousemove', onMouseMove);
    hoverContainer.addEventListener('click', onClick);


    function drawBg() {
      for(var i = 0; i < width; i += translateX) {
        context.save();
        for(var j = 0; j < height; j += translateY) {
          const color = bgColor();
          context.fillStyle = 'rgb('+ color +','+ color +','+ color +')';
          context.fillRect(0, 0, rectWidth, rectHeight);
          context.translate(0, translateY);
        }
        context.restore();
        context.translate(translateX, 0);
      }
    }

    function startStreak(xPos, yPos) {
      streak(xPos, yPos);
    }

    function streak(xPos, yPos) {
      context.clearRect(xPos - translateX, yPos, rectWidth, rectHeight);
      const color = bgColor();
      context.fillStyle = 'rgb('+ color +','+ color +','+ color +')';
      context.fillRect(xPos - translateX, yPos, rectWidth, rectHeight);
      context.fillStyle = 'rgb('+ 255 +','+ 0 +','+ 0 +')';
      context.fillRect(xPos, yPos, rectWidth, rectHeight);
      xPos += translateX;
      requestAnimationFrame(function() { streak(xPos, yPos); });
    }

    function randomIntFromInterval(min, max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    function randomNumFromInterval(min, max) {
      return Math.random()*(max-min+1)+min;
    }

    function onMouseMove(e) {
      var position = getPosition(e);

      requestAnimationFrame(function() {
        paintSquare(position, 0, 0);
        resetColor(position, 0, 0, 5);
      })
    }

    function onClick(e) {
      var position = getPosition(e);
      var radius = 1;
      paintSquare(position, 0, 0);
      drawColors(position, radius);

      setInterval(function() {
        radius *= 1.01;
        requestAnimationFrame(function() {
          paintSquare(position, 0, 0);
          drawColors(position, radius);
        })
      }, 1000 / 10);
    }

    function getPosition(e) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      return { x: x, y: y };
    }

    function drawColors(position, radius) {
      var radiusInt = Math.round(radius);
      for(var i = -radiusInt; i < radiusInt; i++) {
        for(var j = -radiusInt; j < radiusInt; j++) {
          if ((Math.abs(i) < radiusInt / 1.5 || Math.abs(j) < radiusInt / 1.5) &&
            randomIntFromInterval(0, 0.01)) {
            paintSquare(position, i, j);
          }
        }
      }
    }

    function paintSquare(position, i, j) {
      var originX = Math.floor(position.x/translateX) * translateX;
      var originY = Math.floor(position.y/translateY) * translateY;
      context.fillStyle = paintColor();
      context.fillRect(originX + (translateX * i), originY + (translateY * j), rectWidth, rectHeight);
    }

    function resetColor(position, i, j, timeout = 2000) {
      setTimeout(function() {
        var originX = Math.floor(position.x/translateX) * translateX;
        var originY = Math.floor(position.y/translateY) * translateY;
        const color = bgColor();
        context.fillStyle = 'rgb('+ color +','+ color +','+ color +')';
        context.fillRect(originX + (translateX * i), originY + (translateY * j), rectWidth, rectHeight);
      }, timeout);
    }
  }
}

window.onload = function() {

  var canvasHeader = document.getElementById('canvas-header');
  var headerHoverContainer = document.getElementById('canvas-header-hover');
  var headerContainer = document.getElementById('main-header');

  var canvasFooter = document.getElementById('canvas-footer');
  var footerHoverContainer = document.getElementById('canvas-footer-hover');
  var footerContainer = document.getElementById('footer');

  var canvasAbout = document.getElementById('canvas-about-us');
  var aboutContainer = document.getElementById('about-us');

  var canvasClassics = document.getElementById('canvas-classics');
  var classicsContainer = document.getElementById('classics');

  var translateX = 10;
  var translateY = 10;

  var rectWidth = 8;
  var rectHeight = 8;

  var transformProp = (function(){
    var testEl = document.createElement('div');
    if(testEl.style.transform == null) {
      var vendors = ['Webkit', 'Moz', 'ms'];
      for(var vendor in vendors) {
        if(testEl.style[ vendors[vendor] + 'Transform' ] !== undefined) {
          return vendors[vendor] + 'Transform';
        }
      }
    }
    return 'transform';
  })();

  var parallaxHover = function() {
    var init = function(elClass, containerClass) {
      var containers = Array.from(document.getElementsByClassName(containerClass));

      containers.forEach(function(container) {
        var el = container.getElementsByClassName(elClass)[0];
        container.addEventListener('mousemove', function(e) {
          return onMouseMove(e, el, container);
        });
        container.addEventListener('mouseleave', function() {
          return onMouseLeave(el);
        })
      });
    }

    var onMouseMove = function(e, el, container) {
      var center = elCenter(el);
      var dist = distanceBetween(center.x, center.y, e.clientX, e.clientY);
      var distToDeg = normalizeDistToDegrees(dist, center, container);
      var direction = rotationDirection(center.x, center.y, e.clientX, e.clientY);
      rotateEl(el, distToDeg, direction);
    }

    var onMouseLeave = function(el) {
      el.style[transformProp] = 'rotate3d(0, 0, 0, 0)';
    }

    var rotationDirection = function(x1, y1, x2, y2) {
      var x = x2 - x1;
      var y = y2 - y1;
      return { x: x, y: y };
    }

    var normalizeDistToDegrees = function(dist, center, container) {
      var rect = container.getBoundingClientRect();
      var farthestDist = distanceBetween(center.x, center.y, rect.right, rect.top);
      return (farthestDist - dist) / farthestDist * 20;
    }

    var rotateEl = function(el, dist, dir) {
      el.style.transform = 'rotate3d(' + -dir.y + ',' + dir.x + ', 0,' + dist + 'deg)';
    }

    var distanceBetween = function(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    }

    var elCenter = function(el) {
      var rect = el.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      return { x: x, y: y };
    }

    return {
      init: init
    };
  }();

  parallaxHover.init(
    'classics__works-container__work__image',
    'classics__works-container__work'
  );

  parallaxHover.init(
    'case-studies__case-study__image-container__img',
    'case-studies__case-study'
  );

  setCanvases();

  window.onresize = function() {
    setCanvases();
  };

  function setCanvases() {
    setInteractiveCanvas(canvasHeader, headerHoverContainer, headerContainer);
    setInteractiveCanvas(canvasFooter, footerHoverContainer, footerContainer);
    setStaticCanvas(canvasAbout, aboutContainer);
    setStaticCanvas(canvasClassics, classicsContainer);
  }

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  function randomNumFromInterval(min, max) {
    return Math.random()*(max-min+1)+min;
  }

  function setStaticCanvas(canvas, content) {
    var context = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = content.clientHeight;

    canvas.width = width;
    canvas.height = height;
    canvas.style.backgroundColor = 'rgb(255, 255, 255)';

    var bgColor = function() { return randomIntFromInterval(251, 255) };

    context.save();
    drawBg({
      context: context,
      width: width,
      height: height,
      rectWidth: rectWidth,
      rectHeight: rectHeight,
      translateX: translateX,
      translateY: translateY,
      bgColor: bgColor
    });
    context.restore();
  }

  function drawBg(options) {
    var context = options.context;

    for(var i = 0; i < options.width; i += options.translateX) {
      context.save();
      for(var j = 0; j < options.height; j += options.translateY) {
        var color = options.bgColor();
        context.fillStyle = 'rgb('+ color +','+ color +','+ color +')';
        context.fillRect(0, 0, options.rectWidth, options.rectHeight);
        context.translate(0, options.translateY);
      }
      context.restore();
      context.translate(options.translateX, 0);
    }
  }

  function setInteractiveCanvas(canvas, hoverCanvas, content) {
    var context = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = content.clientHeight;

    canvas.width = width;
    canvas.height = height;
    hoverCanvas.width = width;
    hoverCanvas.height = height;

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

    context.save();
    drawBg({
      context: context,
      width: width,
      height: height,
      rectWidth: rectWidth,
      rectHeight: rectHeight,
      translateX: translateX,
      translateY: translateY,
      bgColor: bgColor
    });
    context.restore();
    hoverCanvas.addEventListener('mousemove', onMouseMove);
    hoverCanvas.addEventListener('click', onClick);

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
        if(radius > window.innerWidth && radius > window.innerHeight) {
          return;
        }
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

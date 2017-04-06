window.onload = function() {

  var canvasOptions = {
    translateX: 10,
    translateY: 10,
    rectWidth: 8,
    rectHeight: 8,
    interactive: [
      {
        canvas: 'canvas-header',
        container: 'main-header'
      },
      {
        canvas: 'canvas-footer',
        container: 'footer'
      }
    ],
    static: [
      {
        canvas: 'canvas-about-us',
        container: 'about-us'
      },
      {
        canvas: 'canvas-classics',
        container: 'classics'
      }
    ]
  };

  modalHandler.init();
  canvasHandler.init(canvasOptions);

  // alerts
  (function() {
    var success = getParameterByName('success');
    var err = getParameterByName('error');

    if(success) {
      var node = document.getElementsByClassName('success-alert')[0];
      node.classList.add('show');
      setTimeout(function() { node.classList.remove('show'); }, 2000);
    } else if (err) {
      var node = document.getElementsByClassName('error-alert')[0];
      node.classList.add('show');
      setTimeout(function() { node.classList.remove('show'); }, 2000);
    }
  })();


  window.onresize = function() {
    canvasHandler.init(canvasOptions);
  };

  function setStaticCanvas(canvas, content) {
    var context = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = content.clientHeight;

    setCanvasDimensions(canvas, width, height);
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
}

var modalHandler = (function() {
  var init = function() {
    var links = Array.from(document.getElementsByClassName('modal-link'));

    links.forEach(function(link) {
      var modalName = link.dataset.modal;
      var modal = document.getElementById(modalName + '-modal');
      var overlay = document.getElementById('overlay');
      var close = modal.querySelector('.close-icon');
      close.addEventListener('click', function() {
        closeModal(modal, overlay);
      });
      link.addEventListener('click', function(e) {
        e.preventDefault();
        toggleModal(modal, overlay);
      });
    })
  }

  var toggleModal = function(modal, overlay) {
    var body = document.getElementsByTagName('body')[0];
    body.classList.toggle('modal-open');
    modal.classList.toggle('show');
    overlay.classList.toggle('show');
  };

  var closeModal = function(modal, overlay) {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('modal-open');
    modal.classList.remove('show');
    overlay.classList.remove('show');
  }

  var handleNewsletterSubmit = function() {
    var modal = document.getElementById('newsletter-modal');
    var overlay = document.getElementById('overlay');
    closeModal(modal, overlay);
  }

  return {
    init: init,
    onNewsletterSubmit: handleNewsletterSubmit
  };
}());

var canvasHandler = (function() {
  var init = function(options) {
    var interactive = options.interactive,
        static = options.static;

    interactive.forEach(function(obj) {
      interactiveCanvas(obj.canvas, obj.container, options);
    });
  }

  var setCanvasDimensions = function(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
  }

  var interactiveCanvas = function(canvas, container, options) {
    var canvas = document.getElementById(canvas),
        container = document.getElementById(container),
        context = canvas.getContext('2d'),
        height = container.clientHeight,
        width = window.innerWidth,
        rectWidth = options.rectWidth,
        rectHeight = options.rectHeight,
        translateX = options.translateX,
        translateY = options.translateY;

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

    var setInitialBg = function(context) {
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

    var drawBg = function(options) {
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

    var onMouseMove = function(e, canvas, context) {
      var position = getPosition(e, canvas);

      requestAnimationFrame(function() {
        paintSquare(position, 0, 0, context);
        resetColor(position, 0, 0, 5, context);
      })
    }

    var onClick = function(e, canvas, context) {
      var position = getPosition(e, canvas);
      var radius = 1;
      var t = 1;
      paintSquare(position, 0, 0, context);
      drawColors(position, radius, context);

      var animation = function() {
        if(radius > window.innerWidth && radius > window.innerHeight) {
          return;
        }
        t++;
        radius = radius * 1.01;
        paintSquare(position, 0, 0, context);
        drawColors(position, radius, context);
        requestAnimationFrame(animation);
      };

      animation();
    }

    var getPosition = function(e, canvas) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      return { x: x, y: y };
    }

    var drawColors = function(position, radius, context) {
      var radiusInt = Math.round(radius);
      for(var i = -radiusInt; i < radiusInt; i++) {
        var dx = Math.abs(i);
        for(var j = -radiusInt; j < radiusInt; j++) {
          var dy = Math.abs(j);
          if (inCircle(dx, dy, radiusInt)) {
            paintSquare(position, i, j, context);
          }
        }
      }
    }

    var inCircle = function(dx, dy, R) {
      if (dx > R) {
        return false;
      } else if (dy > R) {
        return false;
      } else if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(R, 2) &&
          Math.pow(dx, 2) + Math.pow(dy, 2) >= Math.pow((R - 2), 2)) {
        return true;
      } else {
        return false;
      }
    }

    var paintSquare = function(position, i, j, context) {
      var originX = Math.floor(position.x / translateX) * translateX;
      var originY = Math.floor(position.y / translateY) * translateY;
      context.fillStyle = paintColor();
      context.fillRect(
        originX + (translateX * i),
        originY + (translateY * j),
        rectWidth,
        rectHeight
      );
    }

    var clearCanvas = function() {
      context.clearRect(0, 0, width, height);
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
    }

    var resetColor = function(position, i, j, timeout = 2000) {
      setTimeout(function() {
        var originX = Math.floor(position.x/translateX) * translateX;
        var originY = Math.floor(position.y/translateY) * translateY;
        const color = bgColor();
        context.fillStyle = 'rgb('+ color +','+ color +','+ color +')';
        context.fillRect(
          originX + (translateX * i),
          originY + (translateY * j),
          rectWidth,
          rectHeight
        );
      }, timeout);
    }

    setCanvasDimensions(canvas, width, height);
    canvas.style.backgroundColor = 'rgb(32, 32, 32)';
    setInitialBg(context);
    canvas.addEventListener('mousemove', function(e) {
      onMouseMove(e, canvas, context);
    });
    canvas.addEventListener('click', function(e) {
      onClick(e, canvas, context)
    });
  };

  return {
    init: init
  };
}());


function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function randomNumFromInterval(min, max) {
  return Math.random()*(max-min+1)+min;
}

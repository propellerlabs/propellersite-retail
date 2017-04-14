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
  parallaxHover.init(
    'classics__works-container__work__image',
    'classics__works-container__work'
  );

  parallaxHover.init(
    'case-studies__case-study__image-container__img',
    'case-studies__case-study',
    true
  );

  parallaxHover.init(
    'about-us__stat-box',
    'about-us',
    true
  );

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

    var modalInputs = Array.from(document.getElementsByClassName('modal-form__form-input'));

    modalInputs.forEach(function(el) {
      var input = el.querySelector('input');
      var textarea = el.querySelector('textarea');
      var inputEl = input || textarea;

      inputEl.addEventListener('focus', function(e) {
        el.classList.add('initialized');
      })
    });

    var forms = Array.from(document.getElementsByClassName('modal-form'));

    forms.forEach(function(el) {
      el.querySelector('button[type=submit]').addEventListener('click', function(e) {
        el.classList.add('submitted');
      })
    });
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
    var invalid = modal.querySelector('input:invalid');
    !invalid && closeModal(modal, overlay);
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

    static.forEach(function(obj) {
      staticCanvas(obj.canvas, obj.container, options);
    })
  }

  var setCanvasDimensions = function(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
  }

  var interactiveCanvas = function(canvas, container, options) {
    var canvas = document.getElementById(canvas),
        container = document.getElementById(container),
        context = canvas.getContext('2d'),
        height = container.getBoundingClientRect().height,
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
        resetColor(position, 0, 0, 50, context);
      })
    }

    var onClick = function(e, canvas, context) {
      var position = getPosition(e, canvas);
      var radius = 1;
      var t = 1;
      drawColors(position, radius, context);
      var id;

      var animation = function() {
        if(radius * translateX > Math.sqrt(2 * Math.pow(window.innerWidth, 2) + 100)
          && radius * translateY > Math.sqrt(2 * Math.pow(window.innerHeight, 2)) + 100) {
          cancelAnimationFrame(id);
          return;
        }
        t++;
        radius = radius + 1;
        drawColors(position, radius, context);
        id = requestAnimationFrame(animation);
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
          if (inRing(dx, dy, radiusInt)) {
            paintSquare(position, i, j, context);
          } else if(inRing(dx, dy, radiusInt - 2)) {
            paintBg(position, i, j);
          }
        }
      }
    }

    var inRing = function(dx, dy, R) {
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

    var paintBg = function(position, i, j) {
      var originX = Math.floor(position.x / translateX) * translateX;
      var originY = Math.floor(position.y / translateY) * translateY;
      const color = bgColor();
      context.fillStyle = 'rgb('+ color +','+ color +','+ color +')';
      context.fillRect(
        originX + (translateX * i),
        originY + (translateY * j),
        rectWidth,
        rectHeight
      );
    }

    var resetColor = function(position, i, j, timeout = 2000) {
      setTimeout(function() {
        paintBg(position, i, j)
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

  var staticCanvas = function(canvas, container, options) {
    var canvas = document.getElementById(canvas),
        container = document.getElementById(container);

    var context = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = container.clientHeight;

    setCanvasDimensions(canvas, width, height);
    canvas.style.backgroundColor = 'rgb(255, 255, 255)';

    var bgColor = function() { return randomIntFromInterval(251, 255) };

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

    context.save();
    drawBg({
      context: context,
      width: width,
      height: height,
      rectWidth: options.rectWidth,
      rectHeight: options.rectHeight,
      translateX: options.translateX,
      translateY: options.translateY,
      bgColor: bgColor
    });
    context.restore();
  };

  return {
    init: init
  };
}());

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
  var init = function(elClass, containerClass, boxShadowEffect) {
    var containers = Array.from(document.getElementsByClassName(containerClass));

    containers.forEach(function(container) {
      var el = container.getElementsByClassName(elClass)[0];
      container.addEventListener('mousemove', function(e) {
        return onMouseMove(e, el, container, boxShadowEffect);
      });
      container.addEventListener('mouseleave', function() {
        return onMouseLeave(el, boxShadowEffect);
      })
    });
  }

  var onMouseMove = function(e, el, container, boxShadowEffect) {
    var center = elCenter(el);
    var dist = distanceBetween(center.x, center.y, e.clientX, e.clientY);
    var distToDeg = normalizeDistToDegrees(dist, center, container);
    var direction = rotationDirection(center.x, center.y, e.clientX, e.clientY);
    var dirToShadow = normalizeDirToShadow(direction, center, container);
    rotateEl(el, distToDeg, direction);
    boxShadowEffect && applyBoxShadow(el, dist, dirToShadow);
  }

  var onMouseLeave = function(el, boxShadowEffect) {
    el.style[transformProp] = 'rotate3d(0, 0, 0, 0)';
    if (boxShadowEffect) {
      el.style.boxShadow = '8px 8px 24px 0 rgba(0, 0, 0, 0.16)';
    }
  }

  var rotationDirection = function(x1, y1, x2, y2) {
    var x = x2 - x1;
    var y = y2 - y1;
    return { x: x, y: y };
  }

  var farthestDist = function(center, container) {
    var rect = container.getBoundingClientRect();
    return distanceBetween(center.x, center.y, rect.right, rect.top);
  }

  var farthestX = function(center, container) {
    var rect = container.getBoundingClientRect();
    var leftDist = rect.left - center.x;
    var rightDist = rect.right - center.x;
    return leftDist > rightDist ? leftDist : rightDist;
  }

  var farthestY = function(center, container) {
    var rect = container.getBoundingClientRect();
    var topDist = rect.top - center.y;
    var bottomDist = rect.bottom - center.y;
    return topDist > bottomDist ? topDist : bottomDist;
  }

  var normalizeDistToDegrees = function(dist, center, container) {
    var far = farthestDist(center, container);
    return dist / far * 20;
  }

  var normalizeDirToShadow = function(dir, center, container) {
    var farX = farthestX(center, container);
    var farY = farthestY(center, container);
    var x = Math.abs(dir.x) / farX * 16;
    var y = Math.abs(dir.y) / farY * 16;
    return { x: dir.x < 0 ? -x : x, y: dir.y < 0 ? -y : y };
  }

  var rotateEl = function(el, dist, dir) {
    el.style[transformProp] = 'rotate3d(' + -dir.y + ',' + dir.x + ', 0,' + dist + 'deg)';
  }

  var applyBoxShadow = function(el, dist, dir) {
    el.style.boxShadow = -dir.x + 'px ' + -dir.y + 'px ' + '24px 0 rgba(0, 0, 0, 0.16)';
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

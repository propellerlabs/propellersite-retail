window.onload = function() {
  var canvas = document.getElementById('canvas'),
      context = canvas.getContext('2d');

  var canvasWidth = window.outerWidth;
  var canvasHeight = window.outerHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  var rectWidth = 8;
  var rectHeight = 8;
  var gutterWidth = 2;
  var gutterHeight = 2;

  var xTrans = rectWidth + gutterWidth;
  var yTrans = rectHeight + gutterHeight;

  const numX = Math.floor(canvasWidth / xTrans - 1);
  const numY = Math.floor(canvasHeight / yTrans - 1);
  var x = 0;

  context.fillStyle = '#eee';

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  for (var i = 0; i < numX; i++) {
    var y = 0;
    if (i > 0) {
      x += xTrans;
    }
    for (var j = 0; j < numY; j++) {
      const color = getRandomArbitrary(250, 255);
      context.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')';
      context.fillRect(x, y, rectWidth, rectHeight);
      y += yTrans;
    }
  }
}

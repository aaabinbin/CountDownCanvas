var WINDOW_WIDTH = document.body.clientWidth
var WINDOW_HEIGHT = document.body.clientHeight
var RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1
var MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5)
var MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10)

// var endTime = new Date ()
// endTime.setTime(endTime.getTime(endTime) + 3600 * 1000)
var curShowTimeSeconds = 0

var balls = []
const colors = ['#F04747', '#EDA637', '#D9D8DB', '#E25F3F', '#C3D798', '#FFF65F', '#FFC15F']

window.onload = function () {
  var canvas = document.getElementById('canvas')
  var cxt = canvas.getContext('2d')

  canvas.width = WINDOW_WIDTH
  canvas.height = WINDOW_HEIGHT

  curShowTimeSeconds = getCurrentShowTimeSeconds()

  var timer = function () {
    setTimeout(function () {
      update()
      render(cxt)
      timer()
    }, 20)
  }
  timer()
}

function update () {
  var nextShowTimeSeconds = getCurrentShowTimeSeconds()

  var nextHours = parseInt(nextShowTimeSeconds / 3600)
  var nextMinutes = parseInt(nextShowTimeSeconds % 3600 / 60)
  var nextSeconds = parseInt(nextShowTimeSeconds % 60)

  var curHours = parseInt(curShowTimeSeconds / 3600)
  var curMinutes = parseInt(curShowTimeSeconds % 3600 / 60)
  var curSeconds = parseInt(curShowTimeSeconds % 60)
  /* 更新当前时间 */
  if (nextSeconds !== curSeconds) {
    if (parseInt(curHours / 10) !== parseInt(nextHours / 10)) {
      addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10))
    }
    if (parseInt(curHours % 10) !== parseInt(nextHours % 10)) {
      addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours / 10))
    }
    if (parseInt(curMinutes / 10) !== parseInt(nextMinutes / 10)) {
      addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10))
    }
    if (parseInt(curMinutes % 10) !== parseInt(nextMinutes % 10)) {
      addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10))
    }
    if (parseInt(curSeconds / 10) !== parseInt(nextSeconds / 10)) {
      addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10))
    }
    if (parseInt(curSeconds % 10) !== parseInt(nextSeconds % 10)) {
      addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds % 10))
    }
    curShowTimeSeconds = nextShowTimeSeconds
  }

  updateBalls()
}

function getCurrentShowTimeSeconds () {
  var curTime = new Date()
  var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds()
  // ret = Math.round(ret / 1000) // 四舍五入
  return ret
}

function render (cxt) {
  cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT)
  var hours = curShowTimeSeconds > 0 ? parseInt(curShowTimeSeconds / 3600) : 0
  var minutes = curShowTimeSeconds > 0 ? parseInt(curShowTimeSeconds % 3600 / 60) : 0
  var seconds = curShowTimeSeconds > 0 ? parseInt(curShowTimeSeconds % 60) : 0
  renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt)
  renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt)
  renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 'colon', cxt)
  renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt)
  renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt)
  renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 'colon', cxt)
  renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt)
  renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt)

  for (var i = 0; i < balls.length; i++) {
    cxt.fillStyle = balls[i].color

    cxt.beginPath()
    cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI)
    cxt.closePath()

    cxt.fill()
  }
}

function renderDigit (x, y, num, cxt) {
  cxt.fillStyle = '#4D4D4D'
  var numArray = digit[num]
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 10; j++) {
      if (numArray[j][i] === 1) {
        cxt.beginPath()
        cxt.arc(x + i * 2 * (RADIUS + 1) + (RADIUS + 1),
          y + j * 2 * (RADIUS + 1) + (RADIUS + 1),
          RADIUS, 0, 2 * Math.PI)
        cxt.fill()
      }
    }
  }
}

/* 更新小球数组的状态值 */
function updateBalls () {
  for (var i = 0; i < balls.length; i++) {
    balls[i].x += balls[i].xv
    balls[i].y += balls[i].yv
    balls[i].yv += balls[i].g

    if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
      balls[i].y = WINDOW_HEIGHT - RADIUS
      balls[i].yv = -balls[i].yv * 0.6
    }

    if (balls[i].x + RADIUS > WINDOW_WIDTH) {
      balls[i].x = WINDOW_WIDTH - RADIUS
      balls[i].xv = -balls[i].xv
    }
  }

  var cnt = 0
  for (var i = 0; i < balls.length; i++) {
    // 球心加上半径比0小就直接去掉
    if (balls[i].x + RADIUS > 0) {
      balls[cnt++] = balls[i]
    }
  }

  while (balls.length > Math.min(1000, cnt)) {
    balls.pop()
  }
}

/* 触发时间变化时候产生小球 */
function addBalls (x, y, num) {
  var numArray = digit[num]
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 10; j++) {
      if (numArray[j][i] === 1) {
        var aBall = {
          x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
          y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
          g: 1.5 + Math.random(),
          xv: Math.pow(-1, Math.ceil(Math.random() * 100)) * 4,
          yv: -3,
          color: colors[Math.ceil(Math.random() * 100) % colors.length]
        }
        balls.push(aBall)
      }
    }
  }
}

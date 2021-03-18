var HEIGHT = 600;
var WIDTH = 800;
var PADDING = 50;
function main() {
  var canvas = document.getElementById('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  function add_point(neigh) {
    //let color = ctx.getImageData(e.clientX - canvas.offsetLeft,  e.clientY, 1, 1).data;
    // color = Array.from(color);
    // color.splice(color.length - 1, 1);
    // color = color.join(' ');
    //let c;
    // 'orange', 'blue', 'green', 'purple',
    // switch(color){
    //   case '128 0 128': // -фиолетовый
    //   c = 3;
    //   break;
    //   case '0 0 255': //   -синий
    //   c = 1;
    //   break;
    //   case '255 165 0': // -желтый
    //   c = 0;
    //   break;
    //   case '0 128 0': // -зеленый
    //   c = 2;
    //   break;
    // }
    //  redraw();
    //var ctx = canvas.getContext('2d');
    // ctx.beginPath();
    var p = get_click_coords(canvas);
    var neighbors = find_neighbors(p, state.points, state.k, state.metric);
    state.dum_neigh = neighbors;
    var c = majority_vote(neighbors, state.num_classes);
    c = Math.abs((c - p[1]));
    state.dummies.push([neigh, c]);

  }


  var ctx = canvas.getContext('2d');
  ctx.height = HEIGHT;
  ctx.width = WIDTH;

  // var num_classes = 3;
  // var num_points = 10;
  // var metric = l2_distance;
  // var k = 1;

  var state = {
    num_classes: 7,
    num_points: 36,
    cluster_std: 50,
    metric: l2_distance,
    dataset: generate_sin,
    k: 1,
    colors: [
      'red', 'blue', 'green', 'purple', 'orange',
    ],
    small_step: 3,
    big_step: 10,
    dummies: [],
    dum_neigh: 1
  };

  function gen_points() {
    state.points = state.dataset(ctx, state.num_classes, state.num_points, state.cluster_std);
    let cls = [0, 0, 0, 0];
    state.points.forEach(item => {
      $(`.cls-num-${item[2]} span`).text((i, _str) => {
        cls[item[2]] += 1;
        return cls[item[2]];
      })
    });
  }
  gen_points();
  redraw();
  draw_points(ctx, state.points, state.num_points);
  // for (var i = 1; i < state.num_points; i++) {
  //   state.k = i;
  //   add_point(i);
  // }
  function redraw(speed) {
    // ctx.fillStyle = "lightgrey";
    // ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.clearRect(PADDING, PADDING, ctx.width - PADDING * 2, ctx.height - PADDING * 2);
    ctx.strokeStyle = "#333"
    //axe y
    let yLen = ctx.height - PADDING * 2;
    ctx.beginPath();
    ctx.moveTo(PADDING / 2, PADDING);
    ctx.lineTo(PADDING / 2, ctx.height - PADDING / 2);
    ctx.closePath();
    ctx.stroke();
    //axe x
    let xLen = ctx.width - PADDING * 2;
    ctx.beginPath();
    ctx.moveTo(PADDING / 2, ctx.height - PADDING / 2);
    ctx.lineTo(ctx.width - PADDING, ctx.height - PADDING / 2);
    ctx.closePath();
    ctx.stroke();
    //ticks x
    for (let i = 1, l = 7; i < l; i++) {
      ctx.beginPath();
      ctx.moveTo(xLen / (l - 1) * i, ctx.height - PADDING / 2);
      ctx.lineTo(xLen / (l - 1) * i, ctx.height - PADDING / 2 + 10);
      ctx.closePath();
      ctx.stroke();

      ctx.textAlign = 'center'
      ctx.strokeText(`${1 * i}`, xLen / (l - 1) * i, ctx.height - PADDING / 2 + 20);
    }
    //ticks y
    for (let i = 1, l = 10; i < l; i++) {
      ctx.beginPath();
      ctx.moveTo(PADDING / 2, PADDING + yLen / l * i);
      ctx.lineTo(PADDING / 2 - 10, PADDING + yLen / l * i);
      ctx.closePath();
      ctx.stroke();
    }
    // draw_points(ctx, state.dummies, state.num_points)
    console.log('object :>> ', xLen, yLen);
    ///////////////////

    // var step = state.small_step;
    // if (speed === 'fast') step = state.big_step;
    // ctx.clearRect(0, 0, ctx.width, ctx.height);
    // draw_boundaries(ctx, state, step);
    // draw_points(ctx, state.points, state.colors);
    // if(dragging_point == null)
    //   draw_dummies(ctx, state.dummies.slice(-1), state.colors, state.k, state.metric, state.dum_neigh);
  }

  // Handlers for metric buttons
  $('#l2-btn').click(function () {
    // state.metric = l2_distance;
    state.metric = l2_distance;
    state.dummies = [];
    redraw();
  });
  $('#l1-btn').click(function () {
    state.metric = l1_distance;
    state.dummies = [];
    redraw();
  });

  // Handlers for dataset buttons
  $('#circles-btn').click(function () {
    state.dataset = generate_cluster_points_circles;
    gen_points();
    redraw();
  });
  $('#moonshapes-btn').click(function () {
    state.dataset = generate_cluster_points_moonshapes;
    gen_points();
    redraw();
  });
  $('#random-btn').click(function () {
    state.dataset = generate_cluster_points_random;
    gen_points();
    redraw();
  });

  // Handlers for buttons that set K
  for (var k = 1; k <= 7; k++) {
    (function () {
      var kk = k;
      $('#k-' + k + '-btn').click(function () {
        state.k = kk;
        redraw();
      });
    })();
  }

  // Handlers for buttons that set number of classes
  for (var c = 2; c <= 5; c++) {
    (function () {
      var cc = c;
      $('#num-cls-' + c + '-btn').click(function () {
        state.num_classes = cc;
        state.dummies = [];
        gen_points();
        redraw();
      });
    })();
  }

  var num_points_choices = [20, 30, 40, 50, 60];
  for (var i = 0; i < num_points_choices.length; i++) {
    (function () {
      var num_points = num_points_choices[i];
      var s = '#num-pts-' + num_points + '-btn';
      $('#num-pts-' + num_points + '-btn').click(function () {
        state.num_points = num_points;
        gen_points();
        state.dummies = [];
        redraw();
      });
    })();
  }

  var dragging_point = null;
  $(canvas).mousedown(function (e) {
    var p = get_click_coords(canvas, e);
    var thresh = 10;
    var idx = null;
    var min_dist = 100000;
    for (var i = 0; i < state.num_points; i++) {
      var dx = (p[0] - state.points[i][0]);
      var dy = (p[1] - state.points[i][1]);
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < thresh && d < min_dist) {
        min_dist = d;
        idx = i;
      }
    }
    dragging_point = idx;
  });
  $(canvas).mousemove(function (e) {
    if (dragging_point === null) return;
    var p = get_click_coords(canvas, e);
    state.points[dragging_point][0] = p[0];
    state.points[dragging_point][1] = p[1];
    redraw('fast');
  });
  $(canvas).mouseup(function () {
    if (dragging_point === null) return;
    dragging_point = null;
    redraw();
  })

}


function get_click_coords(obj, e) {
  let x = 150 + 70 * Math.random();
  //age
  let y = 18 + 72 * Math.random();
  let c = ((x - 100) + y / 10) * .9;
  return [x, y, c];
}



function randn() {
  // Using Box-Muller transform
  var u = 1 - Math.random();
  var v = 1 - Math.random();
  var r = Math.sqrt(-2 * Math.log(u));
  var t = Math.cos(2 * Math.PI * v);
  return r * t;
}


function generate_sin(ctx, num_classes, num_points) {
  var points = [];
  for (var i = 0; i < num_points; i++) {
    var x = 2 * Math.random() * Math.PI;
    var y = Math.sin(x) + Math.floor(Math.random() + 0.15) ?? Math.random();
    // console.log('x, y :>> ', x, y);
    points.push([x, y]);
  }
  return points;
}

function draw_points(ctx, points, q) {
  for (var i = 0; i < points.length; i++) {
    // var xK = (x, _q) => {
    //   return Math.floor(PADDING + (WIDTH - PADDING * 2) / x)
    // };
    // var yK = (y, _q) => {
    //   return Math.floor(PADDING + (HEIGHT - PADDING * 2) / y)
    // };
    // var x = xK(points[i][0], q);
    // var y = yK(points[i][1], q);
    var x = 50 + points[i][0] * 100;
    var y = 250+ points[i][1] * 100;
    console.log('x, y :>> ', x, y);
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = 'black';
    ctx.strokeStyle = "black";
    ctx.beginPath();
    // ctx.moveTo(x, y);
    // ctx.lineTo(xPrev, yPrev);
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.stroke();
  }
}
function draw_dummies(ctx, points, colors, k, metric, neighbors) {
  draw_points(ctx, points, colors);
  if (points.length == 0 || neighbors == null)
    return;
  makeBound(ctx, points[points.length - 1], points, k, metric, neighbors);
}
function makeBound(ctx, p, points, k, metric, neighbors) {
  // ctx.lineWidth = 1;
  // ctx.strokeStyle = '#003300';
  // ctx.stroke();
  let npop = neighbors[neighbors.length - 1];
  let radius = metric(npop, p);
  if (metric == l2_distance) {
    ctx.beginPath();
    ctx.arc(p[0], p[1], radius, 0, 2 * Math.PI);
  }
  else if (metric == l1_distance)
    ctx.diamond(p[0], p[1], radius, radius);
  ctx.stroke();

}

function l2_distance(p1, p2) {
  var dx = p1[0] - p2[0];
  var dy = p1[1] - p2[1];

  return Math.sqrt(dx * dx + dy * dy);
}


function l1_distance(p1, p2) {
  var dx = p1[0] - p2[0];
  var dy = p1[1] - p2[1];
  return Math.abs(dx) + Math.abs(dy);
}
function l_inf(p1, p2) {
  var dx = p1[0] - p2[0];
  var dy = p1[1] - p2[1];
  return Math.abs(dx) + Math.abs(dy);
}


function find_neighbors(p, points, k, metric) {
  var dists = [];
  for (var i = 0; i < points.length; i++) {
    var dist = metric(p, points[i]);
    dists.push([dist, points[i]]);
  }
  dists.sort(function (a, b) { return a[0] - b[0] });
  var neighbors = [];
  for (var i = 0; i < k && i < dists.length; i++) {
    neighbors.push(dists[i][1]);
  }
  return neighbors;
}


function majority_vote(points, num_classes) {
  let n = 0;
  for (var i = 0; i < points.length; i++) {
    n += points[i][0];
  }
  n /= points.length;
  return n;
}


function draw_boundaries(ctx, state, step) {
  var eps = 0;
  for (var x = step / 2; x < ctx.width; x += step) {
    for (var y = step / 2; y < ctx.height; y += step) {
      var neighbors = find_neighbors([x, y], state.points, state.k, state.metric);
      var c = majority_vote(neighbors, state.num_classes);

      if (c !== null) {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = state.colors[c];
        ctx.fillRect(
          x - step / 2 - eps,
          y - step / 2 - eps,
          step + 2 * eps,
          step + 2 * eps);
      }
    }
  }
}


$(main);

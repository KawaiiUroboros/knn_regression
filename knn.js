var HEIGHT = 600;
var WIDTH = 800;
var PADDING = 50;
function main() {
  var canvas = document.getElementById('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  function add_point(i) {
    var p = i;
    var neighbors = find_neighbors(p, state.points, state.k, state.metric);
    var c = majority_vote(neighbors, state.num_classes);
    state.dummies.push([i, c]);
  }

  var ctx = canvas.getContext('2d');
  ctx.height = HEIGHT;
  ctx.width = WIDTH;

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
    dum_x: [],
    dum_neigh: 1
  };

  function gen_points() {
    state.points = state.dataset(ctx, state.num_classes, state.num_points, state.cluster_std, state.dum_x);
    let cls = [0, 0, 0, 0];
    state.points.forEach(item => {
      $(`.cls-num-${item[2]} span`).text((i, _str) => {
        cls[item[2]] += 1;
        return cls[item[2]];
      })
    });
  }
  // setK
  for (var k = 1; k <= 7; k++) {
    (function () {
      var kk = k;
      $('#k-' + k + '-btn').click(function () {
        state.k = kk;
        state.points = [];
        state.dummies = [];

        gen_points();
        redraw();
        draw_points(ctx, state.points, 'yellow');
        for (var i = 1; i < state.dum_x.length; i++) {
          add_point(state.dum_x[i]);
        }
        draw_points(ctx, state.dummies, 'orange');
      });
    })();
  }

  gen_points();
  redraw();
  draw_points(ctx, state.points, 'yellow');
  for (var i = 1; i < state.dum_x.length; i++) {
    add_point(state.dum_x[i]);
  }
  draw_points(ctx, state.dummies, 'orange');

  function redraw(speed) {
    // ctx.fillStyle = "lightgrey";
    // ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.lineWidth = 1;
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
    for (let i = 1, l = 4; i < l; i++) {
      ctx.beginPath();
      ctx.moveTo(PADDING / 2, PADDING + yLen / l * i);
      ctx.lineTo(PADDING / 2 - 10, PADDING + yLen / l * i);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function generate_sin(ctx, num_classes, num_points, b, dum_x) {
  var points = [];
  for (var i = 0; i < num_points * 2.5; i++) {
    var x = i * Math.PI * 1.5 / num_points/2;
    var y = Math.sin(x) + Math.random() * 0.22;
    x *= ((ctx.width - PADDING * 2) / 6);
    y *= ((ctx.height - PADDING * 2) / 3);
    if(i == 0){
      dum_x.push(x+0.1);
      dum_x.push(x+0.1);
    }
    if (i % 4 == 0)
      points.push([x, y]);
    
      dum_x.push(x + -1.5);
      dum_x.push(x + .5);
      dum_x.push(x + 1.25);
      dum_x.push(x + 2.65);
      dum_x.push(x + 2.15);
      dum_x.push(x-.5);
      dum_x.push(x + 1.1);
      dum_x.push(x+.25);
      dum_x.push(x+.1);
      dum_x.push(x-2);
      dum_x.push(x+2);
      dum_x.push(x+1);
      dum_x.push(x-1);
    
  }
  return points;
}

function draw_points(ctx, points, col) {
  points.sort(function (a, b) { return a[0] - b[0] });
  var x2, y2;
  for (var i = 0; i < points.length; i++) {
    var x = 50 + points[i][0];
    var y = 250 + points[i][1];

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = col;
    // ctx.beginPath();
    ctx.lineWidth = 3;
    //ТЕСТОВЫЕ ТОЧКИ
    if(col == "orange"){
      //  ctx.beginPath();
      // ctx.arc(x, y, 3, 0, 2 * Math.PI);
      // ctx.strokeStyle = 'blue';
      // ctx.stroke();
      // ctx.closePath(); 

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      // ctx.lineTo(x, y2);
      ctx.lineTo(x, y);
      ctx.strokeStyle = col;
      ctx.stroke();
      ctx.closePath();
    }
    //ОБЫКНОВЕННЫЕ ТОЧКИ
    if(col == "yellow") {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.closePath();
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.fill();
    };
    x2 = x;
    y2 = y;
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
  var dx = p1 - p2[0];
  return Math.sqrt(dx * dx);
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
    neighbors.push(dists[i][1][1]);
  }
  return neighbors;
}
function majority_vote(points, num_classes) {
  let n = 0;
  for (var i = 0; i < points.length; i++) {
    n += points[i];
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

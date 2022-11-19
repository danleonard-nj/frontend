function chunk(arr, n) {
  var r = Array(Math.ceil(arr.length / n)).fill();
  return r.map((e, i) => arr.slice(i * n, i * n + n));
}

export { chunk };

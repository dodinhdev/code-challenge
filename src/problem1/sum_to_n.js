function assertInteger(n) {
  if (!Number.isInteger(n)) {
    throw new TypeError(`Expected integer, received: ${typeof n === 'number' ? n : typeof n}`);
  }
}

// Iterative loop. O(n) time, O(1) space.
var sum_to_n_a = function (n) {
  assertInteger(n);
  let total = 0;
  const step = n < 0 ? -1 : 1;
  for (let i = step; Math.abs(i) <= Math.abs(n); i += step) {
    total += i;
  }
  return total;
};

// Closed-form (Gauss): n*(n+1)/2. O(1) time and space.
var sum_to_n_b = function (n) {
  assertInteger(n);
  const absN = Math.abs(n);
  return (Math.sign(n) * absN * (absN + 1)) / 2;
};

// Functional: build the sequence with Array.from, then reduce. O(n) time and space.
var sum_to_n_c = function (n) {
  assertInteger(n);
  const sign = Math.sign(n);
  return Array.from({ length: Math.abs(n) }, (_, i) => (i + 1) * sign)
    .reduce((acc, x) => acc + x, 0);
};

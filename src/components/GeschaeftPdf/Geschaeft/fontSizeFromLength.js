export default (length) =>
  length < 400
    ? 13
    : length < 700
    ? 12
    : length < 1000
    ? 11
    : length < 1500
    ? 10
    : length < 2000
    ? 9
    : length < 2500
    ? 8
    : 7

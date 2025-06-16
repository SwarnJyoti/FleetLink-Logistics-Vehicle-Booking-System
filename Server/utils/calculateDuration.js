function calculateRideDuration(fromPincode, toPincode) {
  const from = parseInt(fromPincode);
  const to = parseInt(toPincode);
  const duration = Math.abs(to - from) % 24;
  return duration;
}

module.exports = calculateRideDuration;

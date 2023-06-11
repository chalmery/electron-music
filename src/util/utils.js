function formatTime(seconds) {
  const totalSeconds = Math.floor(seconds); // 取整数部分
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const formattedMins = mins.toString().padStart(2, "0");
  const formattedSecs = secs.toString().padStart(2, "0");
  return `${formattedMins}:${formattedSecs}`;
}

export default formatTime
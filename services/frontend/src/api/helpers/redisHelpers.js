const secondsToString = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  let timeString = '';

  if (hours > 0) {
    timeString += `${hours} hour(s) `;
  }
  if (minutes > 0) {
    timeString += `${minutes} minute(s) `;
  }
  if (remainingSeconds > 0) {
    timeString += `${remainingSeconds} second(s)`;
  }

  return timeString.trim(); // Trim any trailing whitespace
};

const snakeCaseToNormal = (snakeCaseString) => {
  const words = snakeCaseString.split('_');
  const normalString = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return normalString;
};

export { secondsToString, snakeCaseToNormal };

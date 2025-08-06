export default function (sec: number, pixelsInSeconds: number = 0): string {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = Math.floor(sec % 60);
  const miliseconds = Math.floor((sec - Math.floor(sec)) * 1000);

  let display = "";
  if (hours > 0) {
    if (hours < 10) {
      display += 0;
    }
    display += `${hours}:`;
  }

  if (minutes < 10) {
    display += 0;
  }

  display += `${minutes}:`;

  if (seconds < 10) {
    display += 0;
  }

  display += `${seconds}`;

  if (pixelsInSeconds > 50) {
    display += ":";
    if (miliseconds < 100) {
      display += 0;
    }
    if (miliseconds < 10) {
      display += 0;
    }

    display += miliseconds;
  }

  return display;
}

export class Xbox360Settings {
  // debug information like console.log?
  public debug?: boolean = false;
  // miliseconds between reads input = default: 1000 / (60FPS * 4 devices)
  public delayInput?: number = 4;
  // miliseconds between state change device = default: 500 / 4 devices
  public delayDetectDevice?: number = 125;
}

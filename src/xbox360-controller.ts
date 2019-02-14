import { EventEmitter } from "events";
import * as Gamepad from "gamepad";
import { Xbox360Settings } from "./xbox360-settings";

export class Xbox360Controller extends EventEmitter {
  private options: Xbox360Settings;

  constructor(options?: Xbox360Settings) {
    super();
    Gamepad.init();
    this.options = options || new Xbox360Settings();
    this.debugModeSetting();
    Object.assign(this, Gamepad.__proto__, Gamepad);
  }

  public shutdown() {
    Gamepad.shutdown();
  }

  public run() {
    for (let i = 0, l = Gamepad.numDevices(); i < l; i++) {
      console.log(i, Gamepad.deviceAtIndex());
    }

    // Create a game loop and poll for events
    setInterval(Gamepad.processEvents, Number(this.options.delayInput));
    // Scan for new Gamepads as a slower rate
    setInterval(Gamepad.detectDevices, Number(this.options.delayDetectDevice));

    // Listen for move events on all Gamepads
    Gamepad.on("move", (id, axis, value) => {
      console.log("move", {
        id,
        axis,
        value,
      });
    });

    // Listen for button up events on all Gamepads
    Gamepad.on("up", (id, num) => {
      console.log("up", {
        id,
        num,
      });
    });

    // Listen for button down events on all Gamepads
    Gamepad.on("down", (id, num) => {
      console.log("down", {
        id,
        num,
      });
    });
  }

  private debugModeSetting() {
    if (!this.options.debug) {
      ((proxied) => {
        console.log = () => {
          return proxied.apply(this);
        };
      })(console.log);
    }
  }
}

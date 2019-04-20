import { EventEmitter } from "events";
import * as Gamepad from "gamepad";
import { Xbox360Settings } from "./xbox360-settings";
import { GamepadAxis, GamepadButton } from "./xbox360-model"

export class Xbox360Controller extends EventEmitter {
  private options: Xbox360Settings;

  public moveHandler?: (value: GamepadAxis) => void;

  public pressHandler?: (value: GamepadButton) => void;

  public releaseHandler?: (value: GamepadButton) => void;

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
      const move = { id, axis, value};
      console.log("move", move);
      if (this.moveHandler) {
        this.moveHandler(move);
      }
    });

    // Listen for button up events on all Gamepads
    Gamepad.on("up", (id, num) => {
      const button = { id, num };
      console.log("up", button);
      if (this.releaseHandler) {
        this.releaseHandler(button);
      }
    });

    // Listen for button down events on all Gamepads
    Gamepad.on("down", (id, num) => {
      const button = { id, num };
      console.log("down", button);
      if (this.pressHandler) {
        this.pressHandler(button);
      }
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

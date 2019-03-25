import { Axis, Button } from "./xbox360-mappings";

export interface GamepadAxis {
    id: number;
    axis: Axis;
    value: number;
}

export interface GamepadButton {
    id: number;
    num: Button;
}

export interface IMotionData {
    accelerometer: {
      x: number;
      y: number;
      z: number;
    };
    gyroscope: {
      x: number;
      y: number;
      z: number;
    };
    position: {
      lat: number;
      lng: number;
    };
    timestamp?: number;
}
export interface ScanProxy {
  x: number;
  y: number;
  z: number;
  rotY: number;
  scale: number;
  sensorGlow: number;
  beamOpacity: number;
  beamLength: number;
}

/** Стартовое состояние: робот скрыт за углом сцены, вне поля зрения. */
export function createScanProxy(): ScanProxy {
  return {
    x: 3.2,
    y: -2.4,
    z: -1,
    rotY: 0.6,
    scale: 0.001,
    sensorGlow: 0.2,
    beamOpacity: 0,
    beamLength: 0.05,
  };
}

export function raDecToCartesian(ra, dec) {
  const raRad = (ra / 180) * Math.PI;
  const decRad = (dec / 180) * Math.PI;
  const x = Math.cos(decRad) * Math.cos(raRad);
  const y = Math.cos(decRad) * Math.sin(raRad);
  const z = Math.sin(decRad);
  return [x, y, z];
}

export function hmsToDegrees(hms) {
  const [h, m, s] = hms.split(":").map(Number);
  return (h + m / 60 + s / 3600) * 15;
}

export function dmsToDegrees(dms) {
  const [d, m, s] = dms.split(":").map(Number);
  const sign = d < 0 ? -1 : 1;
  return sign * (Math.abs(d) + m / 60 + s / 3600);
}

export function raDecToXYZ(raj, decj, radius = 95) {
  const ra = (hmsToDegrees(raj) * Math.PI) / 180;
  const dec = (dmsToDegrees(decj) * Math.PI) / 180;

  const x = radius * Math.cos(dec) * Math.cos(ra);
  const y = radius * Math.sin(dec);
  const z = radius * Math.cos(dec) * Math.sin(ra);

  return [x, y, z];
}
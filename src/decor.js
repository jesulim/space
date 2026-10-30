// Manchas de taza por sección (los granos son 3D, ver BeanCanvas).
// x/y en % de la sección · s tamaño en px · seed forma del anillo
// mobile: true si también se muestra en pantallas angostas
export const DECOR = {
  hero: [{ x: 63, y: 70, s: 320, seed: 3 }],
  idea: [{ x: 82, y: 6, s: 280, seed: 21, mobile: true }],
  mostrador: [{ x: -2, y: 74, s: 260, seed: 42, mobile: true }],
  equipo: [{ x: 84, y: 5, s: 290, seed: 8, mobile: true }],
  receta: [{ x: 78, y: 86, s: 270, seed: 57, mobile: true }],
  deploy: [{ x: -4, y: 66, s: 300, seed: 33, mobile: true }],
  reto: [{ x: 4, y: 90, s: 240, seed: 64 }],
};

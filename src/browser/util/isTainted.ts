export default function isTainted(ctx: CanvasRenderingContext2D) {
  try {
    ctx.getImageData(0, 0, 1, 1);
    return false;
  } catch (err) {
    return true;
  }
}

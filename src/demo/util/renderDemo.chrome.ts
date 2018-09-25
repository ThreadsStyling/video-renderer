// This code execute in Chrome browser.
import {filterComplex, render, Asset, ComplexFilter} from '../../browser';

export const main = async (assets: string[], complexFilters: ComplexFilter[]) => {
  const inputs = await Promise.all(assets.map((img) => Asset.fromImage(img)));
  const canvas = document.createElement('canvas');

  canvas.style.width = inputs[0].width + 'px';
  canvas.style.height = inputs[0].height + 'px';
  canvas.style.margin = 'auto';
  canvas.style.display = 'block';
  document.body.appendChild(canvas);
  render(canvas, filterComplex(inputs, complexFilters));
};

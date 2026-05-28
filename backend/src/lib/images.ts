import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'data', 'product-images.json');

interface ImageMap {
  [productName: string]: string;
}

function readImages(): ImageMap {
  try {
    if (!existsSync(DATA_FILE)) return {};
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function writeImages(data: ImageMap): void {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function getProductImage(name: string): string | null {
  const images = readImages();
  return images[name] || null;
}

export function getAllImages(): ImageMap {
  return readImages();
}

export function setProductImage(name: string, url: string): void {
  const images = readImages();
  images[name] = url;
  writeImages(images);
}

export function removeProductImage(name: string): void {
  const images = readImages();
  delete images[name];
  writeImages(images);
}

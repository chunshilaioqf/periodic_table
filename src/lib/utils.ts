import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getElectronConfiguration(atomicNumber: number): number[] {
  const shells = [];
  let remaining = atomicNumber;
  const capacities = [2, 8, 18, 32, 32, 18, 8];
  
  for (const cap of capacities) {
    if (remaining <= 0) break;
    const count = Math.min(remaining, cap);
    shells.push(count);
    remaining -= count;
  }
  return shells;
}

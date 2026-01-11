import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CookieService {
  private document = inject(DOCUMENT);

  get(name: string): string | null {
    const cookies = this.document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) return decodeURIComponent(value);
    }
    return null;
  }

  /**
   * Get all available cookies as an object
   * Note: HttpOnly cookies cannot be read by JavaScript
   */
  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!this.document.cookie) {
      return cookies;
    }

    const cookieStrings = this.document.cookie.split('; ');
    for (const cookie of cookieStrings) {
      const [key, value] = cookie.split('=');
      if (key && value) {
        try {
          cookies[key.trim()] = decodeURIComponent(value);
        } catch {
          cookies[key.trim()] = value;
        }
      }
    }
    return cookies;
  }

  /**
   * Try to get a cookie with multiple possible name variations
   */
  getWithVariations(baseName: string, variations: string[] = []): string | null {
    // Try exact match first
    const exactMatch = this.get(baseName);
    if (exactMatch) return exactMatch;

    // Try common variations
    const commonVariations = [
      baseName.replace('_', '-'),
      baseName.replace('-', '_'),
      baseName.toLowerCase(),
      baseName.toUpperCase(),
    ];

    const allVariations = [...commonVariations, ...variations];
    for (const variation of allVariations) {
      const value = this.get(variation);
      if (value) return value;
    }

    return null;
  }

  delete(name: string): void {
    this.document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  set(name: string, value: string, expires: Date): void {
    this.document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
  }
}

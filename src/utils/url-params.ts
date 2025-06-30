export class UrlParams {
  private params: URLSearchParams;

  constructor() {
    this.params = new URLSearchParams(window.location.search);
  }

  /**
   * Get a parameter value by key
   */
  get(key: string): string | null {
    return this.params.get(key);
  }

  /**
   * Get all parameters as a record object
   */
  getAll(): Record<string, string> {
    const result: Record<string, string> = {};
    this.params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Set a parameter value
   */
  set(key: string, value: string): void {
    this.params.set(key, value);
    this.updateUrl();
  }

  /**
   * Remove a parameter
   */
  remove(key: string): void {
    this.params.delete(key);
    this.updateUrl();
  }

  /**
   * Check if a parameter exists
   */
  has(key: string): boolean {
    return this.params.has(key);
  }

  /**
   * Get all values for a parameter (useful for arrays)
   */
  getAllValues(key: string): string[] {
    return this.params.getAll(key);
  }

  /**
   * Update the URL without causing a page reload
   */
  private updateUrl(): void {
    const newUrl = `${window.location.pathname}?${this.params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

  /**
   * Refresh parameters from current URL
   */
  refresh(): void {
    this.params = new URLSearchParams(window.location.search);
  }

  /**
   * Clear all parameters
   */
  clear(): void {
    this.params = new URLSearchParams();
    this.updateUrl();
  }

  /**
   * Get the current search string
   */
  toString(): string {
    return this.params.toString();
  }
}

/**
 * Create a new UrlParams instance
 */
export function createUrlParams(): UrlParams {
  return new UrlParams();
}

/**
 * Get a single parameter value
 */
export function getUrlParam(key: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Set a parameter value
 */
export function setUrlParam(key: string, value: string): void {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
}

/**
 * Remove a parameter
 */
export function removeUrlParam(key: string): void {
  const params = new URLSearchParams(window.location.search);
  params.delete(key);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
}

/**
 * Get all parameters as an object
 */
export function getAllUrlParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

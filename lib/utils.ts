/**
 * Utility Functions
 */

/**
 * Format price with Mongolian Tugrik (₮)
 */
export function formatPrice(price: number): string {
  if (price === undefined || price === null || isNaN(price)) {
    return '0 ₮';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' ₮';
}

export function formatCurrency(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3-$4');
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate random seed for images
 */
export function getImageSeed(id: string | number): string {
  return `product${id}`;
}

/**
 * Check if product is new (within last 7 days)
 */
export function isNewProduct(id: string): boolean {
  return id.startsWith('new-');
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Generate star rating array
 */
export function getStarRating(rating: number): boolean[] {
  return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
}

/**
 * Debounce function for search
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get absolute API URL for server or client components
 */
export function getApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  // In browser during development, prefer relative paths to avoid CORS issues
  if (
    typeof window !== 'undefined' && 
    process.env.NODE_ENV === 'development'
  ) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  if (!baseUrl) return path.startsWith('/') ? path : `/${path}`;
  
  // Ensure we don't double slash
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBase}${cleanPath}`;
}

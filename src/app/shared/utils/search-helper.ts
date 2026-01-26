// src/app/shared/utils/search-helper.ts

/**
 * Safely gets a nested value from an object using dot notation.
 * Example: getNestedValue(product, 'category.name') -> 'Electronics'
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => {
    return acc && acc[part] ? acc[part] : ''; 
  }, obj);
}

/**
 * Generic search function that supports nested properties.
 * @param searchTerm The text user typed
 * @param sourceArray The "Master Backup" array
 * @param keys The paths to search in (e.g. ['name', 'category.name'])
 */
export function filterData<T>(
  searchTerm: string, 
  sourceArray: T[], 
  keys: string[] 
): T[] {
  // 1. If empty, return everything
  if (!searchTerm || searchTerm.trim() === '') {
    return sourceArray;
  }

  // 2. Normalize
  const lowerTerm = searchTerm.toLowerCase();

  // 3. Filter
  return sourceArray.filter(item => {
    return keys.some(key => {
      // Use the helper to get the value, even if it's deep inside
      const val = getNestedValue(item, key);
      return String(val).toLowerCase().includes(lowerTerm);
    });
  });
}
function addLocalStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    throw new Error("Error adding item to local storage: " + e);
  }
}

function updateLocalStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    throw new Error("Error updating item in local storage: " + e);
  }
}

function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    throw new Error("Error removing item from local storage: " + e);
  }
}
function getLocalStorageItem(key: string): string | null {
  try {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem(key);
      return value || "";
    }
    return "";
  } catch (e) {
    throw new Error(`Error getting item from local storage: ${e}`);
  }
}

export {
  addLocalStorageItem,
  updateLocalStorageItem,
  removeLocalStorageItem,
  getLocalStorageItem,
};

export const STORAGE_KEYS = {
  MONTH_DATA_LIST: "monthDataList",
  DATABASE: "database",
  ADVANCE_DATABASE: "advanceDatabase",
};

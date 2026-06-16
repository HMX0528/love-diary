import { createContext, useContext, useState, useEffect, useCallback } from "react";
import defaultContent from "../data/defaultContent";
import { saveImage, getAllImages as getIDBImages, clearAllImages } from "../utils/imageDB";

const STORAGE_KEY = "sweet-memories-content";
const AdminContext = createContext(null);

function safeSave(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); return true; }
  catch (e) {
    if (e.name === "QuotaExceededError" || e.code === 22) {
      alert("存储空间已满！请删除一些旧照片后再试。");
    }
    return false;
  }
}

function loadSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return extendArrays(mergeDeep(defaultContent, parsed), defaultContent);
    }
  } catch (e) { console.warn("loadSaved:", e); }
  return JSON.parse(JSON.stringify(defaultContent));
}

const mergeDeep = (target, source) => {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = mergeDeep(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};

const extendArrays = (merged, defaults) => {
  const result = { ...merged };
  for (const key of Object.keys(defaults)) {
    if (Array.isArray(defaults[key]) && Array.isArray(result[key]) && defaults[key].length > result[key].length) {
      const existingIds = new Set(result[key].map((item) => (item && item.id) ?? null).filter(Boolean));
      const newItems = defaults[key].filter((item) => item && item.id && !existingIds.has(item.id));
      if (newItems.length > 0) result[key] = [...result[key], ...newItems];
    }
  }
  return result;
};

async function fetchServerContent() {
  try {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

function saveToServer(data) {
  try {
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});
  } catch {}
}

export const AdminProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const [content, setContentState] = useState(loadSaved);
  const [dirty, setDirty] = useState(false);
  const [importedImages, setImportedImages] = useState({});
  const [imagesReady, setImagesReady] = useState(false);

  // Load IndexedDB images
  useEffect(() => {
    getIDBImages().then((images) => {
      if (Object.keys(images).length > 0) { setImportedImages(images); setImagesReady(true); return; }
      try {
        const saved = localStorage.getItem("sweet-memories-images");
        if (saved) {
          const legacy = JSON.parse(saved);
          setImportedImages(legacy);
          for (const [path, dataUrl] of Object.entries(legacy)) saveImage(path, dataUrl).catch(() => {});
          localStorage.removeItem("sweet-memories-images");
        }
      } catch {}
      setImagesReady(true);
    });
  }, []);

  // Load server data on mount (sync across devices)
  useEffect(() => {
    fetchServerContent().then((serverData) => {
      if (serverData && serverData.hero) {
        setContentState((prev) => {
          const merged = mergeDeep(prev, serverData);
          safeSave(STORAGE_KEY, merged);
          return merged;
        });
      }
    });
  }, []);

  const setContent = useCallback((updater) => {
    setContentState((prev) => {
      const newContent = typeof updater === "function" ? updater(prev) : updater;
      return newContent;
    });
    setDirty(true);
  }, []);

  const saveContent = useCallback(() => {
    setContentState((prev) => {
      safeSave(STORAGE_KEY, prev);
      saveToServer(prev);
      return prev;
    });
    setDirty(false);
  }, []);

  useEffect(() => {
    const onUnload = () => {
      if (dirty) setContentState((prev) => { safeSave(STORAGE_KEY, prev); return prev; });
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [dirty]);

  const importImage = useCallback(async (path, dataUrl) => {
    try { await saveImage(path, dataUrl); } catch {}
    setImportedImages((prev) => ({ ...prev, [path]: dataUrl }));
  }, []);

  const getImage = useCallback((path) => (importedImages[path] || null), [importedImages]);

  const resetAll = useCallback(async () => {
    try { await clearAllImages(); localStorage.removeItem(STORAGE_KEY); } catch {}
    setContentState(JSON.parse(JSON.stringify(defaultContent)));
    setImportedImages({});
    setDirty(false);
  }, []);

  const value = {
    editMode, setEditMode,
    content, setContent,
    saveContent, dirty,
    importImage, getImage, importedImages,
    imagesReady,
    resetAll,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};

export default AdminContext;
export const saveNote = (url: string, note: string) => {
  chrome.storage.local.get(["siteNotes"], (result) => {
    const siteNotes = result.siteNotes || {};
    if (!siteNotes[url]) {
      siteNotes[url] = [];
    }
    siteNotes[url].push(note);
    chrome.storage.local.set({ siteNotes });
  });
};

export const getNotes = (url: string, callback: (notes: string[]) => void) => {
  chrome.storage.local.get(["siteNotes"], (result) => {
    const siteNotes = result.siteNotes || {};
    callback(siteNotes[url] || []);
  });
};

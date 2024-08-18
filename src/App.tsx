import { useEffect, useState } from "react";
import "./App.css";
import { getNotes, saveNote } from "./service";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        const url = new URL(tabs[0].url);
        setCurrentUrl(url.hostname);
        getNotes(url.hostname, (savedNotes) => {
          setNotes(savedNotes);

          // Send notes to content script for highlighting
          chrome.tabs.sendMessage(tabs[0].id as number, {
            action: "highlightNotes",
            notes: savedNotes,
          });
        });
      }
    });
  }, []);

  const handleAddNote = () => {
    if (note.trim() && currentUrl) {
      saveNote(currentUrl, note);
      setNotes((prevNotes) => [...prevNotes, note]);
      setNote("");

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "highlightNotes",
            notes: [...notes, note],
          });
        }
      });
    }
  };

  return (
    <div>
      <p>Made by Mustafa Jawed</p>
      <h2>Notes for {currentUrl}</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter a note..."
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>

      <ul style={{ width: "90%", height: "200px", overflow: "auto" }}>
        {notes.map((n, index) => (
          <li key={index}>{n}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

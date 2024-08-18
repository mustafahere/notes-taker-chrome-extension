chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "highlightNotes") {
    const notes = message.notes || [];
    highlightNotes(notes);
    sendResponse({ status: "Notes highlighted" });
  }
});

function highlightNotes(notes) {
  notes.forEach((note) => {
    highlightText(note);
  });
}

function highlightText(text) {
  const bodyText = document.body.innerHTML;
  const regex = new RegExp(`(${text})`, "gi");
  document.body.innerHTML = bodyText.replace(
    regex,
    '<span style="background-color: yellow;">$1</span>'
  );
}

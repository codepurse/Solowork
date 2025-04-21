export default function NotesList() {
  const notes = [
    {
      id: 1,
      title: "Meeting Notes",
      content: "Discuss project timeline and deliverables for Q2. Need to finalize the UI components by next week.",
    },
    {
      id: 2,
      title: "Shopping List",
      content: "Milk, eggs, bread, fruits, and vegetables. Don't forget to check for sales at the supermarket.",
    },
    {
      id: 3,
      title: "Project Ideas",
      content: "Consider building a task management app with React and Firebase. Focus on real-time updates and offline support.",
    },
    {
      id: 4,
      title: "Book Recommendations",
      content: "Clean Code by Robert Martin, Design Patterns by Gang of Four, and Refactoring by Martin Fowler.",
    },
    {
      id: 5,
      title: "Weekend Plans",
      content: "Hiking trip on Saturday morning, family dinner in the evening. Sunday: coding project and relaxation.",
    },
    {
      id: 6,
      title: "Learning Goals",
      content: "Master TypeScript, learn GraphQL, and improve system design skills. Create a study schedule.",
    },
    {
      id: 7,
      title: "Recipe Ideas",
      content: "Try making homemade pasta with fresh ingredients. Need to buy a pasta maker and semolina flour.",
    },
  ];

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div key={note.id} className="note">
          <h3 className="note-title">{note.title}</h3>
          <p className="note-content">{note.content}</p>
        </div>
      ))}
    </div>
  );
}

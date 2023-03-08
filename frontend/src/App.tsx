import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import Note from "./models/note";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const response = await axios.get("api/notes");
        const { data } = response;

        setNotes(data);
      } catch (error) {
        console.log(error);
      }
    };

    getNotes();
  }, []);

  return <div className="App">{JSON.stringify(notes)}</div>;
}

export default App;

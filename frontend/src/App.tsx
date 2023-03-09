import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import AddNoteDialog from "./components/AddNoteDialog";
import Note from "./components/Note";
import NoteModel from "./models/note";
import styles from "./styles/NotesPage.module.css";

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [isNoteDialogOpen, setNoteDialogOpen] = useState<boolean>(false);

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

  return (
    <Container>
      <Button className="my-4" onClick={() => setNoteDialogOpen(true)}>Add Note</Button>
      <Row xs={1} md={2} xl={3}>
        {notes.map((note) => {
          return (
            <Col className="mb-4" key={note._id}>
              <Note note={note} className={styles.note} />
            </Col>
          );
        })}
      </Row>

      {isNoteDialogOpen && (
        <AddNoteDialog
          onDismiss={() => setNoteDialogOpen(false)}
          onNoteSaved={(note) => {
            setNoteDialogOpen(false);
            setNotes([...notes, note]);
          }}
        />
      )}
    </Container>
  );
}

export default App;

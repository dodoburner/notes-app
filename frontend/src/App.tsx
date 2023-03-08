import axios from "axios";
import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Note from "./components/Note";
import NoteModel from "./models/note";
import styles from "./styles/NotesPage.module.css";

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

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
      <Row xs={1} md={2} xl={3}>
        {notes.map((note) => {
          return (
            <Col className="mb-4">
              <Note note={note} className={styles.note} />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default App;

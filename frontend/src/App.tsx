import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import NoteDialog from "./components/NoteDialog";
import Note from "./components/Note";
import NoteModel from "./models/note";
import styles from "./styles/NotesPage.module.css";
import { FaPlus } from "react-icons/fa";

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [isNoteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
  const [areNotesLoading, setAreNotesLoading] = useState(true);
  const [showNotesLoadError, setShowNotesLoadError] = useState(false);

  useEffect(() => {
    const getNotes = async () => {
      try {
        // setAreNotesLoading(true);
        // setShowNotesLoadError(false);

        const response = await axios.get("api/notes");
        const { data } = response;

        setNotes(data);
      } catch (error) {
        console.log(error);
        setShowNotesLoadError(true);
      } finally {
        setAreNotesLoading(false);
      }
    };

    getNotes();
  }, []);

  const deleteNote = async (note: NoteModel) => {
    try {
      const { _id } = note;

      await axios.delete("/api/notes/" + _id);

      setNotes((prevNotes) => {
        return prevNotes.filter((note) => note._id !== _id);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const notesGrid = () => {
    return (
      <Row xs={1} md={2} xl={3} className="w-100">
        {notes.map((note) => {
          return (
            <Col className="mb-4" key={note._id}>
              <Note
                note={note}
                className={styles.note}
                onNoteClicked={(note) => {
                  setNoteToEdit(note);
                  setNoteDialogOpen(true);
                }}
                onDeleteNoteClick={(note) => deleteNote(note)}
              />
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <Button
        className="my-4 d-flex align-items-center gap-1"
        onClick={() => setNoteDialogOpen(true)}
      >
        <FaPlus />
        Add Note
      </Button>
      {areNotesLoading && <Spinner animation="border" variant="primary" />}
      {showNotesLoadError && <p>Something went wrong, please refresh the page</p>}
      {!areNotesLoading && !showNotesLoadError && (
        <>
          {notes.length > 0 ? notesGrid() : <p>You have no notes yet</p>}
        </>
      )}

      {isNoteDialogOpen && (
        <NoteDialog
          note={noteToEdit}
          onDismiss={() => {
            setNoteDialogOpen(false);
            setNoteToEdit(null);
          }}
          onNoteSaved={(note) => {
            setNoteDialogOpen(false);
            setNotes([...notes, note]);
          }}
          onNoteEdited={(note) => {
            setNoteDialogOpen(false);
            setNotes((prevNotes) => {
              return prevNotes.map((n) => (n._id === note._id ? note : n));
            });
          }}
        />
      )}
    </Container>
  );
}

export default App;

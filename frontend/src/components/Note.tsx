import { Card } from "react-bootstrap";
import NoteModel from "../models/note";
import styles from "../styles/Note.module.css";
import dateFormatter from "../utils/dateFormatter";
import { MdDelete } from "react-icons/md";

interface NoteProps {
  note: NoteModel;
  className?: string;
  onNoteClicked: (note: NoteModel) => void;
  onDeleteNoteClick: (note: NoteModel) => void;
}

const Note = ({
  note,
  className,
  onNoteClicked,
  onDeleteNoteClick,
}: NoteProps) => {
  const { title, text, createdAt, updatedAt } = note;
  let dateText: string;

  if (updatedAt > createdAt) {
    dateText = "Updated at: " + dateFormatter(updatedAt);
  } else {
    dateText = "Created at: " + dateFormatter(createdAt);
  }

  return (
    <Card
      className={`${className} ${styles.noteCard}`}
      onClick={() => onNoteClicked(note)}
    >
      <Card.Body className={styles.noteBody}>
        <Card.Title className="d-flex">
          {title}
          <MdDelete
            className="text-muted ms-auto"
            onClick={(e) => {
              onDeleteNoteClick(note);
              e.stopPropagation();
            }}
          />
        </Card.Title>
        <Card.Text className={styles.noteText}>{text}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{dateText}</Card.Footer>
    </Card>
  );
};

export default Note;

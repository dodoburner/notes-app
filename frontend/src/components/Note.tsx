import { Card } from "react-bootstrap";
import NoteModel from "../models/note";
import styles from "../styles/Note.module.css";
import dateFormatter from "../utils/dateFormatter";

interface NoteProps {
  note: NoteModel,
  className?: string,
}

const Note = ({ note, className }: NoteProps) => {
  const { title, text, createdAt, updatedAt } = note;
  let dateText: string;

  if (updatedAt > createdAt) {
    dateText = "Updated at: " + dateFormatter(updatedAt);
  } else {
    dateText = "Created at: " + dateFormatter(createdAt);
  }

  return (
    <Card className={`${className} ${styles.noteCard}`}>
      <Card.Body className={styles.noteBody}>
        <Card.Title>{title}</Card.Title>
        <Card.Text className={styles.noteText}>{text}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">
        {dateText}
      </Card.Footer>
    </Card>
  );
};

export default Note;

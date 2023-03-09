import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import NoteModel from "./models/note";

interface NoteDialogProps {
  note?: NoteModel;
  onDismiss: () => void;
  onNoteSaved: (note: Note) => void;
  onNoteEdited: (note: Note) => void;
}

interface Note {
  title: Text;
  text?: Text;
}

const NoteDialog = ({ note, onDismiss, onNoteSaved, onNoteEdited }: NoteDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Note>({
    defaultValues: { title: note?.title || "", text: note?.text || "" },
  });

  const onSubmit = async (input: Note) => {
    try {
      let response;
      if (note) {
        response = await axios.patch("/api/notes/" + note._id, input);
        onNoteEdited(response.data);
      } else {
        response = await axios.post("/api/notes", input);
        onNoteSaved(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>{note ? "Edit Note" : "Add Note"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="NoteForm" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="title"
              isInvalid={!!errors.title}
              {...register("title", { required: "Required" })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="text"
              {...register("text")}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button type="submit" form="NoteForm" disabled={isSubmitting}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NoteDialog;

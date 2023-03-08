import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Note from "../models/note";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await Note.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const { noteId } = req.params;

  try {
    if (!isValidObjectId(noteId)) {
      throw createHttpError(400, "Note id is not valid!");
    }

    const note = await Note.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found!");
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote: RequestHandler<
  unknown,
  unknown,
  NoteBody,
  unknown
> = async (req, res, next) => {
  const { title, text } = req.body;

  try {
    if (!title) {
      throw createHttpError(400, "Note must have a title!");
    }

    const newNote = await Note.create({ title, text });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote: RequestHandler<
  UrlParams,
  unknown,
  NoteBody,
  unknown
> = async (req, res, next) => {
  const { noteId } = req.params;
  const { title, text } = req.body;

  try {
    if (!title) {
      throw createHttpError(400, "Note must have a title!");
    }

    if (!isValidObjectId(noteId)) {
      throw createHttpError(400, "Note id is not valid!");
    }

    const note = await Note.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found!");
    }

    note.title = title;
    note.text = text;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const { noteId } = req.params;

  try {
    if (!isValidObjectId(noteId)) {
      throw createHttpError(400, "Note id is not valid!");
    }

    const note = await Note.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found!");
    }

    await note.remove();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

interface UrlParams {
  noteId: string;
}

interface NoteBody {
  title?: string;
  text?: string;
}

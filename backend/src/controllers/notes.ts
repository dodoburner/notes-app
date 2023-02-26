import { RequestHandler } from "express";
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
    const note = await Note.findById(noteId).exec();
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
}

export const createNote: RequestHandler = async (req, res, next) => {
  const { title, text } = req.body;

  try {
    const newNote = await Note.create({ title, text });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

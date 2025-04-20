import { Note } from "./note.model";

export interface Category {
  id?: number | null;
  name: string;
  notes?: Note[];
}

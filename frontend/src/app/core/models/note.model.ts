import { Category } from './category.model';

export interface Note {
  id?: number | null;
  title: string;
  content: string;
  archived?: boolean;
  categories: Category[];
}

import { Request as ExpressRequest, Response } from 'express';
import { Book } from '../models';

interface CustomRequest extends ExpressRequest {
  user?: { userId: number; role: string };
}

export const getFeaturedBooks = async (req: ExpressRequest, res: Response) => {
  try {
    const books = [
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', coverImage: 'https://via.placeholder.com/150x200.png?text=Book+Cover', ownerId: 1 },
      { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', coverImage: 'https://via.placeholder.com/150x200.png?text=Book+Cover', ownerId: 1 },
      { id: 3, title: '1984', author: 'George Orwell', coverImage: 'https://via.placeholder.com/150x200.png?text=Book+Cover', ownerId: 1 },
    ];
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export const getAllBooks = async (req: ExpressRequest, res: Response) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export const addBook = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.userId;
  const { title, author, coverImage } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const book = await Book.create({
      title,
      author,
      coverImage,
      ownerId: userId,
    });
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book' });
  }
};

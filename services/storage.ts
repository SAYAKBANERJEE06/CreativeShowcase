
import { User, Artwork } from '../types';

const USERS_KEY = 'cs_users';
const ARTWORKS_KEY = 'cs_artworks';

// Initial dummy data
const DEFAULT_USERS: User[] = [
  { id: '1', username: 'vincent', email: 'vincent@example.com', displayName: 'Vincent van Gogh', bio: 'Post-impressionist painter.' },
  { id: '2', username: 'frida', email: 'frida@example.com', displayName: 'Frida Kahlo', bio: 'Artist known for self-portraits.' }
];

const DEFAULT_ARTWORKS: Artwork[] = [
  { 
    id: 'a1', 
    userId: '1', 
    username: 'vincent', 
    title: 'Starry Night', 
    description: 'A view from my window.', 
    imageUrl: 'https://picsum.photos/id/10/800/1200', 
    createdAt: Date.now() - 1000000 
  },
  { 
    id: 'a2', 
    userId: '1', 
    username: 'vincent', 
    title: 'Sunflowers', 
    description: 'Vibrant yellow blooms.', 
    imageUrl: 'https://picsum.photos/id/11/1200/800', 
    createdAt: Date.now() - 900000 
  },
  { 
    id: 'a3', 
    userId: '2', 
    username: 'frida', 
    title: 'The Two Fridas', 
    description: 'A double self-portrait.', 
    imageUrl: 'https://picsum.photos/id/12/900/1100', 
    createdAt: Date.now() - 800000 
  },
  { 
    id: 'a4', 
    userId: '2', 
    username: 'frida', 
    title: 'Self Portrait', 
    description: 'With thorn necklace.', 
    imageUrl: 'https://picsum.photos/id/13/1000/1000', 
    createdAt: Date.now() - 700000 
  },
  { 
    id: 'a5', 
    userId: '1', 
    username: 'vincent', 
    title: 'Cafe Terrace', 
    description: 'Night at a cafe.', 
    imageUrl: 'https://picsum.photos/id/14/800/1000', 
    createdAt: Date.now() - 600000 
  }
];

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  },

  saveUser: (user: User) => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  findUserByUsername: (username: string): User | undefined => {
    return storage.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
  },

  getArtworks: (): Artwork[] => {
    const data = localStorage.getItem(ARTWORKS_KEY);
    return data ? JSON.parse(data) : DEFAULT_ARTWORKS;
  },

  getArtworksByUser: (userId: string): Artwork[] => {
    return storage.getArtworks().filter(a => a.userId === userId);
  },

  getArtworksByUsername: (username: string): Artwork[] => {
    return storage.getArtworks().filter(a => a.username.toLowerCase() === username.toLowerCase());
  },

  saveArtwork: (artwork: Artwork) => {
    const artworks = storage.getArtworks();
    artworks.unshift(artwork);
    localStorage.setItem(ARTWORKS_KEY, JSON.stringify(artworks));
  },

  updateArtwork: (updatedArtwork: Artwork) => {
    const artworks = storage.getArtworks().map(a => a.id === updatedArtwork.id ? updatedArtwork : a);
    localStorage.setItem(ARTWORKS_KEY, JSON.stringify(artworks));
  }
};

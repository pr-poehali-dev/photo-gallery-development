
// Data imports/exports with local storage
import { createContext, useContext } from 'react';

export interface Album {
  id: string;
  title: string;
  coverUrl: string;
  count: number;
}

export interface Photo {
  id: string;
  title: string;
  url: string;
  albumId: string;
}

// Сохранение альбомов в localStorage
const saveAlbums = (albums: Album[]) => {
  localStorage.setItem('photoGalleryAlbums', JSON.stringify(albums));
};

// Загрузка альбомов из localStorage или использование пустого массива
export const getAlbums = (): Album[] => {
  const stored = localStorage.getItem('photoGalleryAlbums');
  return stored ? JSON.parse(stored) : [];
};

// Сохранение фотографий в localStorage
const savePhotos = (photos: Photo[]) => {
  localStorage.setItem('photoGalleryPhotos', JSON.stringify(photos));
};

// Загрузка фотографий из localStorage или использование пустого массива
export const getAllPhotos = (): Photo[] => {
  const stored = localStorage.getItem('photoGalleryPhotos');
  return stored ? JSON.parse(stored) : [];
};

// Получение фотографий конкретного альбома
export const getAlbumPhotos = (albumId: string): Photo[] => {
  const allPhotos = getAllPhotos();
  return allPhotos.filter(photo => photo.albumId === albumId);
};

// Удаление альбома и всех его фотографий
export const deleteAlbum = (albumId: string) => {
  // Удаляем альбом
  const albums = getAlbums().filter(album => album.id !== albumId);
  saveAlbums(albums);
  
  // Удаляем все фотографии альбома
  const photos = getAllPhotos().filter(photo => photo.albumId !== albumId);
  savePhotos(photos);
};

// Создание нового альбома с дефолтным названием
export const createNewAlbum = (): Album => {
  const albums = getAlbums();
  const newId = `album-${Date.now()}`;
  
  const newAlbum: Album = {
    id: newId,
    title: 'Новый альбом',
    coverUrl: 'https://source.unsplash.com/random/400x300/?abstract',
    count: 0
  };
  
  saveAlbums([...albums, newAlbum]);
  return newAlbum;
};

// Обновление данных альбома
export const updateAlbum = (album: Album) => {
  const albums = getAlbums();
  const updatedAlbums = albums.map(a => a.id === album.id ? album : a);
  saveAlbums(updatedAlbums);
};

// Контекст для управления состоянием галереи
export const GalleryContext = createContext<{
  albums: Album[];
  refreshAlbums: () => void;
  deleteAlbum: (id: string) => void;
  createNewAlbum: () => Album;
}>({
  albums: [],
  refreshAlbums: () => {},
  deleteAlbum,
  createNewAlbum
});

export const useGallery = () => useContext(GalleryContext);

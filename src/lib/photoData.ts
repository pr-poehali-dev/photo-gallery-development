
// Data imports/exports with local storage
import { createContext, useContext } from 'react';

export interface Album {
  id: string;
  title: string;
  coverUrl: string;
  count: number;
  spacing?: number; // Расстояние между фото
}

export interface Photo {
  id: string;
  title: string;
  url: string;
  albumId: string;
  orientation?: 'portrait' | 'landscape';
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

// Добавление фото в альбом
export const addPhotoToAlbum = (albumId: string, photo: Photo) => {
  const allPhotos = getAllPhotos();
  
  // Добавляем фото в общий список
  const updatedPhotos = [...allPhotos, photo];
  savePhotos(updatedPhotos);
  
  // Обновляем счетчик фото в альбоме
  const albums = getAlbums();
  const updatedAlbums = albums.map(album => {
    if (album.id === albumId) {
      // Если у альбома еще нет обложки, устанавливаем ее
      if (!album.coverUrl || album.coverUrl.includes('unsplash.com')) {
        return {
          ...album,
          coverUrl: photo.url,
          count: album.count + 1
        };
      }
      return {
        ...album,
        count: album.count + 1
      };
    }
    return album;
  });
  
  saveAlbums(updatedAlbums);
};

// Удаление фото из альбома
export const removePhoto = (photoId: string, albumId: string) => {
  const allPhotos = getAllPhotos();
  const updatedPhotos = allPhotos.filter(photo => photo.id !== photoId);
  savePhotos(updatedPhotos);
  
  // Обновляем счетчик фото в альбоме и, возможно, обложку
  const albums = getAlbums();
  const remainingPhotos = updatedPhotos.filter(photo => photo.albumId === albumId);
  
  const updatedAlbums = albums.map(album => {
    if (album.id === albumId) {
      // Если это был последний фото, ставим дефолтную обложку
      if (remainingPhotos.length === 0) {
        return {
          ...album,
          coverUrl: 'https://source.unsplash.com/random/400x300/?abstract',
          count: 0
        };
      }
      // Если удалили фото с обложки, берем первое оставшееся фото
      else if (!remainingPhotos.some(photo => photo.url === album.coverUrl)) {
        return {
          ...album,
          coverUrl: remainingPhotos[0].url,
          count: remainingPhotos.length
        };
      }
      // Просто обновляем счетчик
      else {
        return {
          ...album,
          count: remainingPhotos.length
        };
      }
    }
    return album;
  });
  
  saveAlbums(updatedAlbums);
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
    count: 0,
    spacing: 3 // Стандартное значение отступа
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

// Обновление отступов между фото в альбоме
export const updateAlbumSpacing = (albumId: string, spacing: number) => {
  const albums = getAlbums();
  const updatedAlbums = albums.map(album => {
    if (album.id === albumId) {
      return {
        ...album,
        spacing
      };
    }
    return album;
  });
  
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

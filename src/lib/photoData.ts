
// Данные альбомов для галереи
export const albums = [
  {
    id: 'nature',
    title: 'Природа',
    coverUrl: 'https://source.unsplash.com/random/800x600/?nature',
    count: 23,
  },
  {
    id: 'city',
    title: 'Город',
    coverUrl: 'https://source.unsplash.com/random/800x600/?city',
    count: 17,
  },
  {
    id: 'people',
    title: 'Люди',
    coverUrl: 'https://source.unsplash.com/random/800x600/?people',
    count: 15,
  },
  {
    id: 'animals',
    title: 'Животные',
    coverUrl: 'https://source.unsplash.com/random/800x600/?animals',
    count: 19,
  },
  {
    id: 'travel',
    title: 'Путешествия',
    coverUrl: 'https://source.unsplash.com/random/800x600/?travel',
    count: 28,
  },
  {
    id: 'food',
    title: 'Еда',
    coverUrl: 'https://source.unsplash.com/random/800x600/?food',
    count: 12,
  },
];

// Генерация фотографий для каждого альбома
export const getAlbumPhotos = (albumId: string) => {
  const count = albums.find(a => a.id === albumId)?.count || 10;
  const photos = [];

  for (let i = 1; i <= count; i++) {
    photos.push({
      id: `${albumId}-${i}`,
      title: `Фото ${i}`,
      url: `https://source.unsplash.com/random/800x800/?${albumId}&sig=${i}`,
      albumId,
    });
  }

  return photos;
};

// Получение всех фотографий
export const getAllPhotos = () => {
  return albums.flatMap(album => getAlbumPhotos(album.id));
};

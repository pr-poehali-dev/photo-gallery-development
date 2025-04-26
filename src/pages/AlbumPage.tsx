
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Download, Share2, Heart, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getAlbums, getAlbumPhotos, Album, Photo, deleteAlbum } from '@/lib/photoData';
import PhotoGallery from '@/components/PhotoGallery';

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  
  // Загрузка альбома и фотографий
  useEffect(() => {
    if (albumId) {
      const allAlbums = getAlbums();
      const foundAlbum = allAlbums.find(a => a.id === albumId) || null;
      setAlbum(foundAlbum);
      
      if (foundAlbum) {
        setPhotos(getAlbumPhotos(albumId));
      }
    }
  }, [albumId]);
  
  // Удаление альбома и возврат на главную
  const handleDeleteAlbum = () => {
    if (albumId) {
      deleteAlbum(albumId);
      navigate('/');
    }
  };
  
  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Альбом не найден</h2>
          <Link to="/">
            <Button>Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm py-4">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center">
            <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Назад к альбомам</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleDeleteAlbum}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">{album.title}</h1>
          <p className="text-slate-500 dark:text-slate-400">{photos.length} фотографий</p>
        </div>
      </header>
      
      <main className="container px-4 py-8 mx-auto">
        <PhotoGallery photos={photos} />
        
        {/* Можно добавить кнопку добавления фото, если требуется */}
        {photos.length === 0 && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Добавить фото
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AlbumPage;

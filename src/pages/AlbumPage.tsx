
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAlbums, getAlbumPhotos, Album, Photo, deleteAlbum, updateAlbumSpacing } from '@/lib/photoData';
import PhotoGallery from '@/components/PhotoGallery';
import UploadPhotoButton from '@/components/UploadPhotoButton';

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [spacing, setSpacing] = useState<number>(3); // Стандартное значение
  
  // Загрузка альбома и фотографий
  const loadAlbumData = () => {
    if (albumId) {
      const allAlbums = getAlbums();
      const foundAlbum = allAlbums.find(a => a.id === albumId) || null;
      setAlbum(foundAlbum);
      
      if (foundAlbum) {
        setPhotos(getAlbumPhotos(albumId));
        setSpacing(foundAlbum.spacing || 3);
      }
    }
  };
  
  useEffect(() => {
    loadAlbumData();
  }, [albumId]);
  
  // Обработчик при добавлении новых фото
  const handlePhotoAdded = () => {
    loadAlbumData();
  };
  
  // Удаление альбома и возврат на главную
  const handleDeleteAlbum = () => {
    if (albumId) {
      deleteAlbum(albumId);
      navigate('/');
    }
  };
  
  // Обновление отступов между фото
  const handleSpacingChange = (value: number[]) => {
    const newSpacing = value[0];
    setSpacing(newSpacing);
    if (albumId) {
      updateAlbumSpacing(albumId, newSpacing);
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
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h3 className="font-medium">Настройки альбома</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Отступы между фото</span>
                        <span className="text-sm font-medium">{spacing}px</span>
                      </div>
                      <Slider 
                        value={[spacing]} 
                        min={0} 
                        max={10} 
                        step={1} 
                        onValueChange={handleSpacingChange} 
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={handleDeleteAlbum}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">{album.title}</h1>
          <p className="text-slate-500 dark:text-slate-400">{photos.length} фотографий</p>
        </div>
      </header>
      
      <main className="container px-4 py-8 mx-auto">
        <PhotoGallery photos={photos} spacing={spacing} />
        
        <div className="flex justify-center mt-6">
          <UploadPhotoButton albumId={albumId} onPhotoAdded={handlePhotoAdded} />
        </div>
      </main>
    </div>
  );
};

export default AlbumPage;

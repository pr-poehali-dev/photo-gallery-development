
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Edit2, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { getAlbums, getAlbumPhotos, Album, Photo, deleteAlbum, updateAlbumSpacing, updateAlbum } from '@/lib/photoData';
import PhotoGallery from '@/components/PhotoGallery';
import UploadPhotoButton from '@/components/UploadPhotoButton';

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [spacing, setSpacing] = useState<number>(3); // Стандартное значение
  const [photoSize, setPhotoSize] = useState<number>(5); // Стандартное значение
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Загрузка альбома и фотографий
  const loadAlbumData = () => {
    if (albumId) {
      const allAlbums = getAlbums();
      const foundAlbum = allAlbums.find(a => a.id === albumId) || null;
      setAlbum(foundAlbum);
      
      if (foundAlbum) {
        setAlbumTitle(foundAlbum.title);
        setPhotos(getAlbumPhotos(albumId));
        setSpacing(foundAlbum.spacing || 3);
        setPhotoSize(foundAlbum.photoSize || 5);
      }
    }
  };
  
  useEffect(() => {
    loadAlbumData();
  }, [albumId]);
  
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);
  
  // Обработчик при добавлении/удалении фото
  const handlePhotoChange = () => {
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
    if (albumId && album) {
      const updatedAlbum = { ...album, spacing: newSpacing };
      updateAlbum(updatedAlbum);
    }
  };
  
  // Обновление размера фото
  const handlePhotoSizeChange = (value: number[]) => {
    const newSize = value[0];
    setPhotoSize(newSize);
    if (albumId && album) {
      const updatedAlbum = { ...album, photoSize: newSize };
      updateAlbum(updatedAlbum);
    }
  };
  
  // Редактирование названия альбома
  const startEditingTitle = () => {
    setIsEditingTitle(true);
  };
  
  const saveAlbumTitle = () => {
    if (albumId && album && albumTitle.trim() !== '') {
      const updatedAlbum = { ...album, title: albumTitle };
      updateAlbum(updatedAlbum);
      setAlbum(updatedAlbum);
      setIsEditingTitle(false);
    } else {
      // Если название пустое, возвращаем предыдущее
      setAlbumTitle(album?.title || '');
      setIsEditingTitle(false);
    }
  };
  
  // Обработка Enter и Escape
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveAlbumTitle();
    } else if (e.key === 'Escape') {
      setAlbumTitle(album?.title || '');
      setIsEditingTitle(false);
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
      <header className="bg-white dark:bg-slate-800 shadow-sm py-4 sticky top-0 z-10">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center">
            <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Назад к альбомам</span>
            </Link>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Настройки</span>
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
                      <div className="flex justify-between mt-4">
                        <span className="text-sm">Размер фотографий</span>
                        <span className="text-sm font-medium">{photoSize}</span>
                      </div>
                      <Slider 
                        value={[photoSize]} 
                        min={2} 
                        max={8} 
                        step={1} 
                        onValueChange={handlePhotoSizeChange} 
                      />
                    </div>
                    <div className="pt-2 flex justify-between">
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteAlbum}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Удалить альбом</span>
                      </Button>
                      
                      <UploadPhotoButton albumId={albumId || ''} onPhotoAdded={handlePhotoChange} />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex items-center mt-2">
            {isEditingTitle ? (
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  ref={titleInputRef}
                  type="text"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  onBlur={saveAlbumTitle}
                  onKeyDown={handleTitleKeyDown}
                  className="text-xl font-bold"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{album.title}</h1>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={startEditingTitle}
                >
                  <Edit2 className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400">{photos.length} фотографий</p>
        </div>
      </header>
      
      <main className="container px-4 py-8 mx-auto">
        <PhotoGallery 
          photos={photos} 
          albumId={albumId || ''} 
          spacing={spacing} 
          photoSize={photoSize}
          onPhotoRemoved={handlePhotoChange} 
        />
        
        <div className="flex justify-center mt-6">
          <UploadPhotoButton albumId={albumId || ''} onPhotoAdded={handlePhotoChange} />
        </div>
      </main>
    </div>
  );
};

export default AlbumPage;

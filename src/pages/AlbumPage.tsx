
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Edit2, Grid, Columns, LayoutGrid } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { getAlbums, getAlbumPhotos, Album, Photo, deleteAlbum, updateAlbum } from '@/lib/photoData';
import PhotoGallery from '@/components/PhotoGallery';
import UploadPhotoButton from '@/components/UploadPhotoButton';

// Типы отображения галереи
type ViewMode = 'masonry' | 'grid' | 'columns';

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [spacing, setSpacing] = useState<number>(3); // Стандартное значение
  const [photoSize, setPhotoSize] = useState<number>(5); // Стандартное значение
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('masonry'); // По умолчанию масонри
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
        // Загружаем режим отображения, если он есть
        if (foundAlbum.viewMode) {
          setViewMode(foundAlbum.viewMode as ViewMode);
        }
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
    if (albumId && window.confirm('Вы уверены, что хотите удалить этот альбом?')) {
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
  
  // Изменение режима отображения галереи
  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (albumId && album) {
      const updatedAlbum = { ...album, viewMode: mode };
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
          {/* Верхняя панель с навигацией и действиями */}
          <div className="flex justify-between items-center">
            <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Назад к альбомам</span>
            </Link>
            <div className="flex items-center gap-3">
              <UploadPhotoButton albumId={albumId || ''} onPhotoAdded={handlePhotoChange} />
              <Button 
                variant="destructive"
                size="sm"
                onClick={handleDeleteAlbum}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Удалить альбом</span>
              </Button>
            </div>
          </div>
          
          {/* Название альбома */}
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
            <p className="text-slate-500 dark:text-slate-400 ml-4">{photos.length} фотографий</p>
          </div>
          
          {/* Настройки отображения */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600 dark:text-slate-400">Отступы между фото</span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{spacing}px</span>
              </div>
              <Slider 
                value={[spacing]} 
                min={0} 
                max={10} 
                step={1} 
                onValueChange={handleSpacingChange} 
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600 dark:text-slate-400">Размер фотографий</span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{photoSize}</span>
              </div>
              <Slider 
                value={[photoSize]} 
                min={2} 
                max={8} 
                step={1} 
                onValueChange={handlePhotoSizeChange} 
              />
            </div>
          </div>
          
          {/* Переключатели режимов отображения */}
          <div className="mt-3 flex justify-center gap-2">
            <Button 
              variant={viewMode === 'masonry' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => changeViewMode('masonry')}
              className="flex items-center gap-1"
            >
              <Columns className="h-4 w-4" />
              <span>Мазонри</span>
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => changeViewMode('grid')}
              className="flex items-center gap-1"
            >
              <Grid className="h-4 w-4" />
              <span>Сетка</span>
            </Button>
            <Button 
              variant={viewMode === 'columns' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => changeViewMode('columns')}
              className="flex items-center gap-1"
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Колонки</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container px-4 py-8 mx-auto">
        <PhotoGallery 
          photos={photos} 
          albumId={albumId || ''} 
          spacing={spacing} 
          photoSize={photoSize}
          viewMode={viewMode}
          onPhotoRemoved={handlePhotoChange} 
        />
        
        {photos.length === 0 && (
          <div className="flex justify-center mt-6">
            <UploadPhotoButton albumId={albumId || ''} onPhotoAdded={handlePhotoChange} />
          </div>
        )}
      </main>
    </div>
  );
};

export default AlbumPage;

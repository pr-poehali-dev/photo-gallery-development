
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, X, Download, Share2, Heart } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { albums, getAlbumPhotos } from '@/lib/photoData';

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  // Находим текущий альбом
  const album = albums.find(a => a.id === albumId);
  const photos = getAlbumPhotos(albumId || '');
  
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

  const handleLike = (photoId: string) => {
    setLiked(prev => ({
      ...prev,
      [photoId]: !prev[photoId]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm py-4">
        <div className="container px-4 mx-auto">
          <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Назад к альбомам</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">{album.title}</h1>
          <p className="text-slate-500 dark:text-slate-400">{photos.length} фотографий</p>
        </div>
      </header>
      
      <main className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover-scale"
              onClick={() => setSelectedPhoto(photo.id)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <p className="text-white text-sm truncate">{photo.title}</p>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${liked[photo.id] ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Модальное окно для просмотра фото */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl p-0 bg-slate-900 border-none">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-full bg-black/30 text-white z-10 hover:bg-black/50"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="h-5 w-5" />
          </Button>
          
          {selectedPhoto && (
            <div className="p-4">
              <div className="flex justify-center items-center min-h-[50vh]">
                <img 
                  src={photos.find(p => p.id === selectedPhoto)?.url} 
                  alt={photos.find(p => p.id === selectedPhoto)?.title} 
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </div>
              
              <div className="mt-4 px-4 flex justify-between items-center">
                <h3 className="text-white text-lg font-medium">
                  {photos.find(p => p.id === selectedPhoto)?.title}
                </h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full"
                    onClick={() => selectedPhoto && handleLike(selectedPhoto)}
                  >
                    <Heart className={`h-5 w-5 ${selectedPhoto && liked[selectedPhoto] ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlbumPage;

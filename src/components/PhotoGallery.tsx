
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Download, Share2, Heart } from 'lucide-react';
import { Photo } from '@/lib/photoData';

interface PhotoGalleryProps {
  photos: Photo[];
  className?: string;
}

const PhotoGallery = ({ photos, className = '' }: PhotoGalleryProps) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleClose = () => {
    setSelectedPhotoIndex(null);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const handleLike = (photoId: string) => {
    setLiked(prev => ({
      ...prev,
      [photoId]: !prev[photoId]
    }));
  };

  const selectedPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  if (photos.length === 0) {
    return (
      <div className="flex justify-center items-center h-60 bg-slate-50 rounded-lg border border-dashed border-slate-300">
        <p className="text-slate-500">В этом альбоме нет фотографий</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {photos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover-scale"
            onClick={() => handlePhotoClick(index)}
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
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

      {/* Модальное окно для просмотра фото */}
      <Dialog open={selectedPhotoIndex !== null} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl p-0 bg-slate-900 border-none">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-full bg-black/30 text-white z-10 hover:bg-black/50"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>
          
          {selectedPhoto && (
            <div className="relative p-4">
              <div className="flex justify-center items-center min-h-[60vh]">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.title} 
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </div>
              
              {/* Кнопки навигации */}
              {selectedPhotoIndex !== null && selectedPhotoIndex > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              
              {selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
              
              <div className="mt-4 px-4 flex justify-between items-center">
                <h3 className="text-white text-lg font-medium">
                  {selectedPhoto.title}
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
                    onClick={() => handleLike(selectedPhoto.id)}
                  >
                    <Heart className={`h-5 w-5 ${liked[selectedPhoto.id] ? 'fill-red-500 text-red-500' : ''}`} />
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

export default PhotoGallery;

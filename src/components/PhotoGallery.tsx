
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Download, Share2, Trash2 } from 'lucide-react';
import { Photo, removePhoto } from '@/lib/photoData';

interface PhotoGalleryProps {
  photos: Photo[];
  albumId: string;
  className?: string;
  spacing?: number;
  photoSize?: number;
  onPhotoRemoved?: () => void;
}

const PhotoGallery = ({ photos, albumId, className = '', spacing = 3, photoSize = 5, onPhotoRemoved }: PhotoGalleryProps) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  
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

  const handleDeletePhoto = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    removePhoto(photoId, albumId);
    if (onPhotoRemoved) {
      onPhotoRemoved();
    }
  };

  const selectedPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  if (photos.length === 0) {
    return (
      <div className="flex justify-center items-center h-60 bg-slate-50 rounded-lg border border-dashed border-slate-300">
        <p className="text-slate-500">В этом альбоме нет фотографий</p>
      </div>
    );
  }

  // Формируем стиль для отступов из значения spacing
  const gapClass = `gap-${spacing}`;

  return (
    <div className={`${className}`}>
      <div className={`columns-2 sm:columns-3 md:columns-4 lg:columns-${photoSize} ${gapClass} space-y-${spacing}`}>
        {photos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="group relative mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => handlePhotoClick(index)}
          >
            <div className="overflow-hidden">
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-white text-sm truncate">{photo.title}</p>
            </div>
            
            {/* Кнопка удаления при наведении */}
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleDeletePhoto(e, photo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
                  className="max-h-[80vh] max-w-full object-contain"
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
                    className="rounded-full text-red-400 hover:text-red-500 hover:bg-red-100/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedPhotoIndex !== null) {
                        handleDeletePhoto(e, selectedPhoto.id);
                        handleClose();
                      }
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
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

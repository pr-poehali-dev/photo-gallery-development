
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { addPhotoToAlbum } from '@/lib/photoData';

interface UploadPhotoButtonProps {
  albumId: string;
  onPhotoAdded?: () => void;
}

const UploadPhotoButton = ({ albumId, onPhotoAdded }: UploadPhotoButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Определение ориентации изображения
  const determineOrientation = (width: number, height: number): 'portrait' | 'landscape' => {
    return height > width ? 'portrait' : 'landscape';
  };

  // Обработка загрузки файла
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Проверяем, что файл - изображение
        if (!file.type.startsWith('image/')) continue;
        
        // Создаем URL для изображения
        const imageUrl = URL.createObjectURL(file);
        
        // Определяем ориентацию изображения
        const img = new Image();
        
        // Используем промис, чтобы дождаться загрузки изображения
        await new Promise<void>((resolve) => {
          img.onload = () => {
            // Добавляем фото в альбом
            const orientation = determineOrientation(img.width, img.height);
            
            addPhotoToAlbum(albumId, {
              id: `photo-${Date.now()}-${i}`,
              title: file.name.split('.')[0],
              url: imageUrl,
              albumId,
              orientation
            });
            
            resolve();
          };
          img.src = imageUrl;
        });
      }
      
      if (onPhotoAdded) {
        onPhotoAdded();
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
    } finally {
      setIsLoading(false);
      // Сбрасываем значение input, чтобы можно было загрузить те же файлы повторно
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Обработчик клика по кнопке
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />
      <Button
        onClick={handleButtonClick}
        disabled={isLoading}
        className="flex items-center gap-2"
        size="sm"
      >
        {isLoading ? (
          <>
            <Upload className="h-4 w-4 animate-pulse" />
            <span>Загрузка...</span>
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span>Добавить фото</span>
          </>
        )}
      </Button>
    </>
  );
};

export default UploadPhotoButton;


import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { addPhotoToAlbum } from '@/lib/photoData';

interface UploadPhotoButtonProps {
  albumId: string;
  onPhotoAdded: () => void;
}

const UploadPhotoButton = ({ albumId, onPhotoAdded }: UploadPhotoButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Обработка каждого выбранного файла
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Проверка, что это изображение
        if (!file.type.startsWith('image/')) continue;
        
        // Создание URL для предпросмотра
        const imageUrl = URL.createObjectURL(file);
        
        // Создание заголовка из имени файла (без расширения)
        const title = file.name.split('.').slice(0, -1).join('.') || 'Фото';
        
        // Добавление фото в альбом
        addPhotoToAlbum(albumId, {
          id: `photo-${Date.now()}-${i}`,
          title,
          url: imageUrl,
          albumId
        });
      }
      
      // Сброс input для возможности выбора тех же файлов повторно
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Уведомление о завершении загрузки
      onPhotoAdded();
    } catch (error) {
      console.error('Ошибка при загрузке фото:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={handleClick}
        disabled={isUploading}
      >
        <Plus className="h-4 w-4" /> 
        {isUploading ? 'Загрузка...' : 'Добавить фото'}
      </Button>
    </>
  );
};

export default UploadPhotoButton;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2, Settings } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAlbums, deleteAlbum, createNewAlbum, Album } from '@/lib/photoData';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [iconSize, setIconSize] = useState<number>(32); // Стандартный размер иконок
  
  // Загрузка альбомов из localStorage
  const loadAlbums = () => {
    setAlbums(getAlbums());
  };
  
  useEffect(() => {
    loadAlbums();
  }, []);
  
  // Фильтрация альбомов по поисковому запросу
  const filteredAlbums = albums.filter(album => 
    album.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Удаление альбома
  const handleDeleteAlbum = (e: React.MouseEvent, albumId: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteAlbum(albumId);
    loadAlbums();
  };
  
  // Создание нового альбома
  const handleCreateAlbum = () => {
    createNewAlbum();
    loadAlbums();
  };

  // Изменение размера иконок
  const handleIconSizeChange = (value: number[]) => {
    setIconSize(value[0]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm py-4 sticky top-0 z-10">
        <div className="container px-4 mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Фотогалерея</h1>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Поиск альбомов..."
                className="w-full px-4 py-2 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-slate-400" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Настройки</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Размер иконок альбомов</span>
                      <span className="text-sm font-medium">{iconSize}px</span>
                    </div>
                    <Slider 
                      value={[iconSize]} 
                      min={24} 
                      max={48} 
                      step={4} 
                      onValueChange={handleIconSizeChange} 
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              onClick={handleCreateAlbum}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Новый альбом
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container px-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-slate-700 dark:text-slate-200">Альбомы</h2>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {filteredAlbums.length > 0 ? (
            filteredAlbums.map((album) => (
              <Link key={album.id} to={`/album/${album.id}`} className="group hover-scale">
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-300 relative">
                  <div className={`relative h-${Math.round(iconSize/4)} overflow-hidden`}>
                    <img 
                      src={album.coverUrl} 
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ height: `${iconSize * 3}px` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                    
                    {/* Кнопка удаления */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 bg-black/30 text-white hover:bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteAlbum(e, album.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="p-2 text-center">
                    <h3 className="text-slate-700 dark:text-slate-200 font-medium text-sm truncate">{album.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{album.count} фото</p>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 text-lg">Альбомы не найдены</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm('')}
              >
                Сбросить поиск
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t border-slate-200 dark:border-slate-700 py-6">
        <div className="container px-4 mx-auto text-center text-slate-500 dark:text-slate-400">
          <p>© 2025 Фотогалерея. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

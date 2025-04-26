
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

// Данные альбомов (здесь можно подключить API)
const albums = [
  {
    id: 'nature',
    title: 'Природа',
    coverUrl: 'https://source.unsplash.com/random/800x600/?nature',
    count: 23,
  },
  {
    id: 'city',
    title: 'Город',
    coverUrl: 'https://source.unsplash.com/random/800x600/?city',
    count: 17,
  },
  {
    id: 'people',
    title: 'Люди',
    coverUrl: 'https://source.unsplash.com/random/800x600/?people',
    count: 15,
  },
  {
    id: 'animals',
    title: 'Животные',
    coverUrl: 'https://source.unsplash.com/random/800x600/?animals',
    count: 19,
  },
  {
    id: 'travel',
    title: 'Путешествия',
    coverUrl: 'https://source.unsplash.com/random/800x600/?travel',
    count: 28,
  },
  {
    id: 'food',
    title: 'Еда',
    coverUrl: 'https://source.unsplash.com/random/800x600/?food',
    count: 12,
  },
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Фильтрация альбомов по поисковому запросу
  const filteredAlbums = albums.filter(album => 
    album.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm py-4">
        <div className="container px-4 mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Фотогалерея</h1>
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
        </div>
      </header>
      
      <main className="container px-4 py-8 mx-auto">
        <h2 className="text-xl font-medium text-slate-700 dark:text-slate-200 mb-6">Альбомы</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredAlbums.length > 0 ? (
            filteredAlbums.map((album) => (
              <Link key={album.id} to={`/album/${album.id}`} className="group hover-scale">
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-52 overflow-hidden">
                    <img 
                      src={album.coverUrl} 
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-medium text-lg">{album.title}</h3>
                      <p className="text-white/80 text-sm">{album.count} фото</p>
                    </div>
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

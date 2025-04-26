
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GalleryContext, getAlbums, deleteAlbum, createNewAlbum } from "@/lib/photoData";
import Index from "./pages/Index";
import AlbumPage from "./pages/AlbumPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [albums, setAlbums] = useState(getAlbums());

  const refreshAlbums = () => {
    setAlbums(getAlbums());
  };
  
  // Начальная загрузка из localStorage
  useEffect(() => {
    refreshAlbums();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GalleryContext.Provider value={{ 
        albums, 
        refreshAlbums, 
        deleteAlbum: (id) => {
          deleteAlbum(id);
          refreshAlbums();
        },
        createNewAlbum: () => {
          const newAlbum = createNewAlbum();
          refreshAlbums();
          return newAlbum;
        }
      }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/album/:albumId" element={<AlbumPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GalleryContext.Provider>
    </QueryClientProvider>
  );
};

export default App;

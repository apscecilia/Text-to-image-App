'use client';

import { useState } from 'react';
import ImageGenerationForm from '@/app/components/ImageGenerationForm';
import GeneratedImage from '@/app/components/GeneratedImage';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';

interface GeneratedImageType {
  url: string;
  prompt: string;
  timestamp: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImageType | null>(null);
  const [generatedImages, setGeneratedImages] = useLocalStorage<GeneratedImageType[]>('generated-images', []);

  const handleGenerate = async (prompt: string, options: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/replicate/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...options }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const newImage = {
        url: data.output[0],
        prompt,
        timestamp: new Date().toISOString(),
      };

      setCurrentImage(newImage);
      setGeneratedImages([newImage, ...generatedImages]);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">AI Image Generator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ImageGenerationForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>
          
          <div>
            {currentImage && (
              <GeneratedImage
                imageUrl={currentImage.url}
                prompt={currentImage.prompt}
                timestamp={new Date(currentImage.timestamp).toLocaleString()}
                onDownload={() => handleDownload(currentImage.url)}
              />
            )}
          </div>
        </div>

        {generatedImages.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Generated Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedImages.map((image, index) => (
                <GeneratedImage
                  key={index}
                  imageUrl={image.url}
                  prompt={image.prompt}
                  timestamp={new Date(image.timestamp).toLocaleString()}
                  onDownload={() => handleDownload(image.url)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

import Image from 'next/image';
import { Download } from 'lucide-react';

interface GeneratedImageProps {
  imageUrl: string;
  prompt: string;
  timestamp: string;
  onDownload: () => void;
}

export default function GeneratedImage({ imageUrl, prompt, timestamp, onDownload }: GeneratedImageProps) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={prompt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 space-y-2">
        <p className="text-sm text-gray-600">{prompt}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{timestamp}</span>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
} 
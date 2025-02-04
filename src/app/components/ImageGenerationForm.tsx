import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ImageGenerationFormProps {
  onSubmit: (prompt: string, options: GenerationOptions) => Promise<void>;
  isLoading: boolean;
}

interface GenerationOptions {
  numInferenceSteps: number;
  guidanceScale: number;
  negativePrompt?: string;
}

export default function ImageGenerationForm({ onSubmit, isLoading }: ImageGenerationFormProps) {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<GenerationOptions>({
    numInferenceSteps: 50,
    guidanceScale: 7.5,
    negativePrompt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(prompt, options);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium mb-2">
          Image Description
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          placeholder="Describe the image you want to generate..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="steps" className="block text-sm font-medium mb-2">
            Inference Steps ({options.numInferenceSteps})
          </label>
          <input
            type="range"
            id="steps"
            min="20"
            max="100"
            value={options.numInferenceSteps}
            onChange={(e) => setOptions({ ...options, numInferenceSteps: Number(e.target.value) })}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="guidance" className="block text-sm font-medium mb-2">
            Guidance Scale ({options.guidanceScale})
          </label>
          <input
            type="range"
            id="guidance"
            min="1"
            max="20"
            step="0.5"
            value={options.guidanceScale}
            onChange={(e) => setOptions({ ...options, guidanceScale: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label htmlFor="negative" className="block text-sm font-medium mb-2">
          Negative Prompt (Optional)
        </label>
        <input
          type="text"
          id="negative"
          value={options.negativePrompt}
          onChange={(e) => setOptions({ ...options, negativePrompt: e.target.value })}
          className="w-full p-3 border rounded-lg"
          placeholder="What to exclude from the image..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Generating...
          </>
        ) : (
          'Generate Image'
        )}
      </button>
    </form>
  );
} 
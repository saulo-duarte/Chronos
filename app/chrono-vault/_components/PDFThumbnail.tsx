import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export function PdfThumbnail({ blobUrl, fileName }: { blobUrl: string, fileName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const renderPdf = async () => {
      const pdf = await getDocument(blobUrl).promise;
      const page = await pdf.getPage(1);

      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d')!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport
      }).promise;

      const url = canvas.toDataURL('image/png');
      setImageUrl(url);
    };

    renderPdf();
  }, [blobUrl]);

  return (
    <div className="h-64 w-64 overflow-hidden bg-card rounded flex items-center justify-center">
      {imageUrl ? (
        <img src={imageUrl} alt={`Preview de ${fileName}`} className="w-full h-full object-contain" />
      ) : (
        <span className="text-sm text-gray-500">Carregando capa...</span>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

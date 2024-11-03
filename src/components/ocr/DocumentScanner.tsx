import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useOCR } from '@/hooks/useOCR';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocumentScannerProps {
  onScanComplete: (data: any) => void;
  className?: string;
}

export function DocumentScanner({ onScanComplete, className }: DocumentScannerProps) {
  const { processDocument, processing, retryCount, maxRetries } = useOCR();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const result = await processDocument(file);
    
    if (result) {
      onScanComplete(result);
    }
  }, [processDocument, onScanComplete]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
    disabled: processing
  });

  return (
    <div className="space-y-4">
      {fileRejections.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {fileRejections[0].errors[0].message}
          </AlertDescription>
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "flex-1 border-2 border-dashed rounded-lg p-12 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          processing && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input {...getInputProps()} />
        {processing ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            <div className="space-y-2">
              <p className="font-medium">Processing document...</p>
              {retryCount > 0 && (
                <>
                  <Progress value={(retryCount / maxRetries) * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Retry attempt {retryCount} of {maxRetries}
                  </p>
                </>
              )}
              <p className="text-sm text-muted-foreground">
                This may take a few moments while we extract the bill details
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">
                {isDragActive ? "Drop the file here" : "Upload your bill"}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to upload your bill
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, PNG, and JPEG files up to 10MB
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              Select File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
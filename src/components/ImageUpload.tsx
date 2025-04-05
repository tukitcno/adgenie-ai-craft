
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, CheckCircle } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  className?: string;
}

export function ImageUpload({ onImageUpload, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast.error("Please select an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setPreview(e.target.result);
        onImageUpload(file);
        toast.success("Image uploaded successfully");
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      
      {!preview ? (
        <Card 
          className={`border-2 border-dashed transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 h-64 text-center">
            <Upload className="h-10 w-10 mb-4 text-muted-foreground" />
            <h3 className="font-semibold text-lg mb-2">Upload Product Image</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your image here, or click to browse
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              className="mt-2"
            >
              Select Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden relative">
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon" 
              className="rounded-full bg-background/80 backdrop-blur-sm"
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
            </Button>
          </div>
          <img 
            src={preview} 
            alt="Product preview" 
            className="object-contain h-64 w-full"
          />
        </Card>
      )}
    </div>
  );
}

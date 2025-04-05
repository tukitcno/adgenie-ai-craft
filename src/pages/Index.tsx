
import { useState } from "react";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { PlatformSelector } from "@/components/PlatformSelector";
import { AdGenerator, AdContent } from "@/components/AdGenerator";
import { AdPreview } from "@/components/AdPreview";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";

const Index = () => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("google");
  const [adContent, setAdContent] = useState<AdContent | null>(null);
  const [step, setStep] = useState(1);

  const handleImageUpload = (file: File) => {
    setProductImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setImagePreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
    setStep(2);
  };

  const handleSelectPlatform = (platform: string) => {
    setSelectedPlatform(platform);
    setStep(3);
  };

  const handleAdGenerated = (content: AdContent) => {
    setAdContent(content);
    setStep(4);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">AdGenie</h1>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-2">AI Ad Creator</h2>
            <p className="text-muted-foreground max-w-2xl">
              Generate optimized ad content for Google, Meta, and TikTok by simply uploading a product image. Our AI will analyze your product and create engaging ad content tailored to your chosen platform.
            </p>
          </div>
          
          <div className="flex gap-4 mb-6 text-sm">
            <div className={`flex items-center gap-2 ${step === 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-primary text-white' : 'bg-muted'}`}>1</div>
              Upload
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground self-center" />
            <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-primary text-white' : 'bg-muted'}`}>2</div>
              Platform
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground self-center" />
            <div className={`flex items-center gap-2 ${step === 3 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-primary text-white' : 'bg-muted'}`}>3</div>
              Generate
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground self-center" />
            <div className={`flex items-center gap-2 ${step === 4 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 4 ? 'bg-primary text-white' : 'bg-muted'}`}>4</div>
              Preview
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className={step !== 1 ? "opacity-60" : ""}>
                <h3 className="font-semibold text-lg mb-3">1. Upload Product Image</h3>
                <ImageUpload onImageUpload={handleImageUpload} />
              </div>
              
              {(productImage || step > 1) && (
                <div className={step !== 2 ? "opacity-60" : ""}>
                  <h3 className="font-semibold text-lg mb-3">2. Select Ad Platform</h3>
                  <PlatformSelector 
                    selectedPlatform={selectedPlatform} 
                    onSelectPlatform={handleSelectPlatform} 
                  />
                </div>
              )}
              
              {(selectedPlatform || step > 2) && (
                <div className={step !== 3 ? "opacity-60" : ""}>
                  <h3 className="font-semibold text-lg mb-3">3. Generate Ad Content</h3>
                  <AdGenerator 
                    productImage={productImage} 
                    platform={selectedPlatform} 
                    onAdGenerated={handleAdGenerated} 
                  />
                </div>
              )}
            </div>
            
            <div>
              {adContent && step === 4 ? (
                <div className="animate-fade-in">
                  <h3 className="font-semibold text-lg mb-3">4. Preview & Customize</h3>
                  <AdPreview 
                    adContent={adContent}
                    platform={selectedPlatform}
                    productImage={imagePreview}
                  />
                </div>
              ) : (
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="animate-float mb-6">
                      <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-16 w-16 text-primary/60" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Your ad preview will appear here</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Follow the steps on the left to generate your optimized ad content.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 AdGenie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/Icons";
import { AdContent } from "@/components/AdGenerator";
import { Download, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AdPreviewProps {
  adContent: AdContent;
  platform: string;
  productImage: string | null;
}

export function AdPreview({ adContent, platform, productImage }: AdPreviewProps) {
  const [selectedHeadline, setSelectedHeadline] = useState(0);
  const [selectedDescription, setSelectedDescription] = useState(0);
  
  const handleCopyToClipboard = () => {
    const content = `
Headline: ${adContent.headlines[selectedHeadline]}
Description: ${adContent.descriptions[selectedDescription]}
CTA: ${adContent.cta}
${adContent.hashtags ? `Hashtags: ${adContent.hashtags.join(' ')}` : ''}
${adContent.keywords ? `Keywords: ${adContent.keywords.join(', ')}` : ''}
    `;
    
    navigator.clipboard.writeText(content.trim());
    toast.success("Ad content copied to clipboard");
  };
  
  const handleExport = () => {
    toast.success("Ad content exported successfully");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="mt-4">
          {platform === 'google' && (
            <GoogleAdPreview 
              headline={adContent.headlines[selectedHeadline]}
              description={adContent.descriptions[selectedDescription]}
              cta={adContent.cta}
              image={productImage}
            />
          )}
          
          {platform === 'meta' && (
            <MetaAdPreview 
              headline={adContent.headlines[selectedHeadline]}
              description={adContent.descriptions[selectedDescription]}
              cta={adContent.cta}
              hashtags={adContent.hashtags || []}
              image={productImage}
            />
          )}
          
          {platform === 'tiktok' && (
            <TikTokAdPreview 
              headline={adContent.headlines[selectedHeadline]}
              description={adContent.descriptions[selectedDescription]}
              cta={adContent.cta}
              hashtags={adContent.hashtags || []}
              image={productImage}
            />
          )}
        </TabsContent>
        
        <TabsContent value="customize" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Headlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {adContent.headlines.map((headline, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedHeadline === index ? 'border-primary bg-primary/5' : 'hover:bg-accent'}`}
                  onClick={() => setSelectedHeadline(index)}
                >
                  {headline}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Descriptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {adContent.descriptions.map((description, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedDescription === index ? 'border-primary bg-primary/5' : 'hover:bg-accent'}`}
                  onClick={() => setSelectedDescription(index)}
                >
                  {description}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Call to Action</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 border rounded-md border-primary bg-primary/5">
                {adContent.cta}
              </div>
            </CardContent>
          </Card>
          
          {adContent.hashtags && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Hashtags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {adContent.hashtags.map((hashtag, index) => (
                    <span key={index} className="bg-accent px-3 py-1 rounded-full text-sm">
                      {hashtag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {adContent.keywords && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {adContent.keywords.map((keyword, index) => (
                    <span key={index} className="bg-accent px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => toast.success("Regenerating content...")}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <Button className="flex-1" onClick={handleCopyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copy All
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button className="w-full" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export Ad Content
      </Button>
    </div>
  );
}

function GoogleAdPreview({ headline, description, cta, image }: { 
  headline: string; 
  description: string; 
  cta: string; 
  image: string | null;
}) {
  return (
    <Card className="border-2 max-w-md mx-auto">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center gap-2">
          <Icons name="google" className="h-4 w-4" />
          <span className="text-xs text-muted-foreground">Ad</span>
          <span className="text-xs text-blue-600">www.yourproduct.com</span>
        </div>
        <CardTitle className="text-base text-blue-600 leading-tight">{headline}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {image && (
          <div className="flex gap-3 mb-3">
            <div className="rounded-md overflow-hidden w-24 h-24 flex-shrink-0">
              <img src={image} alt="Product" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm text-gray-700 line-clamp-4">{description}</p>
          </div>
        )}
        {!image && (
          <p className="text-sm text-gray-700 mb-2">{description}</p>
        )}
      </CardContent>
      <CardFooter className="px-4 py-2 bg-gray-50">
        <Button variant="outline" className="text-sm h-8 bg-white border-gray-200 hover:bg-gray-100 hover:text-blue-600">
          {cta}
        </Button>
      </CardFooter>
    </Card>
  );
}

function MetaAdPreview({ headline, description, cta, hashtags, image }: { 
  headline: string; 
  description: string; 
  cta: string; 
  hashtags: string[];
  image: string | null;
}) {
  return (
    <Card className="border-2 overflow-hidden max-w-md mx-auto">
      <div className="bg-gray-100 p-2 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          P
        </div>
        <div>
          <p className="text-sm font-medium">Your Product</p>
          <p className="text-xs text-gray-500">Sponsored</p>
        </div>
      </div>
      
      <div className="p-3">
        <p className="text-sm mb-2">{description}</p>
        <p className="text-sm text-blue-500 mb-3">
          {hashtags.slice(0, 3).join(' ')}
        </p>
      </div>
      
      {image && (
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img src={image} alt="Product" className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="p-3">
        <h3 className="text-base font-semibold">{headline}</h3>
        <p className="text-xs text-gray-500 mb-3">yourproduct.com</p>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">{cta}</Button>
      </div>
    </Card>
  );
}

function TikTokAdPreview({ headline, description, cta, hashtags, image }: { 
  headline: string; 
  description: string; 
  cta: string; 
  hashtags: string[];
  image: string | null;
}) {
  return (
    <Card className="border-2 overflow-hidden bg-gray-900 text-white max-w-md mx-auto">
      <div className="relative">
        {image ? (
          <div className="aspect-[9/16] w-full overflow-hidden">
            <img src={image} alt="Product" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
          </div>
        ) : (
          <div className="aspect-[9/16] w-full bg-gray-800 flex items-center justify-center">
            <p className="text-gray-400">Product Video</p>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-medium mb-2">{headline}</p>
          <p className="text-sm text-gray-200 mb-2">{description}</p>
          <p className="text-sm text-cyan-400 mb-4">
            {hashtags.slice(0, 4).join(' ')}
          </p>
          <Button className="w-full bg-white text-black hover:bg-gray-200">{cta}</Button>
        </div>
        
        <div className="absolute right-4 bottom-20 flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <Icons name="tiktok" className="h-5 w-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            ❤️
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            💬
          </div>
        </div>
      </div>
    </Card>
  );
}

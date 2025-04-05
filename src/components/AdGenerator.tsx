
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AdGeneratorProps {
  productImage: File | null;
  platform: string;
  onAdGenerated: (adContent: AdContent) => void;
}

export interface AdContent {
  headlines: string[];
  descriptions: string[];
  cta: string;
  hashtags?: string[];
  keywords?: string[];
}

export function AdGenerator({ productImage, platform, onAdGenerated }: AdGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!productImage) {
      toast.error("Please upload a product image");
      return;
    }

    setIsGenerating(true);

    // Simulating API call to generate ad content
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock response data based on platform
      const mockResponse: Record<string, AdContent> = {
        google: {
          headlines: [
            "High-Quality Product - Shop Now",
            "Best Deals on Premium Products",
            "Discover Excellence - Limited Time Offer"
          ],
          descriptions: [
            "Find the perfect solution for your needs. Our premium products are designed for maximum satisfaction.",
            "Top-rated selection with fast shipping and excellent customer service. Don't miss out!"
          ],
          cta: "Shop Now",
          keywords: ["premium product", "quality", "best deals", "fast shipping"]
        },
        meta: {
          headlines: [
            "Transform Your Experience Today!",
            "Discover What Everyone's Talking About",
            "Your Perfect Match Has Arrived"
          ],
          descriptions: [
            "Elevate your everyday with our premium product that combines style, functionality, and durability in one perfect package.",
            "Join thousands of satisfied customers who've made the switch. Limited time offer - don't miss out!"
          ],
          cta: "Shop Now",
          hashtags: ["#MustHave", "#PremiumQuality", "#LimitedOffer", "#BestDeal"]
        },
        tiktok: {
          headlines: [
            "This product is EVERYTHING 🔥",
            "Wait till you see this... 👀✨",
            "POV: Your life before vs after this product"
          ],
          descriptions: [
            "No joke, this changed my life! Perfect for anyone who wants to level up their game. #FYP",
            "The product everyone's obsessing over right now. Run don't walk! 🏃‍♂️💨"
          ],
          cta: "Shop Now",
          hashtags: ["#TikTokMadeMeBuyIt", "#FYP", "#Viral", "#MustHave", "#Obsessed"]
        }
      };
      
      onAdGenerated(mockResponse[platform]);
      toast.success("Ad content generated!");
    } catch (error) {
      toast.error("Failed to generate ad content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold text-lg mb-4">Generate Ad Content</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Our AI will analyze your product image and generate optimized ad content for your selected platform.
        </p>
        <Button 
          onClick={handleGenerate} 
          className="w-full"
          disabled={isGenerating || !productImage}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Ad Content
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

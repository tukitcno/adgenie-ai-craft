
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/Icons";

interface PlatformSelectorProps {
  selectedPlatform: string;
  onSelectPlatform: (platform: string) => void;
}

export function PlatformSelector({ selectedPlatform, onSelectPlatform }: PlatformSelectorProps) {
  const platforms = [
    { id: "google", name: "Google Ads", icon: "google" },
    { id: "meta", name: "Meta Ads", icon: "meta" },
    { id: "tiktok", name: "TikTok Ads", icon: "tiktok" }
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold text-lg mb-4">Select Ad Platform</h3>
        <RadioGroup 
          value={selectedPlatform} 
          onValueChange={onSelectPlatform}
          className="grid grid-cols-3 gap-4"
        >
          {platforms.map((platform) => (
            <div key={platform.id}>
              <RadioGroupItem
                value={platform.id}
                id={platform.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={platform.id}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                <Icons name={platform.icon} className={`h-8 w-8 mb-2 platform-icon ${selectedPlatform === platform.id ? 'active' : ''}`} />
                <span className="text-sm font-medium">{platform.name}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

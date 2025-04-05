
import { LucideIcon, LucideProps } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { MetaIcon } from "@/components/icons/MetaIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

interface IconProps extends LucideProps {
  name: string;
}

export function Icons({ name, ...props }: IconProps) {
  const icons: Record<string, LucideIcon> = {
    google: GoogleIcon,
    meta: MetaIcon,
    tiktok: TikTokIcon,
  };

  const Icon = icons[name] || GoogleIcon;

  return <Icon {...props} />;
}

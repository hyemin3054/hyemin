import { HeaderLayout } from "./HeaderLayout";
import { getSiteSettings } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";

export async function Header() {
  const { data: settings } = await getSiteSettings();
  return <HeaderLayout logoUrl={imageUrl(settings?.logo, 900)} />;
}

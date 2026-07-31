import type { HeroSlide as ApiHeroSlide } from "@/types";
import { getHeroSlideIconUrl, getHeroSlideImageUrl } from "@/lib/uploads";
import type { HeroSlideView } from "@/data/heroSlides";

export function mapHeroSlides(slides: ApiHeroSlide[]): HeroSlideView[] {
  return slides.map((slide, index) => ({
    id: slide._id,
    number: String(index + 1).padStart(2, "0"),
    title: slide.title,
    description: slide.description,
    background: getHeroSlideImageUrl(slide.image) ?? "",
    icon: getHeroSlideIconUrl(slide.icon) ?? "",
    ctaLink: slide.ctaLink ?? "",
  }));
}

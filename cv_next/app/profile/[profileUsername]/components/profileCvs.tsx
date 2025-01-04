import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "@/components/ui/Carousel/carouselStructure";
import CVItem from "@/app/feed/components/CV/CVItem";
import CVItemLink from "@/app/feed/components/CV/CVItemLink";

export default function ProfileCvs({ cvs }: { cvs: CvModel[] }) {
  const options: EmblaOptionsType = { loop: true };

  return (
    <EmblaCarousel options={options}>
      {cvs.map((cv) => (
        <div
          className="embla__slide"
          key={cv.id}
          style={{
            flex: "0 0 var(--slide-size)",
            minWidth: 0,
            maxWidth: 500,
            paddingLeft: "var(--slide-spacing)",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: 500 * 1.4142,
            }}
          >
            <CVItemLink key={cv.id} cv={cv}>
              <CVItem cv={cv} />
            </CVItemLink>
          </div>
        </div>
      ))}
    </EmblaCarousel>
  );
}

import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "@/components/ui/Carousel/carouselStructure";
import CVItem from "@/app/feed/components/CV/CVItem";
import CVItemLink from "@/app/feed/components/CV/CVItemLink";

/**
 * The profile's CV carousel component
 * @param {CvModel[]} param0 The CVs array
 * @returns {Element} The profile's CV carousel component
 */
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
          <div className="aspect-[1/1.414] w-full max-w-[500px] overflow-hidden rounded-lg bg-gray-100">
            <CVItemLink key={cv.id} cv={cv}>
              <CVItem cv={cv} />
            </CVItemLink>
          </div>
        </div>
      ))}
    </EmblaCarousel>
  );
}

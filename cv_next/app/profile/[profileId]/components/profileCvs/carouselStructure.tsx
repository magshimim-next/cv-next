import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { PrevButton, NextButton, usePrevNextButtons } from "./carouselArrows";
import useEmblaCarousel from "embla-carousel-react";
import CVItem from "@/app/feed/components/CVItem";
import CVItemLink from "@/app/feed/components/CVItemLink";
import { DotButton, useDotButton } from "./carouselDots";

type PropType = {
  slides: CvModel[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section
      className="embla"
      style={
        {
          "maxWidth": "48rem",
          "margin": "auto",
          "--slide-height": "19rem",
          "--slide-spacing": "1rem",
          "--slide-size": "100%",
        } as React.CSSProperties
      }
    >
      <div
        className="embla__viewport"
        style={{ overflow: "hidden" }}
        ref={emblaRef}
      >
        <div
          className="embla__container"
          style={{
            backfaceVisibility: "hidden",
            display: "flex",
            touchAction: "pan-y pinch-zoom",
            height: "100%",
          }}
        >
          {slides.map((cv) => (
            <div
              className="embla__slide"
              key={cv.id}
              style={{
                flex: "0 0 var(--slide-size)",
                minWidth: 0,
                maxWidth: 500,
                paddingLeft: "var(--slide-spacing)",
                height: "100%", // Ensure slide takes full height
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
        </div>
      </div>

      <div
        className="embla__controls"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          justifyContent: "space-between",
          gap: "1.2rem",
          marginTop: "1.8rem",
        }}
      >
        <div
          className="embla__buttons"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.6rem",
            alignItems: "center",
          }}
        >
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
        <div
          className="embla__dots"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            alignItems: "center",
            marginLeft: "calc((2.6rem - 1.4rem) / 2 * -1)",
          }}
        >
          {scrollSnaps.map((_, index) => (
            <DotButton key={index} onClick={() => onDotButtonClick(index)}>
              <span
                style={{
                  boxShadow: `inset 0 0 0 0.2rem ${index === selectedIndex ? "var(--primary)" : "var(--tw-gradient-from, #ccc)"}`,
                  width: "1.4rem",
                  height: "1.4rem",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  content: '""',
                }}
              />
            </DotButton>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;

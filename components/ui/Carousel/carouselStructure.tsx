"use client";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { PrevButton, NextButton, usePrevNextButtons } from "./carouselArrows";
import { DotButton, useDotButton } from "./carouselDots";

type PropType = {
  options?: EmblaOptionsType;
  children: React.ReactNode;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options, children } = props;
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
          {children}
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

"use client";
import EmblaCarousel from "./carouselStructure";
import { EmblaOptionsType } from "embla-carousel";

export default function ProfileCvs({ cvs }: { cvs: CvModel[] }) {
  const options: EmblaOptionsType = { loop: true };

  return <EmblaCarousel slides={cvs} options={options} />;
}

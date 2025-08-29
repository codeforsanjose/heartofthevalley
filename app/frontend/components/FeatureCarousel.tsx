"use client";
import { useListFeatures } from "../lib/api-client";
import { FeatureCard } from "./FeatureCard";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export const FeatureCarousel = () => {
    const { data, error, isPending } = useListFeatures({
        projectionExpression: "SK,title,imagePath",
    });

    const [sliderRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: "snap",
        slides: {
            perView: 1,
            spacing: 16,
        },
        breakpoints: {
            "(min-width: 768px)": {
                slides: { perView: 2, spacing: 20 },
            },
            "(min-width: 1024px)": {
                slides: { perView: 3, spacing: 24 },
            },
            "(min-width: 1536px)": {
                slides: { perView: 4, spacing: 28 },
            },
        },
    });

    if (isPending) {
        return <h1 className="text-3xl flex justify-center">Loading...</h1>;
    }

    if (error) {
        return <h1 className="text-3xl flex justify-center">Error: {error.message}</h1>;
    }

    const { features } = data.data;

    return (
        <section className="w-[90%] mx-auto px-4 py-10">
            <div ref={sliderRef} className="keen-slider">
                {features?.map(({ imagePath, SK, title }) => {
                    if (!imagePath || !SK || !title)
                        throw new Error("Error retrieving feature data.");
                    const id = SK.split("#")[1];
                    return (
                        <div className="keen-slider__slide" key={id}>
                            <FeatureCard imgSrc={imagePath} title={title} id={id} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

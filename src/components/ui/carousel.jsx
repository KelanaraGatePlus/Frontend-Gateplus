/* eslint-disable react/prop-types */
"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event) => {
      if (event.key === "ChevronLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ChevronRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden rounded-sm md:rounded-lg"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex gap-3",
          orientation === "horizontal" ? "-ml-1" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 transition-all duration-300 ease-in-out rounded-lg overflow-hidden",
        orientation === "horizontal" ? "" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

/* ================================
   🔥 LIQUID GLASS BUTTON STYLE
   ================================ */
const liquidButtonStyles =
  "size-6 sm:size-10 md:size-10 lg:size-14 rounded-full " +
  "bg-white/20 backdrop-blur-xl border border-white/40 " +
  "shadow-[0_0_15px_4px_rgba(255,255,255,0.2)] " +
  "flex items-center justify-center cursor-pointer";


/* ======================================
   ⬅️  PREVIOUS BUTTON — Liquid Glass
   ====================================== */
function CarouselPrevious({ className, ...props }) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      className={cn(
        "absolute -ml-4 md:-ml-6 lg:-ml-8",
        liquidButtonStyles,
        orientation === "horizontal"
          ? "top-1/2 -left-0.5 -translate-y-1/2"
          : "-bottom-1/2 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <Icon
        icon={'material-symbols:chevron-left-rounded'}
        width={40}
        height={40}
        alt="prev"
        className="outline-chevron text-[#222222]"
      />
    </button>
  );
}

/* ======================================
   ➡️  NEXT BUTTON — Liquid Glass
   ====================================== */
function CarouselNext({ className, ...props }) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      className={cn(
        "absolute -mr-4 md:-mr-6 lg:-mr-8",
        liquidButtonStyles,
        orientation === "horizontal"
          ? "top-1/2 -right-0.5 -translate-y-1/2"
          : "-bottom-1/2 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <Icon
        icon={'material-symbols:chevron-right-rounded'}
        width={40}
        height={40}
        alt="next"
        className="outline-chevron text-[#222222]"
      />
    </button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
};

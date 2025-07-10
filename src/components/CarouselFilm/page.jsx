/* eslint-disable react/react-in-jsx-scope */
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import film1 from "@@/logo/logoFilm/film_1.svg";
import film2 from "@@/logo/logoFilm/film_2.svg";
import film3 from "@@/logo/logoFilm/film_3.svg";
import Image from "next/legacy/image";
export default function CarosuelFilmPage() {
  return (
    <div>
      <section className="my-5 flex flex-col gap-10">
        {[film1, film2, film3].map((film, index) => (
          <section key={index}>
            <Carousel className="sm:max-h-auto sm:max-w-auto">
              <div className="mx-3 mb-2 flex justify-between text-white md:mx-5">
                <span className="text-lg font-bold md:mb-5 md:ml-3 md:text-[20px]">
                  Popular
                </span>
                <span className="text-lg font-bold md:mr-3 md:mb-5 md:text-[20px]">
                  Lainnya
                </span>
              </div>
              <CarouselContent>
                {[film1, film2, film3, film1, film2, film3, film1].map(
                  (film, idx) => (
                    <CarouselItem
                      key={idx}
                      className="basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                    >
                      <Image
                        src={film}
                        priority
                        alt="films-logo-banner"
                        className="rounded-sm md:rounded-lg"
                      />
                    </CarouselItem>
                  ),
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        ))}
      </section>
    </div>
  );
}

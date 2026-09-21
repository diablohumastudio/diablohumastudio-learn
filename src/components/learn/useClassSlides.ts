import { useEffect, useState } from 'react';
import { LEARN_COURSES, classSlides } from '../../data/learn';
import type { ClassSlide, LearnClass } from '../../data/learn';

export type SlidesByClass = Record<string, ClassSlide[]>;

function classesOf(classSlugs: readonly string[]): LearnClass[] {
  return LEARN_COURSES.flatMap((course) => course.classes).filter((learnClass) => classSlugs.includes(learnClass.slug));
}

/** Slides of the given classes, keyed by class slug; a class is missing until its deck dictionary loads. */
export function useClassSlides(classSlugs: readonly string[]): SlidesByClass {
  const [slidesByClass, setSlidesByClass] = useState<SlidesByClass>({});
  const wantedKey = classSlugs.join('|');

  useEffect(() => {
    let isCurrent = true;
    for (const learnClass of classesOf(wantedKey === '' ? [] : wantedKey.split('|'))) {
      classSlides(learnClass)
        .then((slides) => {
          if (isCurrent) setSlidesByClass((loaded) => ({ ...loaded, [learnClass.slug]: slides }));
        })
        .catch((error) => console.error('Could not load the slides of the class', error));
    }
    return () => {
      isCurrent = false;
    };
  }, [wantedKey]);

  return slidesByClass;
}

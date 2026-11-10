import { useEffect, useState } from 'react';
import { LEARN_COURSES, classSlides } from '../../data/learn';
import type { ClassSlide, LearnClass } from '../../data/learn';

export type SlidesByClass = Record<string, ClassSlide[]>;

/* A reading is a topic without a deck: only the classes among the slugs have slides to load. */
function classesOf(topicSlugs: readonly string[]): LearnClass[] {
  return LEARN_COURSES.flatMap((course) => course.classes).filter((learnClass) => topicSlugs.includes(learnClass.slug));
}

/** Slides of the classes among the given topics, keyed by class slug; a class is missing until
    its deck dictionary loads, and a reading never gets an entry. */
export function useClassSlides(topicSlugs: readonly string[]): SlidesByClass {
  const [slidesByClass, setSlidesByClass] = useState<SlidesByClass>({});
  const wantedKey = topicSlugs.join('|');

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

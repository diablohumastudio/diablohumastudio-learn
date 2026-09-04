const en = {
  pageTitle: 'Learn – DiabloHumaStudio',
  courseLabel: 'Course',
  classLabel: 'Class',
  fullscreen: 'Full screen',
  exitFullscreen: 'Exit full screen',
  exitFullscreenHint: 'Exit full screen (Esc)',
  classNotFound: 'Class not found.',
  goToLatest: 'Go to the latest class',
  previousSlide: 'Previous slide',
  nextSlide: 'Next slide',
  keysHint: '← → · space',
} as const;

const es: Record<keyof typeof en, string> = {
  pageTitle: 'Learn – DiabloHumaStudio',
  courseLabel: 'Curso',
  classLabel: 'Clase',
  fullscreen: 'Pantalla completa',
  exitFullscreen: 'Salir de pantalla completa',
  exitFullscreenHint: 'Salir de pantalla completa (Esc)',
  classNotFound: 'Clase no encontrada.',
  goToLatest: 'Ir a la última clase',
  previousSlide: 'Diapositiva anterior',
  nextSlide: 'Siguiente diapositiva',
  keysHint: '← → · espacio',
};

export const learnDict = { en, es };

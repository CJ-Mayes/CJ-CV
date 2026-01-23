export const WINDOW_CONSTANTS = {
  INITIAL_Z_INDEX: [1, 2, 0],
  SCALE: {
    WINDOW_2: 0.5,
    WINDOW_3: 0.5
  },
  POSITION: {
    INITIAL_Y: 32, // 2rem in pixels
    OVERLAP_PERCENTAGE: 0.15,
    WINDOW_2_OFFSET_X: 0.60,
    WINDOW_2_OFFSET_Y: 0.3,
    WINDOW_3_OFFSET_X: -0.5,
    WINDOW_3_OFFSET_Y: 50
  },
  SCROLL: {
    TEXT_OFFSET_MULTIPLIER: 100,
    OPACITY_MULTIPLIER: 0.5,
    WINDOW_OFFSET_MULTIPLIER: 150,
    WINDOW_SCALE_MIN: 0.9,
    WINDOW_SCALE_RANGE: 0.1,
    WINDOW_2_SPEED: 0.7,
    WINDOW_2_SCALE: 0.95,
    WINDOW_3_SPEED: 0.5,
    WINDOW_3_SCALE: 0.9
  },
  DRAG: {
    HORIZONTAL_OVERFLOW: 0.5,
    INITIALIZATION_DELAY: 100
  }
};

export const PORTFOLIO_CONSTANTS = {
  ALLOWED_PROJECTS: ['Misconceptions', 'Diary-Of-A-CEO', 'The-Golden-Set-IronViz'],
  IMAGE_MAP: {
    'Misconceptions': 'Misconceptions.png',
    'Diary-Of-A-CEO': 'Diary Of A CEO.png',
    'The-Golden-Set-IronViz': 'The Golden Set IronViz.png'
  },
  IMAGE_BASE_PATH: 'assets/images/portfolio/'
};

export const NAV_TABS_ORDER = ['portfolio', 'experience', 'skill'];

export const SECTION_ICONS: { [key: string]: string } = {
  'story': 'fas fa-user',
  'experience': 'fas fa-briefcase',
  'skill': 'fas fa-code',
  'portfolio': 'fas fa-folder-open'
};

import { DEFAULT_BRAND_STORY } from '../data/brandStory';

const STORAGE_KEY = 'lj_brand_story_v1';

export function getBrandStory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_BRAND_STORY;
    }

    return {
      ...DEFAULT_BRAND_STORY,
      ...JSON.parse(saved),
    };
  } catch (error) {
    console.error('Error loading brand story:', error);
    return DEFAULT_BRAND_STORY;
  }
}

export function saveBrandStory(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving brand story:', error);
    return false;
  }
}

export function resetBrandStory() {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_BRAND_STORY;
}
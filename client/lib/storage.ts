import AsyncStorage from "@react-native-async-storage/async-storage";

export interface GeneratedImage {
  id: string;
  uri: string;
  prompt: string;
  stepCount: number;
  seed?: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  GENERATED_IMAGES: "@ai_art_studio/generated_images",
  SETTINGS: "@ai_art_studio/settings",
  MODEL_PATH: "@ai_art_studio/model_path",
};

export interface AppSettings {
  defaultSteps: number;
  saveOriginals: boolean;
  modelPath?: string;
  isModelLoaded: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  defaultSteps: 25,
  saveOriginals: true,
  isModelLoaded: false,
};

// Generated Images
export async function getGeneratedImages(): Promise<GeneratedImage[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GENERATED_IMAGES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting generated images:", error);
    return [];
  }
}

export async function saveGeneratedImage(image: GeneratedImage): Promise<void> {
  try {
    const images = await getGeneratedImages();
    images.unshift(image);
    await AsyncStorage.setItem(
      STORAGE_KEYS.GENERATED_IMAGES,
      JSON.stringify(images)
    );
  } catch (error) {
    console.error("Error saving generated image:", error);
    throw error;
  }
}

export async function deleteGeneratedImage(id: string): Promise<void> {
  try {
    const images = await getGeneratedImages();
    const filtered = images.filter((img) => img.id !== id);
    await AsyncStorage.setItem(
      STORAGE_KEYS.GENERATED_IMAGES,
      JSON.stringify(filtered)
    );
  } catch (error) {
    console.error("Error deleting generated image:", error);
    throw error;
  }
}

export async function getImageById(id: string): Promise<GeneratedImage | null> {
  try {
    const images = await getGeneratedImages();
    return images.find((img) => img.id === id) || null;
  } catch (error) {
    console.error("Error getting image by id:", error);
    return null;
  }
}

// Settings
export async function getSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error getting settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
}

// Model path
export async function getModelPath(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.MODEL_PATH);
  } catch (error) {
    console.error("Error getting model path:", error);
    return null;
  }
}

export async function setModelPath(path: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MODEL_PATH, path);
  } catch (error) {
    console.error("Error setting model path:", error);
    throw error;
  }
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

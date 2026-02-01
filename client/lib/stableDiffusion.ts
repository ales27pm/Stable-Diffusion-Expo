import Constants from "expo-constants";
import { NativeModules, Platform } from "react-native";

// Type definitions for expo-stable-diffusion module
// This module only works in native builds, not Expo Go

export interface GenerateImageParams {
  prompt: string;
  stepCount?: number;
  savePath: string;
  seed?: number;
}

export interface StepEvent {
  step: number;
}

type StepListener = (event: StepEvent) => void;

// Mock implementation for development/Expo Go
// In production with native build, this would be replaced with actual expo-stable-diffusion calls

let isModelLoaded = false;
let currentModelPath: string | null = null;
let stepListeners: StepListener[] = [];

/**
 * Loads a Stable Diffusion model from the given file path into the module's runtime.
 *
 * Marks the module as loaded and records the loaded model path for subsequent operations.
 *
 * @param modelPath - Filesystem path or bundle identifier of the model to load
 * @throws Error if invoked on web platforms; Stable Diffusion is only available on native iOS builds
 */
export async function loadModel(modelPath: string): Promise<void> {
  if (Platform.OS === "web") {
    console.log("[Web] Stable Diffusion not available on web");
    throw new Error(
      "Stable Diffusion is only available on iOS devices with native builds",
    );
  }

  // In native build, this would call ExpoStableDiffusion.loadModel(modelPath)
  // For development, we simulate the loading process
  console.log(`[StableDiffusion] Loading model from: ${modelPath}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      isModelLoaded = true;
      currentModelPath = modelPath;
      console.log("[StableDiffusion] Model loaded successfully");
      resolve();
    }, 2000);
  });
}

export async function unloadModel(): Promise<void> {
  isModelLoaded = false;
  currentModelPath = null;
  console.log("[StableDiffusion] Model unloaded");
}

export function isLoaded(): boolean {
  return isModelLoaded;
}

/**
 * Returns the file path of the currently loaded Stable Diffusion model.
 *
 * @returns The loaded model's path as a string, or `null` if no model is loaded.
 */
export function getLoadedModelPath(): string | null {
  return currentModelPath;
}

/**
 * Registers a listener to receive step-progress events during image generation.
 *
 * @param listener - Function invoked with a `StepEvent` each generation step
 * @returns An object with a `remove` method that unregisters the listener so it no longer receives step events
 */
export function addStepListener(listener: StepListener): {
  remove: () => void;
} {
  stepListeners.push(listener);
  return {
    remove: () => {
      stepListeners = stepListeners.filter((l) => l !== listener);
    },
  };
}

/**
 * Notify all registered step listeners with the current generation step.
 *
 * @param step - The current generation step number (1-based)
 */
function notifyStepListeners(step: number) {
  stepListeners.forEach((listener) => listener({ step }));
}

/**
 * Generate an image from a text prompt using the currently loaded Stable Diffusion model.
 *
 * @param params - Generation parameters:
 *   - prompt: Text prompt describing the desired image.
 *   - stepCount: Number of diffusion steps to run (defaults to 25).
 *   - savePath: Filesystem path where the generated image will be saved.
 *   - seed: Optional random seed to reproduce results.
 * @returns The filesystem path where the generated image was saved.
 * @throws If no model is loaded.
 * @throws If called on the web platform (image generation requires iOS native builds).
 */
export async function generateImage(
  params: GenerateImageParams,
): Promise<string> {
  const { prompt, stepCount = 25, savePath, seed } = params;

  if (!isModelLoaded) {
    throw new Error("Model not loaded. Please load a model first.");
  }

  if (Platform.OS === "web") {
    throw new Error(
      "Image generation is only available on iOS devices with native builds",
    );
  }

  console.log(`[StableDiffusion] Generating image with prompt: "${prompt}"`);
  console.log(
    `[StableDiffusion] Steps: ${stepCount}, Seed: ${seed || "random"}`,
  );

  // Simulate the generation process
  // In native build, this would call ExpoStableDiffusion.generateImage(params)
  return new Promise((resolve, reject) => {
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep++;
      notifyStepListeners(currentStep);

      if (currentStep >= stepCount) {
        clearInterval(stepInterval);

        // In production, this would return the actual saved image path
        // For development, we return a placeholder
        console.log(`[StableDiffusion] Image generated at: ${savePath}`);
        resolve(savePath);
      }
    }, 800); // Simulate ~800ms per step
  });
}

/**
 * Detects whether the app is running inside Expo Go or the Expo Store client.
 *
 * @returns `true` if running under Expo Go or the Expo Store client, `false` otherwise.
 */
export function isExpoGo(): boolean {
  return (
    Constants.appOwnership === "expo" ||
    Constants.executionEnvironment === "storeClient"
  );
}

export function isNativeModuleAvailable(): boolean {
  if (Platform.OS !== "ios") {
    return false;
  }

  return Boolean(
    (NativeModules as { ExpoStableDiffusion?: unknown }).ExpoStableDiffusion,
  );
}

export type StableDiffusionAvailability = {
  isAvailable: boolean;
  canUseDemo: boolean;
  title: string;
  message: string;
};

export function getStableDiffusionAvailability(): StableDiffusionAvailability {
  if (Platform.OS === "web") {
    return {
      isAvailable: false,
      canUseDemo: false,
      title: "Unsupported Platform",
      message: "Stable Diffusion is not available on the web.",
    };
  }

  if (Platform.OS !== "ios") {
    return {
      isAvailable: false,
      canUseDemo: false,
      title: "Unsupported Platform",
      message: "Stable Diffusion is only available on iOS devices.",
    };
  }

  if (isExpoGo()) {
    return {
      isAvailable: false,
      canUseDemo: true,
      title: "Demo Mode",
      message:
        "Stable Diffusion runs only in native iOS builds. Using demo mode in Expo Go.",
    };
  }

  if (!isNativeModuleAvailable()) {
    if (__DEV__) {
      console.warn(
        "[StableDiffusion] Native module missing in development build.",
      );
    }
    return {
      isAvailable: false,
      canUseDemo: false,
      title: "Native Build Required",
      message:
        "Loading Stable Diffusion models requires a native iOS build. This feature is not available in Expo Go.\n\nBuild your app with EAS to use this feature.",
    };
  }

  return {
    isAvailable: true,
    canUseDemo: false,
    title: "Ready",
    message: "Stable Diffusion is available.",
  };
}

// Get device compatibility info
export function getDeviceCompatibility(): {
  isCompatible: boolean;
  reason?: string;
} {
  if (Platform.OS !== "ios") {
    return {
      isCompatible: false,
      reason: "Stable Diffusion is only available on iOS devices",
    };
  }

  // In a real implementation, we would check:
  // - iOS version >= 16.2
  // - Device RAM >= 6GB
  // - Neural Engine availability

  return {
    isCompatible: true,
  };
}

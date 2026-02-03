# AI Art Studio

## Overview
AI Art Studio is a React Native/Expo mobile app for generating AI images using Stable Diffusion natively on iOS devices via Core ML. The app features a dark, cyberpunk-inspired UI with electric cyan and magenta accent colors.

**Important**: The expo-stable-diffusion module requires a native iOS build (not Expo Go). In development/Expo Go, the app runs with a simulated generation experience using placeholder images.

## Recent Changes
- Initial app build with full UI implementation
- Created Generate, Gallery, and Settings screens
- Implemented AsyncStorage for local image persistence
- Added gradient button components and progress indicators
- Generated custom app icons and empty state illustrations

## Project Architecture

### Navigation Structure
```
RootStackNavigator
├── MainTabNavigator (3 tabs)
│   ├── GenerateTab → GenerateStackNavigator → GenerateScreen
│   ├── GalleryTab → GalleryStackNavigator → GalleryScreen, ImageDetailScreen
│   └── SettingsTab → SettingsStackNavigator → SettingsScreen
└── ImageDetailModal (modal presentation)
```

### Key Components
- `PreviewCard` - Image preview with generation progress overlay
- `ProgressIndicator` - Animated step progress during generation
- `GradientButton` - Primary action button with cyan-to-magenta gradient
- `PromptInput` - Multi-line text input for image descriptions
- `AdvancedSettings` - Collapsible accordion for step count and seed

### Data Storage
- Uses AsyncStorage for local persistence
- Stores generated images, settings, and model path
- Key storage utilities in `client/lib/storage.ts`

### Stable Diffusion Integration
- Mock implementation in `client/lib/stableDiffusion.ts` for development
- In native builds, replace with actual expo-stable-diffusion calls
- Supports model loading, step progress, and image generation

## Design System
- **Primary Color**: Electric Cyan (#00F0FF)
- **Secondary Color**: Vivid Magenta (#FF00F5)
- **Background**: Pure Black (#000000) for OLED optimization
- **Typography**: SF Pro Display (system font)
- See `design_guidelines.md` for complete design specifications

## Native Build Requirements
To use actual Stable Diffusion generation:
1. Install expo-stable-diffusion: `npx expo install expo-stable-diffusion`
2. Set iOS deployment target to 16.2+ in app.json
3. Add increased memory limit entitlement
4. Build with EAS: `npx expo prebuild && npx expo run:ios`
5. Download Core ML model from Apple's Hugging Face repo

## Release & Compliance Notes
- `ITSAppUsesNonExemptEncryption` is set to `false` in `app.json` based on current usage (standard HTTPS/TLS only). Revisit this flag if the app adds custom cryptography, VPN features, or any non-exempt encryption to avoid export compliance issues with Apple review. 
- `eas.json` configures `cli.appVersionSource` globally as `remote`. If future workflows need different versioning strategies per profile (e.g., internal vs production), update the EAS config accordingly.

## Workflows
- **Start Backend**: Express server on port 5000
- **Start Frontend**: Expo dev server on port 8081

## User Preferences
- Dark mode interface by default
- No emojis - uses Feather icons throughout
- Haptic feedback on key actions

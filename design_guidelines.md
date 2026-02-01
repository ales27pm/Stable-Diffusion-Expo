# AI Image Generator Design Guidelines

## 1. Brand Identity

**Purpose**: An iOS app that generates AI art locally on-device using Stable Diffusion, 100% offline and private.

**Aesthetic Direction**: **Bold/Striking with Technical Elegance**
- Dark-dominant interface (black background) with vibrant, saturated accent colors
- Emphasis on the generated artwork as the hero element
- Technical precision meets artistic expression
- Memorable element: Animated gradient overlays during generation that pulse with each step

**Differentiation**: The only AI art generator that works completely offline. The UI celebrates this with "LOCAL" and "PRIVATE" messaging, showing generation progress with technical step counts visible.

## 2. Navigation Architecture

**Root Navigation**: Tab Bar (3 tabs)
- **Generate** (center tab, core action) - Create new images
- **Gallery** - View saved generations
- **Settings** - Model management and preferences

## 3. Screen-by-Screen Specifications

### Generate Screen (Home)
**Purpose**: Main creation canvas where users input prompts and generate images

**Layout**:
- Header: Transparent, no buttons
- Root view: ScrollView with safe area insets: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl
- Main content:
  - Large preview area (full width, 1:1 aspect ratio) showing:
    - Empty state: Subtle gradient placeholder with "Enter a prompt to begin"
    - During generation: Live preview with animated gradient overlay + progress indicator
    - After generation: Generated image
  - Prompt input (multiline TextInput, 3-4 lines)
  - Advanced settings (collapsible accordion):
    - Step count slider (15-50 steps)
    - Seed input (optional, for reproducibility)
  - Generate button (full-width, prominent)

**Components**:
- Preview card with subtle shadow
- Floating progress indicator during generation (shows "Step 12/25" with circular progress)
- Generate button: Full-width, bold, with haptic feedback

### Gallery Screen
**Purpose**: Browse and manage saved generations

**Layout**:
- Header: Default navigation, title "Gallery", right button (grid/list toggle)
- Root view: ScrollView with safe area insets: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl
- Grid layout (2 columns on iPhone, 3 on iPad)
- Each image card shows thumbnail + prompt snippet
- Empty state: Custom illustration (see Assets section)

**Components**:
- Image grid with consistent spacing
- Tap to view full-screen with prompt details and metadata (steps, seed)
- Long-press for context menu (Share, Delete)

### Settings Screen
**Purpose**: Model management and app preferences

**Layout**:
- Header: Default navigation, title "Settings"
- Root view: Scrollable form with safe area insets: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl
- Sections:
  - **Profile** (avatar, display name)
  - **Model** (current model info, download status, storage used)
  - **Generation Defaults** (default steps, save originals)
  - **Appearance** (theme toggle if adding light mode)
  - **About** (version, GitHub link)

**Components**:
- Grouped list sections with dividers
- Info cards for model details
- Toggles and sliders for preferences

### Full-Screen Image View (Modal)
**Purpose**: View generated image in detail with actions

**Layout**:
- Native modal presentation
- Header: Transparent with X button (left), Share button (right)
- Scrollable/zoomable image view
- Bottom sheet overlay (swipe up) with:
  - Prompt text
  - Generation metadata (steps, seed, timestamp)
  - Actions: Save to Photos, Copy Prompt, Delete

## 4. Color Palette

**Background**:
- Primary Background: `#000000` (pure black for OLED)
- Surface: `#1A1A1A`
- Elevated Surface: `#2A2A2A`

**Accent**:
- Primary: `#00F0FF` (electric cyan - technical, futuristic)
- Secondary: `#FF00F5` (vivid magenta - creative, artistic)
- Gradient: Linear from Primary to Secondary (45° angle)

**Text**:
- Primary: `#FFFFFF`
- Secondary: `#A0A0A0`
- Tertiary: `#606060`

**Semantic**:
- Success: `#00FF88`
- Error: `#FF3366`
- Warning: `#FFB800`

**Generation Progress Overlay**: Animated gradient using Primary + Secondary with 30% opacity

## 5. Typography

**Font**: SF Pro Display (system font, optimized for iOS)

**Type Scale**:
- Headline: 32pt, Bold
- Title: 22pt, Semibold
- Body: 17pt, Regular
- Caption: 14pt, Regular
- Button: 17pt, Semibold

## 6. Visual Design

- Generate button uses bold gradient background (Primary → Secondary)
- All touchable elements have 60% opacity on press
- Preview area has subtle shadow: shadowOffset (0, 4), shadowOpacity 0.20, shadowRadius 12
- During generation, progress indicator pulses with gradient colors
- Tab bar icons from Feather: home, grid, settings
- NO EMOJIS - use Feather icons throughout

## 7. Assets to Generate

**App Icon** (`icon.png`)
- Abstract AI neural network pattern with gradient (cyan to magenta)
- WHERE USED: Device home screen

**Splash Icon** (`splash-icon.png`)
- Simplified version of app icon
- WHERE USED: Launch screen

**Empty Gallery** (`empty-gallery.png`)
- Minimalist illustration: Empty picture frame with sparkles
- Style: Line art with gradient accent
- WHERE USED: Gallery screen when no images generated

**Empty Generate** (`empty-generate.png`)
- Abstract geometric shapes suggesting creativity
- Style: Subtle, low-contrast illustration
- WHERE USED: Generate screen preview area before first generation

**Default Avatar** (`avatar-default.png`)
- Simple gradient circle (Primary → Secondary)
- WHERE USED: Settings screen profile section

**Model Status Illustration** (`model-ready.png`)
- Checkmark with circuit pattern
- WHERE USED: Settings screen model section when model loaded successfully

## 8. Key Interactions

- **Generation Start**: Button morphs into progress indicator with haptic feedback
- **Step Progress**: Counter increments with subtle pulse animation every step
- **Generation Complete**: Success haptic + brief gradient flash
- **Long Generation Times**: Show encouraging messages ("Creating magic...", "Step 18/25")
- **Error States**: Clear messaging if model not loaded or generation fails
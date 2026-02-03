#!/bin/bash

set -e

echo "EAS Build Post-Install Hook: Setting up Core ML dependencies..."

if [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
  echo "iOS build detected - Core ML setup will be handled by expo-stable-diffusion"
else
  echo "Skipping Core ML setup for non-iOS platform"
fi

echo "Post-install hook completed"

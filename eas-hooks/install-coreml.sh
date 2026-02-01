#!/usr/bin/env bash
set -euo pipefail

COREML_COMMIT="e12202c1f6405b83918b58a5d097cd61e3e1f702"

if ! command -v xcodebuild >/dev/null 2>&1; then
  echo "xcodebuild is required on the EAS macOS builder." >&2
  exit 1
fi

if ! command -v git-lfs >/dev/null 2>&1; then
  echo "git-lfs is required; installing via Homebrew." >&2
  brew install git-lfs
fi

git lfs install

python -m pip install --upgrade pip
pip install -r "https://raw.githubusercontent.com/apple/ml-stable-diffusion/${COREML_COMMIT}/requirements.txt"
pip install "git+https://github.com/apple/ml-stable-diffusion.git@${COREML_COMMIT}"

python -m python_coreml_stable_diffusion.torch2coreml -h

#!/usr/bin/env bash
set -e

TARGET_DIR="docs/synaptireach-billing-pricing-landing-prompts"
mkdir -p "$TARGET_DIR"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cp -f "$SCRIPT_DIR"/*.md "$TARGET_DIR"/

echo "Installed SynaptiReach Billing / Pricing / Landing Final Polish Prompt Pack prompts to $TARGET_DIR"
ls -la "$TARGET_DIR"

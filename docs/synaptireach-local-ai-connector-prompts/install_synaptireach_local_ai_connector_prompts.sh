#!/usr/bin/env bash
set -e

TARGET_DIR="docs/synaptireach-local-ai-connector-prompts"
mkdir -p "$TARGET_DIR"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cp -f "$SCRIPT_DIR"/*.md "$TARGET_DIR"/

echo "Installed SynaptiReach Local AI / Local Connector Prompt Pack prompts to $TARGET_DIR"
ls -la "$TARGET_DIR"

#!/usr/bin/env bash
set -e

TARGET_DIR="docs/synaptireach-database-supabase-hardening-prompts"
mkdir -p "$TARGET_DIR"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cp -f "$SCRIPT_DIR"/*.md "$TARGET_DIR"/

echo "Installed SynaptiReach Database / Supabase Schema Hardening Prompt Pack prompts to $TARGET_DIR"
ls -la "$TARGET_DIR"

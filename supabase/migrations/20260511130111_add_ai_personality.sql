ALTER TABLE workspaces
ADD COLUMN IF NOT EXISTS ai_personality text DEFAULT 'executive';

NOTIFY pgrst, 'reload schema';

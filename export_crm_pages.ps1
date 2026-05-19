# Output file
 = "exports/USER_CRM_FULL_CODE.md"

# Clear previous content
"# User CRM Full Code Export
" | Out-File  -Encoding UTF8

# List of CRM pages
 = @(
    "app/dashboard/page.tsx",
    "app/dashboard/leads/page.tsx",
    "app/dashboard/pipeline/page.tsx",
    "app/dashboard/tasks/page.tsx",
    "app/dashboard/calendar/page.tsx",
    "app/dashboard/marketing/page.tsx",
    "app/dashboard/communications/page.tsx",
    "app/dashboard/workflow/page.tsx",
    "app/dashboard/ai_assistant/page.tsx",
    "app/dashboard/settings/page.tsx"
)

# Export each file
foreach ( in ) {
    "# 
" | Out-File  -Append -Encoding UTF8

    # Read in blocks
    Get-Content  -ReadCount 50 | ForEach-Object {
         = ( -join "
")
        "`	sx

`" | Out-File  -Append -Encoding UTF8
    }

    "
" | Out-File  -Append -Encoding UTF8
}

Write-Host "All CRM page code exported to  successfully."

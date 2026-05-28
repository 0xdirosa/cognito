# workflow
- Batch deployments until a complete section/area is finished rather than deploying after each individual sub-task. Confidence: 0.65
- Flag manual steps clearly and wait for user confirmation before proceeding. Confidence: 0.75
- After each script completes, ask for confirmation before proceeding to the next. Confidence: 0.75
- Ask before assuming when encountering technical ambiguity. Confidence: 0.70
- For new phases/features, research via arc-docs first, report findings, present implementation plan, then wait for user confirmation before writing any code. Confidence: 0.80
- Present implementation plan and wait for confirmation before coding any sub-task — not just new phases. User explicitly corrected when plan was skipped and now proactively appends this instruction to new feature requests. Confidence: 0.75
- Never ask for API keys or secrets in chat. Add placeholders to .env.example, use process.env in code, add validation with clear error messages, then stop and tell user code is ready — user will fill .env themselves. Confidence: 0.95
- Present outline/draft for documentation and README rewrites before writing the full content. Wait for user confirmation before proceeding to write. Confidence: 0.70
- Skip the planning phase for well-defined documentation files, utility scripts, and JSON configs when the user provides complete specs — execute directly. Only present plans for architectural code changes or when explicitly asked. Confidence: 0.70

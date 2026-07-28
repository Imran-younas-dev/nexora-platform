# Feature Workflow

Use this workflow for product or engineering changes that benefit from a small written plan.

The goal is clarity, not ceremony.

## When To Use It

Use this template when a change:

- spans multiple files or modules
- changes behavior that should be reviewed explicitly
- introduces a new architectural idea
- is likely to be implemented with AI assistance

Skip the full artifact for tiny, obvious changes.

## Lightweight Spec Shape

Create a short note in the PR description, issue, or a temporary planning doc with these sections:

### Requirements

- What user or engineering problem is being solved?
- Is it in the current MVP?

### Implementation Plan

- Which modules or files will change?
- What is the smallest working path?

### Tasks

- Break the work into reviewable steps

### Acceptance Criteria

- What must be true for the change to count as done?

## Example

```md
## Requirements
- Support incident resolution in the current dashboard
- Stay within MVP scope

## Implementation Plan
- Add backend endpoint for resolution
- Add frontend action on incident list
- Update current architecture doc if boundaries change

## Tasks
- Implement endpoint
- Add UI action
- Add or update tests

## Acceptance Criteria
- An incident can be marked resolved from the dashboard
- The change passes lint and tests
```

## AI Collaboration Notes

- Point AI tools to `AGENTS.md` first
- Reference the exact authoritative docs instead of restating them in prompts
- Keep the spec current if implementation choices change

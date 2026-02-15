# Repository Workflow Summary (Solo Project)

## Overview

This repository follows a simplified branching workflow suitable for a single developer while still reflecting professional software development practice and version control discipline.

- **main** → Stable, submission ready version of the system.
- **dev** → Active development and integration branch.
- **feature/*** → Short lived branches for individual tasks or milestones.

## Branching Flow

```

feature/* → dev → main

````

- All development work starts from `dev`.
- `main` is updated only when a stable milestone is reached.
- Feature branches exist to isolate changes and support structured self review.

## Solo Development Workflow

### 1. Create a Feature Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feature/feature-name
````

Each feature branch represents one focused task.
Examples: `feature/products-crud`, `feature/vite-setup`

### 2. Work and Commit

```bash
git add .
git commit -m "Describe the completed change"
```

* Commits represent complete, working steps.
* Code must run locally before committing.

### 3. Push Feature Branch (Optional but Recommended)

```bash
git push -u origin feature/feature-name
```

* Provides off device backup.
* Creates a clear audit trail for academic assessment.

### 4. Merge into Dev

```bash
git checkout dev
git merge feature/feature-name
git push origin dev
```

* This replaces pull requests in a solo project.
* Conflicts are resolved immediately.

### 5. Promote to Main (Milestones Only)

```bash
git checkout main
git merge dev
git push origin main
```

Use this step only at:

* End of a development week
* Completion of a major feature set
* Pre submission checkpoints

### 6. Cleanup

```bash
git branch -d feature/feature-name
```

Keeps the repository readable and intentional.

## Testing Discipline

* Features are tested manually before merging.
* Backend routes are verified using Postman.
* Frontend features are verified in the browser.
* Only verified code is promoted to `main`.

## Branch Protection (Conceptual)

Even without enforced repository rules, the following constraints are treated as fixed:

* No direct work on `main`.
* `dev` must always remain runnable.
* `main` must always be demonstrably stable.


# Contributing to Arches-HER

We welcome contributions to Arches-HER. This guide follows the same general approach as the
[Arches contributing guide](https://github.com/archesproject/arches/blob/dev/8.1.x/CONTRIBUTING.md),
with Arches-HER specific requirements described below.

- [Contributing to Arches-HER](#contributing-to-arches-her)
  - [Found an Issue?](#found-an-issue)
  - [Contributing Code](#contributing-code)
    - [Important differences from core Arches](#important-differences-from-core-arches)
    - [Keeping your branch up to date](#keeping-your-branch-up-to-date)
  - [Shared Development Branches](#shared-development-branches)
  - [Commit Message Guidelines](#commit-message-guidelines)
  - [Arches-HER Specific Requirements](#arches-her-specific-requirements)
    - [Model and package changes](#model-and-package-changes)
    - [Letter templates (DOCX)](#letter-templates-docx)
    - [Accessibility](#accessibility)
  - [Contributing Documentation](#contributing-documentation)

## Found an Issue?

If you find a bug, please open an issue in the `archesproject/arches-her` repository and include:

- clear steps to reproduce
- expected vs actual behaviour
- screenshots/gifs where relevant
- environment details (Arches version, browser, OS)

Please check existing open/closed issues first to avoid duplicates.

## Contributing Code

1. Fork `archesproject/arches-her` and clone your fork.
2. Create a feature branch from `dev/1.1.x`:

   ```shell
   git checkout -b 1231_short_description dev/1.1.x
   ```

3. Make focused changes for one issue/feature.
4. Run relevant tests locally:

   ```shell
   python manage.py test tests --settings="tests.test_settings"
   ```

5. Commit and push your branch.
6. Open a pull request against `archesproject/arches-her`.

### Important differences from core Arches

- You **do not** need to sign a CLA for contributions to this repository.
- Use `dev/1.1.x` as the default base branch for normal work unless maintainers request otherwise.

### Keeping your branch up to date

If requested during review, rebase your branch against `dev/1.1.x` and force-push:

```shell
git rebase dev/1.1.x -i
git push origin my-fix-branch -f
```

## Shared Development Branches

Arches-HER follows long-lived `dev/A.B.x` branches for ongoing development, that allow future enhancements to be made to the next release (the default branch) while the current release is being stabilized. For example, `dev/1.1.x` is the current default and is receiving minor enhancments and fixes. The previous release branch, `dev/1.0.x`, would continue to receive critical bug fixes.

When a new major version is being developed, a new `dev/2.0.x` branch will be created for that work, and `dev/1.1.x` will continue to receive bug fixes and minor improvements until the next major release.

Contributors should normally branch from the current default branch unless a reviewer asks for a different target.

## Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature").
- Use imperative mood ("Fix bug" not "Fixes bug").
- Keep the first line to 72 characters or fewer.
- Reference the related issue where possible.

## Arches-HER Specific Requirements

### Model and package changes

- Prefer package-based changes under `arches_her/pkg/` (graphs, reference data, map layers, business data) rather than ad hoc runtime edits.
- Treat graph/model changes as high-impact: keep them tightly scoped, explain migration/load implications in the PR, and include any required data/package update steps.
- Avoid unrelated schema/model changes in the same PR.

### Letter templates (DOCX)

Arches-HER letter templates can break when field tags are split across style runs. If you edit letter templates, run:

```shell
python manage.py docx fix_style_runs --dest_dir docx
```

The `--dest_dir` option is optional and defaults to `docx`.

### Accessibility

Arches-HER contributions must maintain WCAG 2.2 AA accessibility standards. In particular:

- preserve keyboard accessibility and visible focus order
- ensure sufficient contrast and readable content structure
- provide meaningful labels/text alternatives for controls and media

Include accessibility considerations in PR descriptions for UI changes.

## Contributing Documentation

Arches-HER currently has no separate documentation repository.

For documentation updates:

- update `README.md` as the primary developer/user-facing documentation
- include any setup, configuration, and operational changes needed to run the application
- where relevant, link to core Arches documentation for shared platform behaviour

Thank you for contributing to Arches-HER.

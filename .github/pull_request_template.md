# Pull Request

<!-- Provide a general summary of the Pull Request in the Title above -->

## Types of changes

<!-- Put an `x` in the boxes that apply -->
- [ ] Bugfix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Description of Change

<!-- Include a brief description of this Pull Request and reasoning behind it. -->

## Issues Solved

<!-- If this Pull Request solves any issues, list them here. -->
Closes #

## Checklist

<!-- Put an `x` in the boxes that apply. You can also fill these out after creating the PR. -->
- I targeted one of these branches:
  - [ ] `dev/1.1.x` (default): features and bugfixes for the current release line
  - [ ] `dev/2.0.x` (next major): work intended for the next major release
- [ ] I added/updated a release note in `releases/` (if appropriate)
- [ ] I updated `README.md` (if setup/configuration/behaviour changed)
- [ ] Unit tests pass locally with my changes
- [ ] I added tests that prove my fix is effective or that my feature works
- [ ] My test fails on the target branch (if claiming this, explain below)

### Arches-HER Specific Checklist

- [ ] Model/graph changes are for the ongoing benefit of HERs and not for a specific project/use case.
- [ ] Model/graph changes are clearly labelled in the PR title and description, and unrelated code changes are excluded.
- [ ] Model/graph changes have been discussed with the community (link Arches Forum discussions or GitHub issues where relevant).
- [ ] Migration/load implications are documented below (if model/graph/package changed).
- [ ] If I edited letter templates, I ran `python manage.py docx fix_style_runs --dest_dir docx`

Model/graph/package upgrade/load notes (if applicable):

<!-- If your PR includes changes to models, graphs, or packages, explain any upgrade or load implications here. -->

<!-- Discussion links to Arches Forum or GitHub issues (if applicable): -->

### Accessibility Checklist

<!-- If your changes impacted the following areas, mark the appropriate columns. -->

| Topic             | Changed | Retested |
| ----------------- | ------- | -------- |
| Color contrast    |         |          |
| Form fields       |         |          |
| Headings          |         |          |
| Links             |         |          |
| Keyboard          |         |          |
| Responsive design |         |          |
| HTML validation   |         |          |
| Screen reader     |         |          |

## Ticket Background

- Sponsored by: <!-- Who is funding this effort? -->
- Found by: @ <!-- This could be the person who files the bug, but not always. -->
- Tested by: @ <!-- Who tested this? -->
- Designed by: @ <!-- Who designed this new feature? -->

## Further comments

<!-- If this is a relatively large or complex change, explain trade-offs, alternatives, or follow-up work. -->

# Lab Ranking V2 Proposal

**Status:** Updated after maintainer feedback; implementation ready for review
**Scope:** `/lab` GitHub analysis, competitive developer score, leaderboard, ranking statistics, and rank-dependent achievements  
**Out of scope:** Changes to Breaking Bad character assignment, scheduled background refreshes, private GitHub activity, and subjective code-quality assessment

## Executive summary

The current `/lab` experience combines two different products:

1. A playful developer-personality system that assigns a Breaking Bad character.
2. A competitive leaderboard that claims to rank developer activity.

The character system currently produces assignments that users consider good. It should be preserved. The competitive score, however, is not presently suitable for ranking because profiles are normalized against themselves, non-coding events can produce high consistency, forks can inflate authored-work traits, repository collection is truncated, and rank/percentile rules disagree across screens.

This proposal separates the two systems:

- **Persona pipeline:** preserve the current 15-trait character behavior.
- **Competitive ranking pipeline:** introduce a versioned, public-only, rolling 90-day score with fixed rules and four auditable pillars.

The new ranking score measures **recent public engineering activity and stewardship**. It does not claim to measure developer skill, code quality, employability, or private work.

## Approval requested

The maintainer is asked to approve:

- [ ] Separating competitive scoring from character matching.
- [ ] The four-pillar weighting: sustained activity 30%, building 30%, collaboration 25%, stewardship 15%.
- [ ] The undergraduate-fairness rule: repository stars, forks received, and fork creation have zero direct competitive weight.
- [ ] Public-only data and a rolling 90-day window.
- [ ] Fixed, monotonic scoring functions with no per-user or population normalization.
- [ ] Competition ranking for ties and an actual score distribution.
- [ ] Versioned score persistence and a version-2-only leaderboard after migration.
- [ ] A golden-cohort calibration gate and shadow rollout.
- [ ] The explicit exclusions and accepted trade-offs at the end of this proposal.

The exact numerical caps below are proposed starting values. They may be adjusted during golden-cohort calibration, but weights, monotonicity, privacy rules, and score meaning should remain fixed unless separately approved.

## Why a redesign is necessary

### 1. Current scores are not comparable

The current engine contrast-stretches every developer's traits against that same developer's minimum and maximum before calculating the total score. A positive input can therefore lower the final score.

Confirmed counterexample: adding one follower lowered a profile from 49 to 48 because unrelated normalized traits moved downward.

Relevant code:

- [`lib/lab/traits.ts`](lib/lab/traits.ts#L257)
- [`lib/lab/developer-score.ts`](lib/lab/developer-score.ts#L23)

### 2. Consistency does not measure consistent coding

The current regularity function uses the variance between all GitHub event timestamps. It does not filter for coding events or aggregate by contribution day.

Confirmed counterexamples:

- Twelve pushes one minute apart and twelve pushes across twelve days both score 93 for Consistency.
- Twelve `WatchEvent`s, which GitHub defines as starring repositories, also score 93.

Relevant code:

- [`lib/lab/traits.ts`](lib/lab/traits.ts#L62)
- [GitHub event types](https://docs.github.com/en/rest/using-the-rest-api/github-event-types?apiVersion=2022-11-28)

### 3. Forks can inflate authored-work signals

Forked repositories are excluded from only some signals. Their descriptions, topics, languages, and names still raise Architect, Documentation, Scientist, Explorer, and other traits.

Confirmed fork-only fixture:

| Metric          | Empty profile | 20 described/tagged forks |
| --------------- | ------------: | ------------------------: |
| Architect       |            23 |                        92 |
| Documentation   |            16 |                        96 |
| Developer score |            29 |                        55 |

### 4. GitHub data and displayed methodology disagree

- Repository fetching stops at the first 100 results.
- The Events API contains at most 300 events from the previous 30 days, while the UI claims a 90-day window.
- The UI claims weights of 35% commit volume, 35% repository quality/documentation, and 30% consistency, but the implementation averages 15 overlapping traits.

Relevant code and documentation:

- [`lib/lab/github.ts`](lib/lab/github.ts#L111)
- [`components/lab/bell-curve.tsx`](components/lab/bell-curve.tsx#L220)
- [GitHub repository pagination](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28)
- [GitHub Events API](https://docs.github.com/en/rest/activity/events)

### 5. Rank rules disagree

- The leaderboard gives equal scores different ordinal ranks based on alphabetical order.
- The profile ranking uses `usersAbove + 1`, which gives equal scores the same rank.
- The percentile calculation can label rank 1 of 5 as "Top 10%."
- The bell curve is a fitted Gaussian rather than the actual participant distribution.
- The top-10 achievement is never passed rank information by the production analysis pipeline.

Relevant code:

- [`lib/lab/leaderboard.ts`](lib/lab/leaderboard.ts#L29)
- [`lib/lab/bell-curve.ts`](lib/lab/bell-curve.ts#L52)
- [`lib/lab/analyze.ts`](lib/lab/analyze.ts#L105)

## Product definition

### Competitive score

The version-2 developer score measures:

> Recent public engineering activity and stewardship over a rolling 90-day window, calibrated for undergraduate and early-career developers.

### Undergraduate-fairness rule

Repository popularity is not a reasonable proxy for undergraduate effort. Stars and forks received are strongly affected by project age, audience size, existing networks, and promotion opportunities that students do not share equally. Therefore:

- repository stars have zero direct weight;
- forks received have zero direct weight;
- creating a fork has zero direct weight;
- work performed through a fork counts only when it appears as a qualifying public upstream contribution, such as a pull request or review.

These signals may be shown as non-competitive profile context, but they must not affect the score, rank, percentile, score bands, or ranking achievements.

It does not measure:

- code correctness or complexity;
- private or internal work;
- seniority or employability;
- lines changed;
- follower popularity;
- repository stars;
- character/personality similarity.

The UI may retain the short label **Developer Score**, but the methodology must state this definition and its limitations.

### Target score bands

Scores have stable, absolute meaning and do not move when other users join:

|  Score | Interpretation                    |
| -----: | --------------------------------- |
|   0–19 | Little recent public evidence     |
|  20–39 | Emerging activity                 |
|  40–59 | Active builder                    |
|  60–79 | Strong sustained contributor      |
|  80–94 | Exceptional for the target cohort |
| 95–100 | Deliberately rare                 |

## Character-preservation rule

The character pipeline is frozen for this overhaul:

- Do not change the 15 current trait definitions used for persona assignment.
- Do not change character profiles, similarity weights, or tie-breaking.
- Do not feed the new competitive score or pillar scores into character matching.
- Capture representative persona fixtures before refactoring orchestration.
- Require exact top-character matches for those fixtures after the ranking work.

The code should explicitly separate:

```text
GitHub data
├── Persona snapshot V1 → current traits → current character matching
└── Ranking snapshot V2 → four pillars → competitive developer score
```

The profile trait radar remains a persona visualization. The four competitive pillars are displayed separately.

## Ranking data contract

### Source

Use GitHub GraphQL `contributionsCollection(from:, to:)` for contribution records and repository metadata queries for project hygiene.

Do not use the contribution calendar's aggregate day counts because it can include anonymous private/restricted contribution counts. Instead, construct the ranking snapshot from explicit contribution objects:

- require `isRestricted === false`;
- require repository visibility to be public;
- use `occurredAt` to construct public active days;
- use `commitCount` for per-day commit credit;
- page all pull request, review, and issue contribution connections;
- fetch enough commit-contribution repositories to reach all scoring caps;
- reject incomplete required pagination rather than publishing a partial score.

GitHub exposes the required contribution fields in its GraphQL schema:

- [ContributionsCollection and contribution objects](https://docs.github.com/en/graphql/reference/users)
- [CommitContributionsByRepository](https://docs.github.com/en/graphql/reference/commits)

### Public-only rules

Count only contributions whose underlying repository is public.

Do not count:

- restricted/private contribution totals;
- private or internal repositories;
- starring/watching;
- following/followers;
- comment bodies or comment volume;
- fork creation;
- activity that cannot be attributed to a qualifying public repository.

### Window

- Use exactly 90 rolling days ending at capture time.
- Store the exact `windowStart`, `windowEnd`, and `capturedAt`.
- Use UTC dates consistently for day and week buckets.
- Do not normalize for accounts younger than 90 days.

### Eligibility

- Require an authenticated GitHub API account with type `User`.
- Reject organization and bot account types.
- Do not require account age, followers, university membership, or a minimum repository count.

## Score formula

### Shared functions

All functions must be deterministic and monotonic.

```text
linear(value, cap) =
    100 × min(value, cap) / cap

diminishing(value, cap) =
    100 × sqrt(min(value, cap) / cap)
```

Keep full precision through all pillar calculations. Round only the final 0–100 developer score to an integer.

Missing pillars remain zero. Their weight is never redistributed.

### Pillar 1: sustained activity — 30%

Purpose: reward activity distributed across the full window without encouraging token daily commits.

```text
activeWeekScore = linear(activeWeeks, 13)
activeDayScore  = linear(activeDays, 36)

sustainedActivity =
    0.65 × activeWeekScore +
    0.35 × activeDayScore
```

Rules:

- A week is active if it contains at least one qualifying public contribution.
- A day is active if it contains at least one qualifying public contribution.
- Fifty contributions on one day still produce one active day.
- Do not award streak bonuses.
- Do not use timestamp-gap variance.

### Pillar 2: building — 30%

Purpose: reward public commit activity and maintained original projects without allowing commit splitting or repository spam to dominate.

```text
creditedCommitsForDay = min(publicCommitCountForDay, 5)
creditedCommits       = sum(creditedCommitsForDay)

commitScore     = diminishing(creditedCommits, 90)
activeRepoScore = linear(activeOriginalRepositories, 5)

building =
    0.70 × commitScore +
    0.30 × activeRepoScore
```

An active original repository must:

- be public;
- be owned by the user;
- not be a fork;
- contain at least one eligible commit contribution from the user during the
  window. A repository remains active even when another repository consumes
  that day's shared five-commit cap.

Do not count stars, forks received, lines changed, repository names, or inactive repository totals.

### Pillar 3: external collaboration — 25%

Purpose: reward contribution to work the developer does not personally own.

External means the repository owner login differs from the analyzed user's login. Organization-owned work therefore counts as external collaboration.

#### Pull requests — 45% of collaboration

- Merged external PR: 1 point.
- Still-open external PR: 0.5 points.
- Closed-unmerged PR: 0 points.
- Maximum 2 credited PR points per day.
- Maximum 4 credited PR points per repository.
- Proposed full-credit cap: 12 PR points.

```text
pullRequestScore = diminishing(creditedPullRequestPoints, 12)
```

#### Reviews — 35% of collaboration

- Count submitted reviews of another author's pull request.
- Count at most one review per pull request per day.
- Maximum 4 credited reviews per day.
- Maximum 10 credited reviews per repository.
- Proposed full-credit cap: 24 reviews.

```text
reviewScore = diminishing(creditedReviews, 24)
```

#### Issues — 20% of collaboration

- Count external issues opened by the user.
- Do not count issue comments or comment length.
- Maximum 2 credited issues per day.
- Maximum 4 credited issues per repository.
- Proposed full-credit cap: 10 issues.

```text
issueScore = diminishing(creditedIssues, 10)
```

Final collaboration score:

```text
collaboration =
    0.45 × pullRequestScore +
    0.35 × reviewScore +
    0.20 × issueScore
```

The numerical caps are calibration candidates. The activity definitions and exclusions are not.

### Pillar 4: stewardship — 15%

Purpose: reward basic public project hygiene without claiming to judge architecture or documentation quality.

Score every active qualifying original repository, then select the five highest
hygiene scores with credited commits and repository name as deterministic
tie-breaks. This selection rule is monotonic: adding more qualifying work cannot
displace a stronger hygiene score and lower the pillar.

Each repository receives:

| Signal                                         | Points |
| ---------------------------------------------- | -----: |
| GitHub resolves a README on the default branch |     40 |
| Non-empty description exists                   |     25 |
| At least one topic exists                      |     15 |
| License is declared                            |     10 |
| At least one release or version tag exists     |     10 |

```text
stewardship = sum(topFiveRepositoryHygieneScores) / 5
```

Missing slots contribute zero. If there is no qualifying active original
repository, stewardship is 0. The fixed five-repository denominator rewards
maintaining several healthy projects without letting an additional weaker
project reduce an existing score.

README presence uses GitHub's canonical repository README endpoint, including
GitHub-supported formats and the `.github`, root, and `docs` locations.

### Final score

```text
developerScore =
    round(
        0.30 × sustainedActivity +
        0.30 × building +
        0.25 × collaboration +
        0.15 × stewardship
    )
```

`Chaos`, followers, following, stars, fork counts, language count, and persona traits have zero weight in the competitive score.

## Rank and distribution rules

### Rank

Use competition ranking:

```text
rank = 1 + number of participants with a strictly higher integer score
```

Example:

```text
Scores: 91, 91, 84
Ranks:   1,  1,  3
```

Alphabetical username order may make table rendering deterministic, but must not change rank.

Rank must use the same integer score displayed to users. There are no hidden decimal tie-breakers.

### Percentages

```text
higherThanPercent =
    floor(100 × usersWithStrictlyLowerScore / participantCount)

topPercent =
    ceil(100 × rank / participantCount)
```

Always display participant count, for example:

> Rank 4 of 83 analyzed developers

### Distribution

Remove the fitted Gaussian bell curve. Display the actual version-2 cohort using one of:

- a fixed-width score histogram; or
- an empirical cumulative distribution.

The first implementation should prefer the histogram because its meaning is easiest to explain.

## Achievements

Split achievements into two categories.

### Dynamic achievements

Rank-dependent badges such as **Say My Name** are calculated at render time from the current competition rank. They are not permanently stored.

Tied users with rank 10 or better all receive the badge, even if this produces more than ten badge holders.

### Durable achievements

Activity-based achievements may be persisted after a successful version-2 analysis. Their descriptions and predicates must use the new ranking snapshot or pillars.

Examples:

- daily/weekly consistency badges use public active days or weeks;
- original-repository badges use qualifying active original repositories;
- collaboration badges use external PR/review counts.

Persona-only achievements may continue to use the frozen persona traits, but must not be presented as competitive ranking evidence.

## Persistence design

Create a separate versioned score record rather than overloading persona profile data.

Proposed table:

```text
lab_profile_scores
├── id
├── profile_id              FK → lab_profiles.id
├── score_version           integer
├── developer_score         integer
├── pillar_scores           jsonb
├── ranking_snapshot        jsonb
├── captured_at             timestamp
├── created_at
└── updated_at
```

Constraints and indexes:

- unique `(profile_id, score_version)`;
- index `(score_version, developer_score)`;
- database check that `developer_score` is between 0 and 100.

The snapshot stores normalized public aggregates only:

- daily credited commit counts;
- active day/week markers;
- eligible PR, review, and issue aggregates;
- qualifying repository-hygiene facts;
- window bounds and capture time;
- algorithm/config version.

Do not store commit messages, PR titles, issue content, comment bodies, or OAuth tokens in the ranking snapshot.

The existing `lab_profiles.developerScore` may remain temporarily as the version-1 value for rollback. It should be removed or clearly deprecated in a later cleanup migration.

## Module boundaries

The current pipeline couples GitHub collection, trait scoring, character matching, competitive score, and achievements. Version 2 should introduce explicit seams:

```text
lib/lab/persona/
├── existing snapshot normalization
├── existing trait scoring
└── existing character assignment

lib/lab/ranking/
├── types.ts               RankingSnapshotV2 and PillarScores
├── github.ts              Public GraphQL collection and pagination
├── score.ts               Pure four-pillar score engine
├── rank.ts                Shared ties/percentiles/distribution
└── achievements.ts        Ranking-derived achievement predicates

app/lab/actions.ts
└── orchestration and atomic persistence only
```

The exact directory names are flexible. The required architectural property is that persona assignment cannot accidentally depend on the competitive score.

## Atomic analysis behavior

Analysis must be all-or-nothing:

1. Validate authentication and GitHub account type.
2. Resolve or fetch the persona snapshot using existing behavior.
3. Fetch every required version-2 public contribution page.
4. Validate the normalized ranking snapshot.
5. Calculate pillars and final score using pure functions.
6. Persist the score record and durable achievements in one database transaction.
7. Revalidate affected profile and leaderboard paths only after commit.

If GitHub fails, pagination is incomplete, rate limits are reached, or validation fails:

- keep the last successful score;
- do not overwrite with partial data;
- return a user-safe error;
- include actionable diagnostic context in server logs without logging tokens.

## Migration and rollout

### Phase 0: freeze behavior and create fixtures

- Capture synthetic/anonymized persona fixtures representing current character assignments.
- Add exact top-character regression tests.
- Create a golden ranking cohort:
    - inactive/new profile;
    - occasional student builder;
    - steady solo builder;
    - strong external collaborator;
    - prolific but bursty developer;
    - fork-heavy/gamed profile;
    - highly active outlier.
- Record expected qualitative ordering and target score bands before tuning caps.

### Phase 1: implement version-2 collection and pure scoring

- Add ranking snapshot types and validation.
- Implement GraphQL public contribution collection.
- Implement fixed four-pillar formulas.
- Add property and fixture tests.
- Do not change public score display.

### Phase 2: add versioned persistence in shadow mode

- Add the score table and queries.
- Compute and store version-2 scores alongside version 1.
- Keep the public leaderboard on version 1.
- Add an admin/local dry-run comparison report.

The report should include:

- old score;
- new score and four pillars;
- score-band distribution;
- ranking movement;
- character before/after, which must be unchanged;
- any collection failures or truncated/capped inputs.

### Phase 3: calibrate and approve constants

- Run the golden cohort and shadow profiles.
- Confirm score bands match the intended early-career cohort.
- Adjust only published caps/thresholds as necessary.
- Re-run monotonicity and anti-gaming tests after every adjustment.
- Obtain maintainer sign-off on final constants.

### Phase 4: migrate profiles

- Run a one-time admin migration using linked GitHub tokens.
- Populate version-2 score records without deleting persona or version-1 data.
- Profiles that cannot be refreshed keep their character page but remain outside the version-2 leaderboard until they rerun analysis.

### Phase 5: atomic public switch

- Change leaderboard and profile score queries to version 2.
- Show the four-pillar breakdown and credited public aggregates.
- Replace Gaussian distribution with the real version-2 histogram.
- Activate shared rank/percentile logic.
- Activate dynamic rank achievements.
- Publish accurate methodology and limitations.

### Phase 6: cleanup after observation

- Observe errors and ranking behavior for an agreed period.
- Keep rollback capability during that period.
- Remove deprecated version-1 score paths only after approval.
- Do not remove the frozen persona pipeline.

## Required test suite

### Score-engine unit tests

- Same snapshot always produces the same result.
- Every pillar and final score remain within 0–100.
- Increasing a positive input never lowers its pillar or final score.
- Missing pillars remain zero and do not reweight others.
- Daily and repository caps work exactly.
- Full precision is preserved until final rounding.
- Followers, following, stars, fork counts, Chaos, and persona traits cannot change the competitive score.

### Regression tests for confirmed bugs

- One-day burst does not equal thirteen active weeks.
- Starring repositories contributes zero activity.
- Fork-only repositories contribute zero building and stewardship.
- Repository and GraphQL connections are fully paginated to required caps.
- Equal integer scores receive equal rank.
- Rank 1 of 5 displays Top 20%, not Top 10%.
- Top-10 achievement is reachable through the production profile path.
- Incomplete API data never replaces a successful score.

### Collector tests

- Restricted contributions are excluded.
- Private/internal repositories are excluded.
- Public organization-owned contributions are classified as external.
- Self-authored PR reviews are excluded.
- Closed-unmerged PRs receive no credit.
- Open PRs receive partial credit.
- UTC day/week bucketing is deterministic.
- Account type validation rejects bots and organizations.
- Pagination and rate-limit errors are surfaced atomically.

### Character-preservation tests

- Existing representative fixtures retain the exact primary character.
- Existing top-three character ordering remains unchanged where captured.
- Competitive pillar changes cannot affect character assignment.

### Integration tests

- Analysis writes persona and version-2 score data without coupling them.
- Leaderboard and profile display use the same version and integer score.
- Version-1 and version-2 profiles are never mixed in one ranking.
- Dynamic achievements use the same shared rank calculation.
- Failed analysis leaves the prior score and achievements intact.

## UI changes

### Profile

Show:

- integer Developer Score;
- four pillar scores;
- main credited aggregates;
- capture time and 90-day window;
- rank, participant count, higher-than percentage, and top percentage;
- actual cohort histogram;
- methodology limitations.

Keep:

- current character assignment;
- current persona trait radar;
- current character-match explanations.

Clearly label persona traits and competitive pillars as separate concepts.

### Leaderboard

- Use version-2 scores only.
- Use competition ranks.
- Keep deterministic table order for tied users.
- Optionally show a compact pillar breakdown or link to profile detail.
- Describe the cohort as "analyzed developers," not the entire global developer population.

### Methodology copy

Publish:

- four weights;
- window and public-only policy;
- caps and diminishing-return functions;
- what does and does not count;
- target cohort;
- explicit statement that the score does not assess code quality or private work.

Remove claims that the score is 35/35/30 or that the fitted bell curve represents the real population.

## Acceptance criteria

Version 2 is ready to switch publicly only when:

- [ ] The golden cohort lands in approved score bands.
- [ ] All monotonicity and anti-gaming properties pass.
- [ ] Representative character assignments are unchanged.
- [ ] Private/restricted activity cannot affect the competitive score.
- [ ] Fork-only and star-only fixtures cannot inflate the score.
- [ ] Profile, leaderboard, achievements, and distribution use one shared rank implementation.
- [ ] Equal displayed scores always share rank.
- [ ] No version-1 profile appears in a version-2 ranking.
- [ ] Partial GitHub responses cannot overwrite a successful score.
- [ ] The displayed methodology exactly matches executable constants.
- [ ] The existing repository test suite remains green.

## Accepted trade-offs and exclusions

### No scheduled refresh in this scope

The product decision is to retain user-triggered analysis and the existing caching approach. This proposal does not add:

- scheduled daily refreshes;
- automatic stale-profile exclusion;
- background score decay.

Consequence: a rolling score may remain stale until the user or migration tooling refreshes it. The UI should still show the actual capture time so users can judge freshness.

### Public GitHub evidence is incomplete

The score intentionally ignores:

- private employment or coursework;
- unlinked Git identities;
- contributions GitHub does not attribute;
- code complexity and correctness;
- work outside GitHub.

This is why the score must be described as recent public engineering activity, not overall developer ability.

### Gaming cannot be eliminated

Daily caps, external-contribution rules, fork exclusion, and diminishing returns raise the cost of gaming but cannot determine human intent. The initial release should avoid subjective moderation or content inspection.

### Character traits remain non-competitive

The current persona traits may use signals that would be inappropriate in a competitive score. They remain unchanged because character preservation is an explicit product requirement. The UI must avoid presenting those traits as the basis of leaderboard rank.

## Maintainer decision record

Before implementation begins, record:

1. Approval or requested changes to the four pillar weights.
2. Approval or requested changes to provisional caps.
3. Approval of persona/ranking separation.
4. Approval of public-only GraphQL collection.
5. Approval of versioned persistence and shadow rollout.
6. Approval of the no-scheduled-refresh trade-off.

Once these are approved, implementation can proceed test-first in the phased order above.

## Migration operator runbook

After applying the database migration, run the version-2 profile migration in
dry-run mode first:

```bash
pnpm lab:migrate-v2
```

The report shows each existing profile's version-1 score, proposed version-2
score and pillars, and confirms that its character remains unchanged. It does
not write data or print access tokens. Review the golden cohort and target bands
before opting into writes:

```bash
pnpm lab:migrate-v2 -- --apply
```

Profiles without a usable GitHub token are skipped. A failed or incomplete
GitHub response is reported per profile and never overwrites its last successful
version-2 score. Version-1 fields remain available for rollback while public
ranking queries select version 2 exclusively. Legacy badge IDs whose meanings
changed are reconciled only when a profile first receives a version-2 score;
rerunning the migration cannot delete achievements earned after cutover.

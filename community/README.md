# Scenario library

The trainer workshop loads the bilingual JSON sets in `community/sets/` at build time. The initial office set is a project-authored example. Contributors can copy it, replace the cases with original fictional material and submit their set for review. Each scenario needs a unique ID, a level from 1 to 3, an allowed answer and all five bilingual text fields. The test suite checks the catalog before a release.

Reviewers check that the expected answer follows from the supplied evidence, the explanation distinguishes identity from authentication, all people and organizations are fictional, both languages describe the same case and the safe action is practical. No runtime submission service receives user content.

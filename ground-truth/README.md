# Ground truth and scoring

`findings.json` is the canonical expected-positive set.

Recommended SAST comparison metrics:

- **Recall** = matched expected findings / 26
- **Precision** = matched expected findings / all reported findings in benchmark source
- **F1** = harmonic mean of precision and recall
- **Category recall** by `class` (control-flow, replay, workflow coverage, configuration, async, etc.)
- **Interprocedural recall**: cases where verifier and business sink are not adjacent
- **False-positive rate on `/src/safe`**: safe reference code should not be reported as bypass

Do not award a match purely because a tool reports a generic issue in the same file. A finding should describe the relevant enforcement/control-flow weakness or a clearly equivalent security consequence.

For blinded vendor evaluation, provide the tool only the source tree and keep `ground-truth/` out of the scan input.

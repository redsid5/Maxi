# Contributing

## The one rule

`MAXI.md` is the product. Everything under `adapters/` is generated from it by `scripts/build-adapters.mjs`. Edit the spec, run the build, commit both. CI fails if adapters drift from the spec.

## Changing the spec

A change to `MAXI.md` should make compiled prompts *better*, which usually means shorter or sharper — not longer. Before proposing a change, compile the three requests in `examples/requests.md` with and without it and include the diff in your PR. If the change adds lines to the compiled output, explain what each new line changes about the final AI answer.

Keep the compact variant (ChatGPT GPTs) under 8 000 characters. The build script checks this.

## Adding a platform adapter

1. Add an `out(...)` call in `scripts/build-adapters.mjs` with the platform's required frontmatter or wrapper.
2. Add a row to `adapters/README.md` with install steps.
3. Run the build and commit the generated file.

## CLI

`cli/` is zero-dependency Node 18+. Keep it that way. Provider adapters live in `cli/src/providers.mjs`; adding one means a `complete()` function, a default model, and a key-detection entry. Run `npm test` — tests are offline against a fake server.

## Versioning

The spec version is in the `MAXI.md` header. Bump the minor version for behavior changes, the patch version for wording. The CLI follows semver independently.

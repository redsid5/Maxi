# Slow Python script

## Input

```
/maxi why is my python script slow
```

## Output

````
```
Act as a senior Python performance engineer.

Here is my script and how I run it:

[paste script]
[how you run it, input size, and how long it currently takes]

Diagnose why it's slow, then fix it. Process:
1. Profile before guessing — tell me the exact cProfile / line_profiler command to run, and ask me for the output if you can't tell from reading the code.
2. Identify the top 1–3 bottlenecks with the evidence for each.
3. For each, give the fix and the expected speedup, ranked by effort.
4. Rewrite the hot path. Keep behavior identical; note any change in output or edge-case handling.

Don't suggest "use numpy" or "use multiprocessing" unless you show why it applies here. If the real answer is an algorithmic change, say so first.

Return: Bottlenecks → Evidence → Fixes (ranked) → Rewritten code → How to verify the speedup.
```

Compiled in auto mode for a general chat model.

Fill in:
- [paste script], [how you run it, input size, and how long it currently takes]

Add `for claude code` if you want it to profile and fix the file directly.
````

## Input

```
/maxi why is my python script slow for claude code
```

## Output

````
```
Goal: make [path/to/script.py] fast enough to process [input description] in under [target time]; it currently takes [current time].

Steps:
1. Profile it first (cProfile or py-spy) with [how to run it]. Show me the top 10 by cumulative time before changing anything.
2. Fix the top bottlenecks in order of impact. Prefer algorithmic fixes over micro-optimizations.
3. Keep output byte-identical. Add a test that compares the new output to the old output on [sample input] if one doesn't exist.

Scope: only [path/to/script.py] and a new test file. Don't touch other modules or add dependencies without asking.

Report: before/after timings, what changed and why, and anything you'd still want to fix.
```

Compiled in auto mode for a coding agent.

Fill in:
- [path/to/script.py], [input description], [target time], [current time], [how to run it], [sample input]
````

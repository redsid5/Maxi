# Student networking app

The reference example from the spec: one request, three compilations.

## Input

```
/maxi I want to make an app for students to network
```

## Output (auto)

````
```
Act as a senior startup product strategist, UX designer, and technical architect.

I want to build a networking application specifically for college students. Turn this idea into a viable MVP.

Define:
1. The specific user problem worth solving.
2. The ideal first target user segment.
3. The core value proposition.
4. The 3–5 features required for the MVP.
5. Features that should NOT be built initially.
6. The primary user journey from signup to first moment of value.
7. A recommended monetization model.
8. The simplest technical architecture for launching quickly.
9. The biggest assumptions and risks.
10. A 30-day validation and launch plan.

Prioritize speed, adoption, retention, and product-market validation over feature complexity. Challenge weak assumptions instead of agreeing with them.

Return the answer as: Problem → User → Solution → MVP → User Flow → Business Model → Tech Stack → Risks → Validation Plan → Next Actions.
```

Compiled in auto mode for a general chat model.

Assumptions:
- "Students" means college/university students, not high school.
- You want a plan before any code.

Say `/maxi quick` for a 5-line version, or add `for claude code` to get a build-ready spec.
````

## `/maxi quick`

````
```
Act as a startup product strategist. I'm building a networking app for college students.
Give me: the sharpest user problem, the first target segment, 3–5 MVP features, 3 features to explicitly skip, and a 30-day validation plan.
Challenge the idea where it's weak. Be concrete, no generic advice.
```

Compiled in quick mode for a general chat model.
````

## `/maxi ... for claude code`

````
```
Goal: scaffold an MVP for a college-student networking app.

Current state: empty repo. Stack: [Next.js + Postgres, or say your preference].

Acceptance criteria:
- Email signup with .edu domain verification
- Profile: name, school, major, graduation year, 3 interest tags
- Browse/search students at the same school by interest tag
- Send and accept a connection request
- All routes covered by at least one integration test

Out of scope for this pass: messaging, notifications, mobile app, payments.

Conventions: TypeScript strict, Prettier defaults, conventional commits.

When done: list files created, how to run locally, and the three riskiest shortcuts you took.
```

Compiled in auto mode for a coding agent.

Fill in:
- [Next.js + Postgres, or say your preference]
````

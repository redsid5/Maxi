# Email to landlord

## Input

```
/maxi quick help me write an email to my landlord about the broken heater
```

## Output

````
```
Write a short, firm, polite email to my landlord: the heater in my unit has been broken since [date], I reported it on [date] by [text/call/email], and it still isn't fixed.
Ask for a repair date within 48 hours and note that I'm keeping a written record. Do not threaten legal action. Under 120 words, plain language, no subject-line options — just one subject line and the email.
```

Compiled in quick mode for a general chat model.

Fill in:
- [date] ×2, [text/call/email]
````

## Input

```
/maxi help me write an email to my landlord about the broken heater
```

## Output

````
```
Act as a tenant-rights-savvy writing assistant.

Draft an email to my landlord about a broken heater. Facts:
- Unit: [address/unit]
- Heater stopped working: [date]
- I first reported it: [date], via [text/call/email]
- Current indoor temperature: [temp, if known]
- Location: [city/state] — mention the local habitability rule only if you are confident it exists; otherwise leave it out.

Goal: get a repair scheduled fast while keeping the relationship civil and creating a paper trail.

Requirements:
- Under 150 words. Plain language. No legal threats.
- State the problem, the reporting history, and a clear ask: a repair date within 48 hours.
- Close by asking them to confirm in writing.

Return: one subject line, then the email body. After it, one line telling me the single most useful thing to add if they don't respond in 48 hours.
```

Compiled in auto mode for a general chat model.

Assumptions:
- You rent in the US and want to escalate later if needed, not now.

Fill in:
- [address/unit], [date] ×2, [text/call/email], [temp, if known], [city/state]
````

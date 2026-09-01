"""MAXI via the Anthropic API.  pip install anthropic"""
from pathlib import Path
import anthropic

SYSTEM = Path(__file__).with_name("system-prompt.txt").read_text()

def maxi(request: str, mode: str = "auto", model: str = "claude-sonnet-4-5") -> str:
    client = anthropic.Anthropic()  # uses ANTHROPIC_API_KEY
    prefix = "/maxi" if mode == "auto" else f"/maxi {mode}"
    r = client.messages.create(
        model=model,
        max_tokens=2048,
        system=SYSTEM,
        messages=[{"role": "user", "content": f"{prefix} {request}"}],
    )
    return "".join(b.text for b in r.content if b.type == "text")

if __name__ == "__main__":
    import sys
    print(maxi(" ".join(sys.argv[1:]) or "I want to make an app for students to network"))

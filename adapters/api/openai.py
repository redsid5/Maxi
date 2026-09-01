"""MAXI via the OpenAI API.  pip install openai"""
from pathlib import Path
from openai import OpenAI

SYSTEM = Path(__file__).with_name("system-prompt.txt").read_text()

def maxi(request: str, mode: str = "auto", model: str = "gpt-4o") -> str:
    client = OpenAI()  # uses OPENAI_API_KEY
    prefix = "/maxi" if mode == "auto" else f"/maxi {mode}"
    r = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": f"{prefix} {request}"},
        ],
    )
    return r.choices[0].message.content

if __name__ == "__main__":
    import sys
    print(maxi(" ".join(sys.argv[1:]) or "I want to make an app for students to network"))

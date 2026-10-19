from pathlib import Path

from flask import Flask, render_template


app = Flask(__name__)


BASE_DIR = Path(__file__).resolve().parent
SAMPLE_MARKDOWN_PATH = BASE_DIR / "content" / "sample.md"


@app.route("/")
def home():

    document_markdown = SAMPLE_MARKDOWN_PATH.read_text(
        encoding="utf-8"
    )

    return render_template(
        "index.html",
        document_markdown=document_markdown
    )


if __name__ == "__main__":
    app.run(debug=True)
"""Generate assets/resume.pdf for the portfolio site.

Run:  python build_resume.py
Deps: reportlab  (pip install reportlab)

Keep this file as the single source of truth for the resume — edit the
content below and re-run, rather than editing the PDF.
"""

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    ListFlowable,
    ListItem,
    PageTemplate,
    Paragraph,
    Spacer,
)

OUTPUT = "assets/resume.pdf"

INK = HexColor("#14161d")
BODY = HexColor("#33384a")
MUTED = HexColor("#6b7280")
RULE = HexColor("#d7dae2")
ACCENT = HexColor("#b8860b")

styles = {
    "name": ParagraphStyle(
        "name", fontName="Helvetica-Bold", fontSize=21, leading=24,
        textColor=INK, spaceAfter=3,
    ),
    "tagline": ParagraphStyle(
        "tagline", fontName="Helvetica", fontSize=9.6, leading=13,
        textColor=ACCENT, spaceAfter=4,
    ),
    "contact": ParagraphStyle(
        "contact", fontName="Helvetica", fontSize=8.6, leading=12,
        textColor=MUTED, spaceAfter=2,
    ),
    "section": ParagraphStyle(
        "section", fontName="Helvetica-Bold", fontSize=9.2, leading=11,
        textColor=INK, spaceBefore=8, spaceAfter=3,
    ),
    "body": ParagraphStyle(
        "body", fontName="Helvetica", fontSize=8.9, leading=11.9,
        textColor=BODY, alignment=TA_JUSTIFY, spaceAfter=3,
    ),
    "entry": ParagraphStyle(
        "entry", fontName="Helvetica-Bold", fontSize=9.5, leading=12,
        textColor=INK, spaceAfter=1,
    ),
    "entrysub": ParagraphStyle(
        "entrysub", fontName="Helvetica-Oblique", fontSize=8.5, leading=10.8,
        textColor=MUTED, spaceAfter=3,
    ),
    "bullet": ParagraphStyle(
        "bullet", fontName="Helvetica", fontSize=8.7, leading=11.5,
        textColor=BODY,
    ),
}


class Rule(Flowable):
    """A thin horizontal rule used under each section heading."""

    def __init__(self, width=None, thickness=0.7, color=RULE):
        super().__init__()
        self.width = width
        self.thickness = thickness
        self.color = color
        self.height = thickness

    def wrap(self, availWidth, availHeight):
        self.width = self.width or availWidth
        return self.width, self.height

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, 0, self.width, 0)


def section(title):
    return [Paragraph(title.upper(), styles["section"]), Rule(), Spacer(1, 4)]


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(text, styles["bullet"]), leftIndent=10) for text in items],
        bulletType="bullet",
        start="•",
        bulletColor=ACCENT,
        bulletFontSize=7,
        leftIndent=11,
        spaceBefore=1,
        spaceAfter=1,
    )


def build():
    doc = BaseDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=17 * mm,
        rightMargin=17 * mm,
        topMargin=13 * mm,
        bottomMargin=12 * mm,
        title="Akshay S Krishnan - Resume",
        author="Akshay S Krishnan",
        subject="Resume",
    )
    frame = Frame(
        doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="body",
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame])])

    story = []

    # ---- header -------------------------------------------------------
    story.append(Paragraph("Akshay S Krishnan", styles["name"]))
    story.append(Paragraph(
        "B.Tech Computer Science &amp; Engineering (AI &amp; ML) &nbsp;|&nbsp; Python &middot; "
        "Machine Learning &middot; Data Structures",
        styles["tagline"],
    ))
    story.append(Paragraph(
        "Chennai, Tamil Nadu, India &nbsp;&bull;&nbsp; "
        '<a href="mailto:akshaysk2007@gmail.com" color="#33384a">akshaysk2007@gmail.com</a>',
        styles["contact"],
    ))
    story.append(Paragraph(
        '<a href="https://github.com/akshaysk7" color="#33384a">github.com/akshaysk7</a>'
        " &nbsp;&bull;&nbsp; "
        '<a href="https://www.linkedin.com/in/akshay-s-krishnan-1968092a7/" color="#33384a">'
        "linkedin.com/in/akshay-s-krishnan-1968092a7</a>"
        " &nbsp;&bull;&nbsp; "
        '<a href="https://akshaysk7.github.io/portfolio-website/" color="#33384a">'
        "akshaysk7.github.io/portfolio-website</a>",
        styles["contact"],
    ))
    story.append(Spacer(1, 8))
    story.append(Rule(thickness=1.1, color=INK))

    # ---- summary ------------------------------------------------------
    story += section("Summary")
    story.append(Paragraph(
        "Second-year B.Tech Computer Science student specialising in Artificial Intelligence and "
        "Machine Learning. Currently focused on building genuine depth in <b>Python</b> — applying it "
        "daily across data structures practice, data work with pandas, and machine learning projects "
        "taken from raw data through to honest evaluation. I learn by building things I have to "
        "finish, and I care about being rigorous with results rather than optimising for a "
        "flattering number.",
        styles["body"],
    ))

    # ---- education ----------------------------------------------------
    story += section("Education")
    story.append(Paragraph(
        "SRM Institute of Science and Technology, Ramapuram &mdash; Chennai", styles["entry"]))
    story.append(Paragraph(
        "B.Tech, Computer Science &amp; Engineering "
        "(Specialisation: Artificial Intelligence &amp; Machine Learning) &middot; Second year",
        styles["entrysub"],
    ))
    story.append(Paragraph(
        "<b>Relevant coursework:</b> Operating Systems &middot; Computer Organisation &amp; "
        "Architecture &middot; Data Structures &amp; Algorithms",
        styles["body"],
    ))

    # ---- skills -------------------------------------------------------
    story += section("Technical Skills")
    story.append(bullets([
        "<b>Primary language:</b> Python &mdash; fundamentals, data handling, problem solving "
        "(current area of focus)",
        "<b>Data &amp; ML:</b> pandas, scikit-learn, data cleaning, feature engineering, "
        "model evaluation",
        "<b>Computer science:</b> Data Structures &amp; Algorithms (daily practice in Python)",
        "<b>Web:</b> HTML, CSS, JavaScript &mdash; actively learning by building this portfolio "
        "&middot; Django (in progress)",
        "<b>AI systems:</b> Retrieval-augmented generation, embeddings, vector databases, LLM APIs",
        "<b>Tools:</b> Git, GitHub, VS Code",
    ]))

    # ---- projects -----------------------------------------------------
    story += section("Projects")

    story.append(Paragraph(
        "Premier League Match Predictor &mdash; <font color='#6b7280'>in progress</font>",
        styles["entry"]))
    story.append(Paragraph("Python, pandas, scikit-learn", styles["entrysub"]))
    story.append(bullets([
        "Building a supervised classification model that predicts match outcomes "
        "(home win / draw / away win) from historical Premier League data.",
        "Deliberately excluded bookmaker odds from the feature set: using them would mean "
        "reproducing an existing prediction rather than building an independent one.",
        "Working through feature engineering with the aim of extracting real signal from a "
        "high-variance domain, where even bookmakers reach only around 55% accuracy.",
        'Repository: <a href="https://github.com/akshaysk7/football-predictor" color="#33384a">'
        "github.com/akshaysk7/football-predictor</a>",
    ]))
    story.append(Spacer(1, 4))

    story.append(Paragraph(
        "College Document Q&amp;A System (RAG) &mdash; "
        "<font color='#6b7280'>team project, in progress</font>",
        styles["entry"]))
    story.append(Paragraph("Python, vector database, embeddings, LLM API", styles["entrysub"]))
    story.append(bullets([
        "Retrieval-augmented generation system that answers questions about college rules and "
        "circulars, citing the source document for every answer.",
        "Designed to refuse questions the source documents do not cover, so the system fails "
        "visibly instead of producing confident but unsupported answers.",
        "Logs unanswered queries into a documentation-gap report, turning system limitations into "
        "actionable feedback for the administration.",
    ]))
    story.append(Spacer(1, 4))

    story.append(Paragraph("Telegram Content Scheduler Bot", styles["entry"]))
    story.append(Paragraph("Automation, bot API, scheduling", styles["entrysub"]))
    story.append(bullets([
        "Telegram bot that schedules LinkedIn posts twice a week to maintain a consistent posting "
        "cadence without manual effort.",
    ]))
    story.append(Spacer(1, 4))

    story.append(Paragraph(
        "Personal Portfolio Website &mdash; "
        "<font color='#6b7280'>ongoing frontend learning project</font>",
        styles["entry"]))
    story.append(Paragraph("HTML, CSS, JavaScript", styles["entrysub"]))
    story.append(bullets([
        "Vibe-coded with AI assistance rather than written from scratch, and used deliberately as "
        "an active frontend learning project: each iteration means reading the HTML, CSS and "
        "JavaScript, changing it, and understanding why it behaves as it does.",
        'Live: <a href="https://akshaysk7.github.io/portfolio-website/" color="#33384a">'
        "akshaysk7.github.io/portfolio-website</a>",
    ]))

    # ---- certifications -----------------------------------------------
    story += section("Certifications")
    story.append(bullets([
        "<b>IBM SkillsBuild</b> &mdash; Basics of Machine Learning",
    ]))

    doc.build(story)
    print("wrote", OUTPUT)


if __name__ == "__main__":
    build()

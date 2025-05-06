import os
from flask import Flask, request, jsonify, render_template
import spacy
import fitz  # PyMuPDF for reading PDFs

app = Flask(__name__)

# Load spacy English model
nlp = spacy.load("en_core_web_sm")

# Helper function to extract text from PDF
def extract_text_from_pdf(pdf_file):
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text("text")
    return text

# Heuristic/NLP-based section classification
def classify_sections(text):
    sections = {
        'Summary': "",
        'Skills': "",
        'Experience': "",
        'Projects': "",
        'Education': "",
        'Certifications': ""
    }

    current_section = 'Summary'

    for line in text.split('\n'):
        line_lower = line.lower().strip()

        if "experience" in line_lower or "work history" in line_lower:
            current_section = 'Experience'
        elif "education" in line_lower or "university" in line_lower or "degree" in line_lower:
            current_section = 'Education'
        elif "skills" in line_lower or "proficient" in line_lower:
            current_section = 'Skills'
        elif "project" in line_lower:
            current_section = 'Projects'
        elif "certification" in line_lower or "award" in line_lower:
            current_section = 'Certifications'

        sections[current_section] += line + '\n'

    return sections

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process-resume', methods=['POST'])
def process_resume():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF uploaded"}), 400

    pdf_file = request.files['pdf']
    extracted_text = extract_text_from_pdf(pdf_file)
    sections = classify_sections(extracted_text)

    return jsonify(sections)

if __name__ == '__main__':
    app.run(debug=True)
import docx

def read_docx_content():
    try:
        doc = docx.Document('Project_Documentation.docx')
        content = []
        
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                content.append(paragraph.text)
        
        print("DOCX Content:")
        print("=" * 50)
        for i, text in enumerate(content, 1):
            print(f"{i}. {text}")
            print("-" * 30)
            
    except Exception as e:
        print(f"Error reading DOCX: {e}")

if __name__ == "__main__":
    read_docx_content() 
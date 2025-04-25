
import html2text
import requests
from bs4 import BeautifulSoup

def return_awaited_md(url):
    res = requests.get("https://r.jina.ai/"+url)
    soup = BeautifulSoup(res.content, "html.parser")
    return soup.prettify()

def prompt_generator(scrapped_content, prompt):
    return (
    f"""
        Website Scapped Content:
        {scrapped_content}

        based on the sceapped content answer the follwing question and provide answers following these guidlines:
            "1. **Extract Information:** Only extract the information that directly matches the provided scarpped content. "
            "2. **No Extra Content:** Do not include any additional text, comments, or explanations in your response. "
            "3. **Empty Response:** If no information matches the description, return an empty string ('')."
            "4. **Direct Data Only:** Your output should contain only the data that is explicitly requested, with no other text."
            "5. **Markdown Format:** Format your response in well-structured markdown without using code blocks."
            "6. **Rendering:** Ensure tables and lists are properly formatted for rendering in markdown."
            "7. **Summary**: Provide a summary of the extracted information in the response at the end with the title of summary"

        question: {prompt}

    """)

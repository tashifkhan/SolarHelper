import os
import html2text
import requests
from google import genai
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

def return_md(url):
    res = requests.get(url)
    soup = BeautifulSoup(res.content, 'html.parser')
    markdowntext = html2text.html2text(soup.body.prettify())
    return markdowntext

def return_awaited_md(url):
    res = requests.get("https://r.jina.ai/"+url)
    soup = BeautifulSoup(res.content, "html.parser")
    return soup.prettify()

def write_file(filename, markdowntext):
    with open(filename, "w+") as ft:
        ft.write(markdowntext)
        ft.close()

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

def split_dom_content(dom_content, max_length=6000):
    return [
        dom_content[i : i + max_length] for i in range(0, len(dom_content), max_length)
    ]

def llm_prompt_response(prompt):
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.5-pro-exp-03-25", contents=prompt
    )
    return response.text

def main():
    with open("subsidy_info.md", "r") as ft:
        subsidy_context = ft.read()
        # print(subsidy_context)
        ft.close()
    print(subsidy_context)
    prompt = prompt_generator(subsidy_context, "what will it cost me to get a rooftop installation in mumbai?")
    print(prompt)
    response = llm_prompt_response(prompt)
    print(response)

def local_modals(dom_chunks, parse_description):
    from langchain_ollama import OllamaLLM
    from langchain_core.prompts import ChatPromptTemplate

    model =  OllamaLLM(model="mistral")

    templet = (
        "You are tasked with extracting specific information from the following text content: {dom_content}. "
        "Please follow these instructions carefully: \n\n"
        "1. **Extract Information:** Only extract the information that directly matches the provided scarpped content. "
        "2. **No Extra Content:** Do not include any additional text, comments, or explanations in your response. "
        "3. **Empty Response:** If no information matches the description, return an empty string ('')."
        "4. **Direct Data Only:** Your output should contain only the data that is explicitly requested, with no other text."
        "5. **Markdown Format:** The Ouput must be a well formated markdown file"
    )

    prompt = ChatPromptTemplate.from_template(templet)
    chain = prompt | model
    parsed_results = []

    for i, chunk in enumerate(dom_chunks, start=1):
        response = chain.invoke(
            {"dom_content": chunk, "parse_description": parse_description}
        )
        print(f"Parsed batch: {i} of {len(dom_chunks)}")
        parsed_results.append(response)

    return "\n".join(parsed_results)

if __name__ == "__main__":
    main()
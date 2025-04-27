import html2text
import requests
from bs4 import BeautifulSoup
from typing import List

from services.llm_service import llm_prompt_response

def return_awaited_md(url):
    res = requests.get("https://r.jina.ai/"+url)
    soup = BeautifulSoup(res.content, "html.parser")
    return soup.prettify()

def extract_and_combine_from_urls(urls: List[str], user_prompt: str) -> str:
    """
    Scrapes each URL, extracts relevant information using the LLM based on the user_prompt,
    and combines the extracted information, noting the source URL.
    """
    combined_extractions = ""
    for url in urls:
        extraction_result = f"\n\n--- Source: {url} ---\n\n"
        try:
            # 1. Scrape content
            content = return_awaited_md(url)
            if not content.strip():
                extraction_result += "Failed to retrieve content."
            else:
                # 2. Generate prompt for this specific URL
                extraction_prompt = prompt_generator(content, user_prompt)
                # 3. Call LLM for extraction
                extracted_info = llm_prompt_response(extraction_prompt)
                if not extracted_info.strip():
                     extraction_result += "No relevant information found based on the prompt."
                else:
                     extraction_result += extracted_info

        except Exception as e:
            extraction_result += f"Error processing URL: {e}"
            print(f"Error processing {url}: {e}") # Optional: log to console/logger

        combined_extractions += extraction_result

    return combined_extractions

def prompt_generator(scrapped_content, prompt):
    return (
    f"""
        Website Scapped Content:
        ```markdown
        {scrapped_content}
        ```

        Based *only* on the Website Scrapped Content provided above, answer the following question. Follow these guidelines strictly:
            "1. **Extract Information:** Only extract the information that directly answers the question based *solely* on the provided scrapped content. "
            "2. **No Extra Content:** Do not include any additional text, comments, explanations, introductions, or summaries in your response unless the question specifically asks for it. "
            "3. **Empty Response:** If no information in the scrapped content directly answers the question, return an empty string (''). Do not state that you couldn't find information."
            "4. **Direct Data Only:** Your output should contain only the data explicitly requested by the question, formatted as requested. "
            "5. **Markdown Format:** Format your response in well-structured markdown. Do not use code blocks unless the question asks for code. "
            "6. **Rendering:** Ensure tables and lists are properly formatted for rendering in markdown."

        Question: {prompt}

    """)

def final_analysis_prompt_generator(combined_extractions: str) -> str:
    """
    Generates a prompt for the LLM to structure the combined extractions and list sources.
    """
    return (
    f"""
        Combined Information from Multiple Sources:
        {combined_extractions}

        Based on the combined information provided above, which includes data extracted from various web pages identified by '--- Source: <URL> ---' markers, please perform the following tasks:

        1.  **Synthesize and Structure:** Create a single, coherent, and well-structured response that synthesizes the information extracted from all sources. Organize the information logically, potentially using headings, lists, or tables as appropriate for clarity. Avoid redundancy where possible, but ensure all key extracted points are included.
        2.  **List Sources:** At the very end of your response, add a section titled "Sources Used" and list all the unique source URLs mentioned in the input (the URLs following '--- Source:'). List each URL on a new line.
        3.  **Formatting:** Use standard markdown formatting. Do not use code blocks for the main response or the source list.
        4.  **Focus:** Base your response *only* on the information provided in the "Combined Information from Multiple Sources" section. Do not add external knowledge or commentary.

        Generate the structured analysis and the source list.
    """)

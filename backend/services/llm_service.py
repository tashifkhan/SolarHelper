import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

def llm_prompt_response(prompt):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-001", 
        google_api_key=api_key
    ) 
    response = llm.invoke(prompt)
    return response.content

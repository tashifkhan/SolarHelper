import os
import time
from typing import List
from fastapi import HTTPException
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from models.requests import SubsidyQuery
from models.responses import ChatResponse, ChatHistoryItem
from services.llm_service import llm_prompt_response

# --- RAG Setup ---
CONTEXT_DIR = os.path.join(os.path.dirname(__file__), '..', 'context')
VECTORSTORE_PATH = os.path.join(os.path.dirname(__file__), '..', 'vectorstore_faiss')

def setup_rag_retriever(force_recreate=False):
    """Loads documents, creates embeddings, stores them in FAISS, and returns a retriever."""
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    if os.path.exists(VECTORSTORE_PATH) and not force_recreate:
        print("Loading existing vector store...")
        vectorstore = FAISS.load_local(VECTORSTORE_PATH, embeddings, allow_dangerous_deserialization=True)
    else:
        print("Creating new vector store...")
        loader = DirectoryLoader(CONTEXT_DIR, glob="**/*.md", loader_cls=TextLoader)
        documents = loader.load()
        if not documents:
            print("Warning: No documents found in context directory.")

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
        docs = text_splitter.split_documents(documents)

        vectorstore = FAISS.from_documents(docs, embeddings)
        vectorstore.save_local(VECTORSTORE_PATH)
        print(f"Vector store created and saved at {VECTORSTORE_PATH}")

    return vectorstore.as_retriever(search_kwargs={"k": 3})

try:
    retriever = setup_rag_retriever()
except Exception as e:
    print(f"Error setting up RAG retriever: {e}")
    retriever = None

# --- End RAG Setup ---

def process_chat_enquiry(request: SubsidyQuery) -> ChatResponse:
    start_time = time.time()
    if retriever is None:
        raise HTTPException(status_code=500, detail="Chat service RAG retriever not initialized.")

    try:
        conversation_history = "Previous conversation:\n"
        history_for_retrieval = ""
        if request.response:
            for exchange in request.response:
                if exchange.prompt:
                    conversation_history += f"User: {exchange.prompt}\n"
                    history_for_retrieval += f"User: {exchange.prompt}\n"
                if exchange.answer:
                    conversation_history += f"Agent: {exchange.answer}\n"
                    history_for_retrieval += f"Agent: {exchange.answer}\n"

        retrieval_query = f"{history_for_retrieval}User: {request.prompt}"
        retrieved_docs = retriever.invoke(retrieval_query)
        retrieved_context = "\n\n".join([doc.page_content for doc in retrieved_docs])

        system_prompt = f"""
You are a helpful assistant specializing in solar energy in India.
Use the following retrieved context and the conversation history to answer the user's question.
If the context doesn't contain the answer, say you don't have that information based on the provided documents.

Retrieved Context:
{retrieved_context}

Conversation History:
{conversation_history}

User: {request.prompt}
Agent:"""

        ai_answer = llm_prompt_response(system_prompt)
        execution_time = time.time() - start_time

        updated_history = request.response + [ChatHistoryItem(prompt=request.prompt, answer=ai_answer)]

        return ChatResponse(answer=ai_answer, prev_responses=updated_history, execution_time=execution_time)

    except Exception as e:
        print(f"Error processing chat enquiry: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing chat enquiry: {str(e)}")


import os
import html2text
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()


def return_md(url):
    res = requests.get(url)
    soup = BeautifulSoup(
        res.content,
        "html.parser",
    )
    markdowntext = html2text.html2text(soup.body.prettify())
    return markdowntext


def write_file(filename, markdowntext):
    with open(filename, "w+") as ft:
        ft.write(markdowntext)
        ft.close()


def split_dom_content(dom_content, max_length=6000):
    return [
        dom_content[i : i + max_length]
        for i in range(
            0,
            len(dom_content),
            max_length,
        )
    ]

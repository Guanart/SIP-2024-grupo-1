from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def get():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(options=chrome_options)
    driver.get("http://34.139.226.34:5173/")
    # driver = webdriver.Chrome()
    # driver.get("http://localhost:5173/")

    return driver

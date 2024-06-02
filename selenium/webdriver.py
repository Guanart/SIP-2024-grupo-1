from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def get():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument(
        "--unsafely-treat-insecure-origin-as-secure=http://myurl.com/")
    driver = webdriver.Chrome(options=chrome_options)
    driver.get("http://34.23.248.112:5173/")

    # driver = webdriver.Chrome()
    # driver.get("http://localhost:5173/")

    return driver

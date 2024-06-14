import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def get_min_sleep():
    min_sleep = os.getenv('MIN_SLEEP', 3)
    return min_sleep


def get_max_sleep():
    max_sleep = os.getenv('MAX_SLEEP', 15)
    return max_sleep


def get():
    # Obtener el host del frontend desde la variable de entorno
    host = os.getenv('HOST', 'http://localhost:5173')

    chrome_options = Options()
    chrome_options.add_argument('--headless=new')

    if ("http" in host):
        chrome_options.add_argument(
            f"--unsafely-treat-insecure-origin-as-secure={host}")

    driver = webdriver.Chrome(options=chrome_options)
    driver.get(host)

    time.sleep(60)

    return driver


if __name__ == "__main__":
    driver = get()

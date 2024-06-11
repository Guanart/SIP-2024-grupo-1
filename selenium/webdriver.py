import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def get():
    # Obtener la IP del frontend desde la variable de entorno
    frontend_ip = os.getenv('FRONTEND_IP', 'localhost')

    # Construir la URL base
    base_url = f"http://{frontend_ip}:5173"

    chrome_options = Options()
    chrome_options.add_argument('--headless=new')
    chrome_options.add_argument(
        f"--unsafely-treat-insecure-origin-as-secure={base_url}")

    driver = webdriver.Chrome(options=chrome_options)
    driver.get(base_url)

    time.sleep(10)

    return driver


if __name__ == "__main__":
    driver = get()

from selenium import webdriver

def get () :
    driver = webdriver.Chrome()
    driver.get("http://localhost:5173/")
    return driver
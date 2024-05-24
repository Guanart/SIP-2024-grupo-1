from selenium import webdriver

def get () :
    driver = webdriver.Chrome()
    driver.get("http://34.86.184.119:5173/")
    return driver
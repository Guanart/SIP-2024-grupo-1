import time
import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains


driver = webdriver.get()

login_button = driver.find_element(By.XPATH, '//*[@id="root"]/header/div/div/button[1]').click()

email_input = driver.find_element(By.XPATH, '//*[@id="username"]')
email_input.send_keys("user@example.com")

password_input = driver.find_element(By.XPATH, '//*[@id="password"]')
password_input.send_keys("Admin123")

submit_button = driver.find_element(By.XPATH, '/html/body/div/main/section/div/div[2]/div/form/div[2]/button').click()

time.sleep(2) 

logout_button = driver.find_element(By.XPATH, '//*[@id="root"]/header/div/div/button')
assert logout_button.is_displayed()

# Cerrar el navegador
driver.quit()


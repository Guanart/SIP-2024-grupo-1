import time

import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

print("Running login.py selenium test...")

driver = webdriver.get()
max_sleep = webdriver.get_max_sleep()
min_sleep = webdriver.get_min_sleep()

login_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/header/div/div/button[1]').click()

email_input = driver.find_element(By.XPATH, '//*[@id="username"]')
email_input.send_keys("ricardomilos@lot.com")

password_input = driver.find_element(By.XPATH, '//*[@id="password"]')
password_input.send_keys("Admin123")

time.sleep(min_sleep)

submit_button = driver.find_element(
    By.XPATH, '/html/body/div/main/section/div/div[2]/div/form/div[2]/button').click()

time.sleep(min_sleep)

logout_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/header/div/div/button')
assert logout_button.is_displayed()

print("login.py done.")
time.sleep(max_sleep)

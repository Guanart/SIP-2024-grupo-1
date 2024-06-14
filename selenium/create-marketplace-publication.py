import time

import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

print("Running create-marketplace-publication.py selenium test...")

max_sleep = webdriver.get_max_sleep()
min_sleep = webdriver.get_min_sleep()

driver = webdriver.get()

# Inicio sesión con un usuario de prueba
login_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/header/div/div/button[1]').click()


email_input = driver.find_element(By.XPATH, '//*[@id="username"]')
email_input.send_keys("ricardomilos@lot.com")

password_input = driver.find_element(By.XPATH, '//*[@id="password"]')
password_input.send_keys("Admin123")

time.sleep(min_sleep)

submit_button = driver.find_element(
    By.XPATH, '/html/body/div/main/section/div/div[2]/div/form/div[2]/button').click()

# Abro el menú de navegación
open_menu_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/header/div/button').click()

# Esto es para asegurarme que el menú carga correctamente
time.sleep(min_sleep)


wallet_page_link = driver.find_element(
    By.XPATH, '/html/body/div[2]/div[3]/div/ul/a[4]')
ActionChains(driver).move_to_element(wallet_page_link).perform()

wallet_page_link.click()

time.sleep(min_sleep)

create_publication_page_link = driver.find_element(
    By.XPATH, '//*[@id="root"]/main/div[1]/ul/li[2]/div[3]/a[2]')
ActionChains(driver).move_to_element(create_publication_page_link).perform()
create_publication_page_link.click()

time.sleep(max_sleep)

email_input = driver.find_element(By.XPATH, '//*[@id="publication-price"]')
email_input.send_keys("100")

time.sleep(min_sleep)


create_publication_button = driver.find_element(
    By.XPATH, '//*[@id = "root"]/main/div/div/form/button')

create_publication_button.click()

print("create-marketplace-publication done.")
time.sleep(max_sleep)

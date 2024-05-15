import time

import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

driver = webdriver.get()

# Inicio sesión con un usuario de prueba
login_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/header/div/div/button[1]').click()


email_input = driver.find_element(By.XPATH, '//*[@id="username"]')
email_input.send_keys("ricardomilos@lot.com")

password_input = driver.find_element(By.XPATH, '//*[@id="password"]')
password_input.send_keys("Admin123")

submit_button = driver.find_element(
    By.XPATH, '/html/body/div/main/section/div/div[2]/div/form/div[2]/button').click()

# Abro el menú de navegación
open_menu_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/header/div/button').click()
time.sleep(2)  # Esto es para asegurarme que el menú carga correctamente

# Navego a la página de perfil del usuario
marketplace_page_link = driver.find_element(
    By.XPATH, '/html/body/div[2]/div[3]/div/ul/a[5]')
ActionChains(driver).move_to_element(marketplace_page_link).perform()

marketplace_page_link.click()

time.sleep(3)

publication_view_details_link = driver.find_element(
    By.XPATH, '//*[@id="root"]/main/div/div[2]/div[1]/div[4]/a/button').click()


time.sleep(5)

delete_publication_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/main/div/div[1]/button').click()


print("Done")
time.sleep(10)

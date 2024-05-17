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

time.sleep(2)

submit_button = driver.find_element(
    By.XPATH, '/html/body/div/main/section/div/div[2]/div/form/div[2]/button').click()

# Abro el menú de navegación
open_menu_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/header/div/button').click()
time.sleep(2)  # Esto es para asegurarme que el menú carga correctamente

# Navego a la página de perfil del usuario
fundraisings_page_link = driver.find_element(
    By.XPATH, '/html/body/div[2]/div[3]/div/ul/a[6]')
ActionChains(driver).move_to_element(fundraisings_page_link).perform()
fundraisings_page_link.click()

print("Done")
time.sleep(10)

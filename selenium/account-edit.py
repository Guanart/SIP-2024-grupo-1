import time


import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

print("Running account-edit.py selenium test...")

driver = webdriver.get()
max_sleep = webdriver.get_max_sleep()
min_sleep = webdriver.get_min_sleep()

# Inicio sesión con un usuario de prueba
login_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/header/div/div/button[1]').click()


email_input = driver.find_element(By.XPATH, '//*[@id="username"]')
email_input.send_keys("johndoe@lot.com")

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

# Navego a la página de perfil del usuario
account_page_link = driver.find_element(
    By.XPATH, '/html/body/div[2]/div[3]/div/ul/a[3]')
ActionChains(driver).move_to_element(account_page_link).perform()
account_page_link.click()

time.sleep(min_sleep)

# Actualizo el username
edit_profile_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/main/div[1]/div/div/div/div/div[3]/button[1]').click()

username_input = driver.find_element(By.XPATH, '//*[@id="username"]')
biography_input = driver.find_element(By.XPATH, '//*[@id="biography"]')

# Seleccionar todo el texto en el campo de entrada y borrarlo
username_input.send_keys(Keys.CONTROL + "a")
username_input.send_keys(Keys.DELETE)
biography_input.send_keys(Keys.CONTROL + "a")
biography_input.send_keys(Keys.DELETE)

username_input.send_keys("Mariano")
biography_input.send_keys(
    "Profesor de Seminario de Integración Profesional en la UNLu")

time.sleep(min_sleep)

save_changes_button = driver.find_element(
    By.XPATH, '/html/body/div[2]/div[3]/form/div[5]/button[1]').click()

# Esto es para asegurarme que los cambios carguen correctamente
time.sleep(min_sleep)

username_element = driver.find_element(
    By.XPATH, '//*[@id="root"]/main/div[1]/div/div/div/div/div[2]/h3')

print("account-edit.py done.")
time.sleep(max_sleep)

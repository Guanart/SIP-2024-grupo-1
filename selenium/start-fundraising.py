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
email_input.send_keys("johndoe@lot.com")

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

time.sleep(5)  # Esto es para asegurarme que la página

create_fundraising_page_link = driver.find_element(
    By.XPATH, '//*[@id="root"]/main/div/div[1]/a')
ActionChains(driver).move_to_element(create_fundraising_page_link).perform()
create_fundraising_page_link.click()

time.sleep(5)  # Esto es para asegurarme que la página

events_select = driver.find_element(
    By.XPATH, '//*[@id="event-select"]').click()
event_option = driver.find_element(By.XPATH, '//*[@id="1"]').click()

time.sleep(1)

goal_amount_input = driver.find_element(By.XPATH, '//*[@id="goal-amount"]')
goal_amount_input.send_keys("100000")

time.sleep(1)

prize_percentage_input = driver.find_element(
    By.XPATH, '//*[@id="prize-percentage"]')
prize_percentage_input.send_keys("45")

time.sleep(1)

initial_price_input = driver.find_element(By.XPATH, '//*[@id="initial-price"]')
initial_price_input.send_keys("25")

time.sleep(2)

start_fundraising_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/main/div/form/button').click()

print("Done")
time.sleep(10)

import time

import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

print("Running start-fundraising.py selenium test...")
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
fundraisings_page_link = driver.find_element(
    By.XPATH, '/html/body/div[2]/div[3]/div/ul/a[6]')
ActionChains(driver).move_to_element(fundraisings_page_link).perform()
fundraisings_page_link.click()

time.sleep(max_sleep)  # Esto es para asegurarme que la página

create_fundraising_page_link = driver.find_element(
    By.XPATH, '//*[@id="root"]/main/div/div[1]/a')
ActionChains(driver).move_to_element(create_fundraising_page_link).perform()
create_fundraising_page_link.click()

time.sleep(max_sleep)  # Esto es para asegurarme que la página

events_select = driver.find_element(
    By.XPATH, '//*[@id="event-select"]').click()
event_option = driver.find_element(By.XPATH, '//*[@id="1"]').click()

time.sleep(min_sleep)

goal_amount_input = driver.find_element(By.XPATH, '//*[@id="goal-amount"]')
goal_amount_input.send_keys("100000")

time.sleep(min_sleep)

prize_percentage_input = driver.find_element(
    By.XPATH, '//*[@id="prize-percentage"]')
prize_percentage_input.send_keys("45")

time.sleep(min_sleep)

initial_price_input = driver.find_element(By.XPATH, '//*[@id="initial-price"]')
initial_price_input.send_keys("25")

time.sleep(min_sleep)

start_fundraising_button = driver.find_element(
    By.XPATH, '//*[@id="root"]/main/div/form/button').click()

print("start-fundraising.py done.")
time.sleep(max_sleep)

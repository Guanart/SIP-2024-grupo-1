import time
import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains


driver = webdriver.get()

# Inicio sesión con un usuario de prueba
login_button = driver.find_element(By.XPATH, '//*[@id="root"]/header/div/div/button[1]').click()


email_input = driver.find_element(By.XPATH, '//*[@id="username"]')
email_input.send_keys("johndoe@lot.com")

password_input = driver.find_element(By.XPATH, '//*[@id="password"]')
password_input.send_keys("Admin123")

submit_button = driver.find_element(By.XPATH, '/html/body/div/main/section/div/div[2]/div/form/div[2]/button').click()

# Abro el menú de navegación
open_menu_button  = driver.find_element(By.XPATH, '//*[@id="root"]/header/div/button').click()
time.sleep(2) # Esto es para asegurarme que el menú carga correctamente

# Navego a la página de perfil del usuario
fundraisings_page_link = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/ul/a[6]')
ActionChains(driver).move_to_element(fundraisings_page_link).perform()
fundraisings_page_link.click()

time.sleep(2) # Esto es para asegurarme que la página

view_details_link = driver.find_element(By.XPATH, '//*[@id="root"]/main/div/div[2]/div/div[3]/a/button')
ActionChains(driver).move_to_element(view_details_link).perform()
view_details_link.click()

time.sleep(2) # Esto es para asegurarme que la página

update_fundraising_button  = driver.find_element(By.XPATH, '//*[@id="root"]/main/div[2]/a/button').click()

time.sleep(2) # Esto es para asegurarme que la página



token_price_select  = driver.find_element(By.XPATH, '//*[@id="token-price-select"]').click()
token_price_select_option  = driver.find_element(By.XPATH, '//*[@data-value="12.5"]').click()


update_fundraising_button  = driver.find_element(By.XPATH, '//*[@id="root"]/main/form/button').click()


# time.sleep(5)
time.sleep(1)

input("Press Enter to continue...")

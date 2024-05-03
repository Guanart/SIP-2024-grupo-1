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
email_input.send_keys("user@example.com")

password_input = driver.find_element(By.XPATH, '//*[@id="password"]')
password_input.send_keys("Admin123")

submit_button = driver.find_element(By.XPATH, '/html/body/div/main/section/div/div[2]/div/form/div[2]/button').click()

# Abro el menú de navegación
open_menu_button  = driver.find_element(By.XPATH, '//*[@id="root"]/header/div/button').click()
time.sleep(2) # Esto es para asegurarme que el menú carga correctamente

# Navego a la página de perfil del usuario
account_page_link = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/ul/a[3]')
ActionChains(driver).move_to_element(account_page_link).perform()
account_page_link.click()

# Actualizo el username
edit_profile_button = driver.find_element(By.XPATH, '//*[@id="root"]/main/div[1]/div/div/div/div/div[3]/button[1]').click()
username_input = driver.find_element(By.XPATH, '//*[@id="username"]')

# Seleccionar todo el texto en el campo de entrada y borrarlo
username_input.send_keys(Keys.CONTROL + "a")
username_input.send_keys(Keys.DELETE)        

username_input.send_keys("matias")
save_changes_button = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/form/div[4]/button[1]').click()

time.sleep(1) # Esto es para asegurarme que los cambios carguen correctamente

username_element = driver.find_element(By.XPATH, '//*[@id="root"]/main/div[1]/div/div/div/div/div[2]/h3')

# Validar el nuevo username modificado obtenido usando assert
updated_username = username_element.text.split("user@example.com")[0]
expected_username = "matias"
assert updated_username == expected_username, f"El texto obtenido '{updated_username}' no coincide con el valor esperado '{expected_username}'"

# Cerrar el navegador
driver.quit()


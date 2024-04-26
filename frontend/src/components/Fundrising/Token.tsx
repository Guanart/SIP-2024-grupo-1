import "./Token.css";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import { useState } from "react";

const REACT_APP_API_URL = null;
const REACT_APP_MP_PUBLIC_KEY = null;

export const Token = () => {
  const [preferenceId, setPreferenceId] = useState(null)    // Estado para guardar la preferenceId que me traigo del server
  initMercadoPago(REACT_APP_MP_PUBLIC_KEY ?? 'TEST-960f6880-26b7-4fbd-b001-587fc4a7e552', {
    locale: "es-AR",
  })

  const createPreference = async () => {
    try {
      const response = await axios.post(
        REACT_APP_API_URL ? REACT_APP_API_URL +
          "/mercado-pago/create-preference" :
          "http://localhost:3000/mercado-pago/create-preference",
        {
          title: "Mariano Rapa",
          quantity: 1,
          unit_price: 100,
        }
      );
      const { id } = response.data
      return id
    } catch (error) {
      console.log(error)
    }
  }

  const handleBuy = async () => {
    const id = await createPreference();
    if (id) {
      setPreferenceId(id)
    }
  }

  return (
    <div className="card-product-container">
      <div className="card-product">
        <div className="card">
          <img
            src="https://media.licdn.com/dms/image/D4D22AQHrhkwBrs1O7A/feedshare-shrink_800/0/1707322337586?e=2147483647&v=beta&t=636aO6AwUMVg-Ff14Uic6opM_izpdQPhNTg5SF5nPkE"
            alt="Product Image"
          />
          <h3>Mariano Rapa</h3>
          <p>Precio: $100</p>
          <button onClick={handleBuy}>Comprar</button>
          {preferenceId && (
            <Wallet initialization={{ preferenceId: preferenceId }}></Wallet>
          )}
        </div>
      </div>
    </div>
  );
}

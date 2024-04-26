import "./Product.css";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import { useState } from "react";


const Token = () => {
  const [preferenceId, setPreferenceId] = useState(null)
  initMercadoPago("YOUR_PUBLIC_KEY", {
    locale: "es-AR",
  })

  const createPreference = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/createPreference",
        {
          title: "Mariano Rapa",
          quantity: 1,
          price: 100,
        }
      )
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
            src="https://res.cloudinary.com/pabcode/image/upload/v1699871193/e-commerce/mopgcvdiepr8axkazmcp.png"
            alt="Product Image"
          />
          <h3>Bananita contenta</h3>
          <p>Precio: $100</p>
          <button onClick={handleBuy}>Comprar</button>
          {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }}></Wallet>}
        </div>
      </div>
    </div>
  );
}

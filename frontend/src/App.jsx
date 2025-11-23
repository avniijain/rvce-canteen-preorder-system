import AppRouter from "./router";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <AppRouter />
    </CartProvider>
  );
}
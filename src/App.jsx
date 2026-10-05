import { Route, Routes } from "react-router-dom";
import BtmHeader from "./components/header/BtmHeader";
import TopHeader from "./components/header/TopHeader";
import Home from "./page/home/Home";
import ProductDetails from "./page/productDetails/ProductDetails";
import Cart from "./page/cart/Cart";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import { AnimatePresence } from "framer-motion";
import CategoryPage from "./page/CategoryPage/CategoryPage";
import SearchResults from "./page/SearchResults";
import Favorites from "./page/favorites/Favorites";
import Footer from "./components/footer/Footer";
import Login from "./page/Login/Login";
import Register from "./page/Register/Register";
import Profile from "./page/Profile/Profile";
import About from "./page/About/About";
import Contact from "./page/Contact/Contact";
import ChatBot from "./page/ChatBot/ChatBot";
import Checkout from "./page/Checkout/Checkout";
import OrderConfirmation from "./page/OrderConfirmation/OrderConfirmation";
import Orders from "./page/Orders/Orders";
import OrderTracking from "./page/OrderTracking/OrderTracking";
import SellerSetup from "./page/Seller/SellerSetup";

import SellerProducts from "./page/Seller/SellerProducts";
function App() {
  return (
    <>
      <header>
        <TopHeader />
        <BtmHeader />
      </header>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #bfdbfe",
            boxShadow: "0 18px 40px -12px rgba(30,64,175,.25)",
            borderRadius: "4px",
            padding: "12px 14px",
          },
        }}
      />

      <ScrollToTop />

      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="About" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/login" element={<Login />} />
            <Route
  path="/seller/setup"
  element={<SellerSetup />}
/>
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Checkout" element={<Checkout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/order-confirmation/:orderId"
              element={<OrderConfirmation />}
            />
            <Route path="/orders" element={<Orders />} />

            <Route
              path="/order-tracking/:orderId"
              element={<OrderTracking />}
              
            />
            

<Route path="/seller/products" element={<SellerProducts />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}

export default App;

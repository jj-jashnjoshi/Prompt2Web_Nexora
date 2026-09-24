import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Order from './pages/Order'
import Kitchen from './pages/Kitchen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/kitchen" element={<Kitchen />} />
      </Routes>
    </BrowserRouter>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Kitchen from './pages/Kitchen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        {/* Staff/demo screen, not linked from the student app */}
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

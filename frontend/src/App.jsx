import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home/Home';
import ProductDetails from "./components/Home/ProductDetails";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ProductLists from "./components/Admin/Products/ProductLists";
import UserLists from "./components/Admin/Users/UserLists";
import OrderLists from "./components/Admin/Orders/OrderLists";
import Settings from "./components/Admin/Settings";



function App() {
  return (
    <Router>
     {/* Add Toaster here so it works globally */}
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/product/:id" element={<ProductDetails />} />
         <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
  path="/admin/dashboard"
  element={
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  }
/>
<Route path="/admin/users" element={<AdminLayout><UserLists/></AdminLayout>} />
<Route path="/admin/products" element={<AdminLayout><ProductLists/></AdminLayout>} />
<Route path="/admin/orders" element={<AdminLayout><OrderLists/></AdminLayout>} />
<Route path="/admin/settings" element={<AdminLayout><Settings/></AdminLayout>} />
      </Routes>
    </Router>
  );
}
export default App;
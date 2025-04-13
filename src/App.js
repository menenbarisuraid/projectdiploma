import './App.css';
import Login from "./components/Login/Login";
import Welcome from "./components/Welcome/Welcome";
import { HashRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Products from "./components/Products/Products";
import ScanPage from "./components/Scanpage/ScanPage";
import InstructionPage from "./components/Instruction/InstructionPage";
import AboutUs from "./components/About Us/AboutUs";
import CommentPage from "./components/Comments/CommentPage";
import FavouritesPage from "./components/Favourites/FavouritesPage";
import ProfilePage from "./components/Profile/Profile";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import AdminPanel from "./components/AdminPage/AdminPanel";
import AdminPageDetails from "./components/AdminPageDetails/AdminPageDetails";
import ScannedProductsDetails from "./components/ScannedProductsDetails/ScannedProductsDetails";
import FavouriteDetails from "./components/FavouriteDetails/FavouriteDetails";
import NotificationsDetails from "./components/NotificationsDetails/NotificationsDetails";
import TopProductsDetails from "./components/TopProductsDetails/TopProductsDetails";
import AllProductsDetails from "./components/AllProductsDetails/AllProductsDetails";
import AlternativeProducts from "./components/AlternativeProducts/AlternativeProducts";
import InfoScannedProduct from "./components/InfoScannedProduct/InfoScannedProduct";
import EditAllScans from "./components/EditAllScans/EditAllScans";
// import KeepBackendAlive from "./components/Utils/KeepBackendAlive";

const App = () => {
  return (
      <HashRouter>
        {/* Компонент, который пингует бэкенд для поддержания его активности */}
        {/*<KeepBackendAlive />*/}

        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/scanpage" element={<ScanPage />} />
          <Route path="/instruction" element={<InstructionPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/scans/latest/reviews" element={<CommentPage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/adminpagedetails/:scan_id" element={<AdminPageDetails />} />
          <Route path="/scannedproductsdetails" element={<ScannedProductsDetails />} />
          <Route path="/favouritedetails" element={<FavouriteDetails />} />
          <Route path="/notificationsdetails" element={<NotificationsDetails />} />
          <Route path="/topproductsdetails" element={<TopProductsDetails />} />
          <Route path="/allproductsdetails" element={<AllProductsDetails />} />
          <Route path="/alternativeproducts" element={<AlternativeProducts />} />
          <Route path="/infoscannedproductdetails/:scan_id" element={<InfoScannedProduct />} />
          <Route path="/editallscans" element={<EditAllScans />} />
        </Routes>
      </HashRouter>
  );
}

export default App;

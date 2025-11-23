import {  Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Donation from "./pages/Donation"
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<Donation />} />
        </Routes>

        <Footer />
    </ThemeProvider>
  );
}

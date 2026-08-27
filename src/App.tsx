import Navbar from './components/navbar/Navbar';
import Home from './pages/landing/Landing';
import Footer from './components/footer/Footer';

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-100 pb-8">
        <Home />
      </div>
      <Footer />
    </>
  );
}

export default App;
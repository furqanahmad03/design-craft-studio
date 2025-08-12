import Navbar from '../components/Navbar';
import ProductsBar from '../components/ProductsBar';
import DecorationBar from '../components/DecorationBar';
import OrderForm from '../components/OrderForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Order Form Section */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Place Your Order
          </h2>
          <OrderForm />
        </div>
      </div>

      {/* Main Content - Products and Decorations */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Products */}
        <div className="w-full lg:w-1/2 p-4 bg-gray-100 sm:p-6 h-screen overflow-y-auto">
          <ProductsBar />
        </div>
        
        {/* Right Side - Decorations */}
        <div className="w-full lg:w-1/2 p-4 bg-white sm:p-6 h-screen overflow-y-auto">
          <DecorationBar />
        </div>
      </div>
    </div>
  );
}

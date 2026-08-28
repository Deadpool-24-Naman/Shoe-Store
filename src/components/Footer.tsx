export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">SHOE STORE</h3>
          <p className="text-sm">
            Your ultimate destination for premium footwear. 
            We offer the best brands and styles for all your needs.
          </p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/products?category=men" className="hover:text-white">Men</a></li>
            <li><a href="/products?category=women" className="hover:text-white">Women</a></li>
            <li><a href="/products?category=kids" className="hover:text-white">Kids</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">FAQ</a></li>
            <li><a href="#" className="hover:text-white">Shipping</a></li>
            <li><a href="#" className="hover:text-white">Returns</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-sm text-center">
        &copy; {new Date().getFullYear()} Shoe Store. All rights reserved.
      </div>
    </footer>
  );
}

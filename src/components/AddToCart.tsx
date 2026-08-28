'use client';
import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { ShoppingCart } from 'lucide-react';

export default function AddToCart({ product }: { product: any }) {
  const sizes = JSON.parse(product.sizes);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    const image = JSON.parse(product.images)[0];
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image,
      size: selectedSize,
      quantity: 1,
    });
    alert('Added to cart!');
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Select Size</h3>
          <button className="text-gray-500 text-sm hover:text-black underline transition-colors">Size Guide</button>
        </div>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size: string) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-14 h-14 flex items-center justify-center rounded-xl font-medium transition-all duration-200 ${
                selectedSize === size
                  ? 'border-2 border-black bg-black text-white shadow-lg scale-105'
                  : 'border border-gray-200 text-gray-700 hover:border-gray-900 hover:bg-gray-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      <button 
        onClick={handleAddToCart}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-5 px-8 rounded-full flex items-center justify-center gap-3 transition-all duration-200 shadow-xl shadow-blue-600/20"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>
    </div>
  );
}

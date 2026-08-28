import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/');
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {/* We would typically have an Add Product modal/page here */}
        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">Add Product</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img src={JSON.parse(product.images)[0]} alt={product.name} className="w-10 h-10 rounded object-cover" />
                  <span className="font-medium">{product.name}</span>
                </td>
                <td className="p-4 capitalize">{product.category}</td>
                <td className="p-4">${product.price.toFixed(2)}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4 space-x-2 text-sm text-blue-600">
                  <button>Edit</button>
                  <button className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

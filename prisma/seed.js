const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const shoes = [
  {
    name: "Air Max Runner",
    description: "Lightweight and breathable for your daily runs.",
    price: 120.0,
    images: JSON.stringify(["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"]),
    category: "men",
    brand: "Nike",
    sizes: JSON.stringify(["8", "9", "10", "11", "12"]),
    stock: 50,
  },
  {
    name: "Classic High Top",
    description: "Timeless style meets modern comfort.",
    price: 85.0,
    images: JSON.stringify(["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop"]),
    category: "men",
    brand: "Vans",
    sizes: JSON.stringify(["7", "8", "9", "10", "11"]),
    stock: 100,
  },
  {
    name: "Zoom Elegance",
    description: "Premium materials for an elevated look.",
    price: 150.0,
    images: JSON.stringify(["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop"]),
    category: "women",
    brand: "Nike",
    sizes: JSON.stringify(["5", "6", "7", "8", "9"]),
    stock: 30,
  },
  {
    name: "Speed Demon Spikes",
    description: "Track ready spikes for maximum performance.",
    price: 95.0,
    images: JSON.stringify(["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop"]),
    category: "sports",
    brand: "Adidas",
    sizes: JSON.stringify(["8", "9", "10", "11"]),
    stock: 20,
  },
  {
    name: "Tiny Toes Velcro",
    description: "Easy on, easy off for the little ones.",
    price: 45.0,
    images: JSON.stringify(["https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop"]),
    category: "kids",
    brand: "Puma",
    sizes: JSON.stringify(["1", "2", "3", "4", "5"]),
    stock: 200,
  },
  {
    name: "Cloud Walker",
    description: "Feel like you are walking on clouds all day.",
    price: 110.0,
    images: JSON.stringify(["https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop"]),
    category: "women",
    brand: "Asics",
    sizes: JSON.stringify(["6", "7", "8", "9", "10"]),
    stock: 45,
  }
];

async function main() {
  console.log("Cleaning old product records...");
  await prisma.product.deleteMany({});

  console.log("Seeding fresh database records...");
  for (const shoe of shoes) {
    await prisma.product.create({
      data: shoe,
    });
  }
  console.log("Database successfully seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

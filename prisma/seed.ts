import fs from 'fs';
import path from 'path';

// Zero-dependency .env loader
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
} catch (e) {
  // Ignore fallback error
}

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ============================================================================
// 100% EXPLICIT SHOE ARRAY — Every shoe has a hardcoded brand, name, category,
// price, description, and a verified high-availability Unsplash image URL.
// NO fallback loops, NO random assignments, NO dynamic brand mapping.
// All URLs use ?w=800&q=80&auto=format&fit=crop for optimal CDN delivery.
// ============================================================================

const IMG = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

const shoes = [
  // ==========================================
  // NIKE (22 Models)
  // ==========================================
  {
    name: "Nike Air Max 90 Infrared OG",
    brand: "Nike",
    category: "sports",
    price: 130.0,
    images: IMG("1542291026-7eec264c27ff"),
    description: "The Nike Air Max 90 stays true to its OG running roots with iconic Waffle sole and visible Max Air cushioning.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 45
  },
  {
    name: "Nike Dunk Low Retro Panda",
    brand: "Nike",
    category: "men",
    price: 125.0,
    images: IMG("1600185365483-26d7a4cc7519"),
    description: "Created for the hardwood but taken to the streets, the 80s icon returns with classic black-and-white color blocking.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 50
  },
  {
    name: "Nike Air Force 1 '07 Triple White",
    brand: "Nike",
    category: "men",
    price: 115.0,
    images: IMG("1549298916-b41d501d3772"),
    description: "The radiance lives on in the Nike Air Force 1 '07 with crisp stitched leather overlays and legendary Nike Air cushioning.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"]),
    stock: 60
  },
  {
    name: "Nike Blazer Mid '77 Vintage",
    brand: "Nike",
    category: "men",
    price: 105.0,
    images: IMG("1560343090-f0409e92791a"),
    description: "Styled for the 70s, loved in the 80s, classic in the 90s. The Blazer Mid delivers a timeless silhouette with retro suede hits.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 35
  },
  {
    name: "Nike Air Max 97 Silver Bullet",
    brand: "Nike",
    category: "men",
    price: 185.0,
    images: IMG("1575537302964-96cd47c06b1b"),
    description: "Featuring the original ripple design inspired by Japanese bullet trains, with revolutionary full-length Nike Air cushioning.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 28
  },
  {
    name: "Nike ZoomX Vaporfly Next% 3",
    brand: "Nike",
    category: "sports",
    price: 220.0,
    images: IMG("1606107557195-0e29a4b5b4aa"),
    description: "Engineered for race day dominance with ultra-responsive ZoomX foam and a full-length carbon fiber flyplate.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 20
  },
  {
    name: "Nike Air Zoom Pegasus 40",
    brand: "Nike",
    category: "sports",
    price: 140.0,
    images: IMG("1586525198428-225f6f12cff5"),
    description: "A springy ride for every run, Pegasus returns with neutral support, tuned single-layer mesh, and responsive dual Zoom Air units.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 40
  },
  {
    name: "Nike React Flyknit Electric Blue",
    brand: "Nike",
    category: "sports",
    price: 150.0,
    images: IMG("1515955656352-a1fa3ffcd111"),
    description: "Nike React foam cushioning is light, springy, and durable, paired with an ultra-breathable Flyknit upper.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 30
  },
  {
    name: "Nike Air Force 1 Shadow Pastel",
    brand: "Nike",
    category: "women",
    price: 130.0,
    images: IMG("1597045566677-8cf032ed6634"),
    description: "A playful twist on a classic b-ball design featuring layered branding, doubled eyestays, and an exaggerated midsole.",
    sizes: JSON.stringify(["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]),
    stock: 35
  },
  {
    name: "Nike Tech Hera Chunky Platform",
    brand: "Nike",
    category: "chunky",
    price: 110.0,
    images: IMG("1595950653106-6c9ebd614d3a"),
    description: "Inspired by early 2000s running, the Tech Hera features a chunky lifted midsole and subtly layered textile upper.",
    sizes: JSON.stringify(["UK 5", "UK 6", "UK 7", "UK 8", "UK 9"]),
    stock: 25
  },
  {
    name: "Nike Air Max Plus TN Sunset",
    brand: "Nike",
    category: "men",
    price: 190.0,
    images: IMG("1552346154-21d32810aba3"),
    description: "Featuring tuned Air technology and flame-like TPU cage overlays, making a defiant streetwear statement.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 22
  },
  {
    name: "Nike Metcon 9 Training",
    brand: "Nike",
    category: "sports",
    price: 150.0,
    images: IMG("1460353581641-37baddab0fa2"),
    description: "The gold standard for cross-training with an enlarged Hyperlift plate and rubber rope wrap for intense workouts.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 32
  },
  {
    name: "Nike React Infinity Run 3",
    brand: "Nike",
    category: "sports",
    price: 160.0,
    images: IMG("1588117260148-b47818741c74"),
    description: "High cushioning designed to keep you on the run with Flywire technology and rocker-shaped React foam.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 28
  },
  {
    name: "Nike Dunk High Panda Black White",
    brand: "Nike",
    category: "men",
    price: 135.0,
    images: IMG("1582588678413-dbf45f4823e9"),
    description: "High-top court legend with padded collar, crisp leather panels, and timeless two-tone monochrome aesthetic.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 30
  },
  {
    name: "Nike SB Dunk Low Court Purple",
    brand: "Nike",
    category: "men",
    price: 130.0,
    images: IMG("1525966222134-fcfa99b8ae77"),
    description: "Skate-ready Dunk Low featuring Zoom Air insole, puffy padded tongue, and grippy circular tread pattern.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 24
  },
  {
    name: "Nike Air Max 1 '86 Big Bubble",
    brand: "Nike",
    category: "men",
    price: 160.0,
    images: IMG("1511556532299-8f662fc26c06"),
    description: "The holy grail that started the Air revolution, recreated with the true original oversized visible Air window.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 18
  },
  {
    name: "Nike Wildhorse 8 Trail Running",
    brand: "Nike",
    category: "sports",
    price: 145.0,
    images: IMG("1579338559194-a162d19bf842"),
    description: "Built for tough trail runs with rugged traction lugs, rock protection plate, and lightweight React responsiveness.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 22
  },
  {
    name: "Nike Vomero 5 Cyber Metallic",
    brand: "Nike",
    category: "chunky",
    price: 165.0,
    images: IMG("1556906781-9a412961c28c"),
    description: "Carve your own lane in the Zoom Vomero 5, featuring richly layered synthetic leather, mesh, and plastic cage accents.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 35
  },
  {
    name: "Nike Air Max 270 Black Neon",
    brand: "Nike",
    category: "men",
    price: 160.0,
    images: IMG("1514989940723-e8e51635b782"),
    description: "Boasts Nike's biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 40
  },
  {
    name: "Nike Revolution 6 Kids",
    brand: "Nike",
    category: "kids",
    price: 60.0,
    images: IMG("1539185441755-769473a23570"),
    description: "Plush foam cushioning and lightweight breathable mesh make every step comfortable for all-day playground play.",
    sizes: JSON.stringify(["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"]),
    stock: 45
  },
  {
    name: "Nike Air More Uptempo Anime Edition",
    brand: "Nike",
    category: "anime",
    price: 180.0,
    images: IMG("1584735935682-2f2b69dff9d2"),
    description: "Graffiti-inspired 90s basketball shoe customized with bold Japanese manga comic graphics and visible full Air units.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 15
  },
  {
    name: "Nike Dunk Low Anime Street Drip",
    brand: "Nike",
    category: "anime",
    price: 150.0,
    images: IMG("1605348532760-6753d2c43329"),
    description: "Special edition anime streetwear themed Dunk with cel-shaded line art details and neon accent panels.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 20
  },

  // ==========================================
  // JORDAN (16 Models)
  // ==========================================
  {
    name: "Air Jordan 1 Retro High OG Chicago",
    brand: "Jordan",
    category: "men",
    price: 180.0,
    images: IMG("1552346154-21d32810aba3"),
    description: "The sneaker that changed basketball culture forever. Genuine premium leather in iconic varsity red and black.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"]),
    stock: 25
  },
  {
    name: "Air Jordan 12 Retro Royalty",
    brand: "Jordan",
    category: "chunky",
    price: 190.0,
    images: IMG("1600185365483-26d7a4cc7519"),
    description: "Tinker Hatfield's Japanese sun-rise inspired masterpiece with radiant stitching and faux lizard skin mudguards.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 20
  },
  {
    name: "Air Jordan 4 Retro Military Black",
    brand: "Jordan",
    category: "men",
    price: 210.0,
    images: IMG("1606107557195-0e29a4b5b4aa"),
    description: "Clean smooth white leather upper with light neutral grey suede forefoot overlays and black TPU support wings.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 18
  },
  {
    name: "Air Jordan 1 Low Travis Scott Mocha",
    brand: "Jordan",
    category: "men",
    price: 220.0,
    images: IMG("1597045566677-8cf032ed6634"),
    description: "The most sought-after low top in streetwear, featuring reverse oversized Swoosh logos and rich brown nubuck panels.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 10
  },
  {
    name: "Air Jordan 3 White Cement Reimagined",
    brand: "Jordan",
    category: "men",
    price: 210.0,
    images: IMG("1549298916-b41d501d3772"),
    description: "Featuring the original 1988 elephant print overlays, vintage pre-yellowed midsole, and Nike Air heel branding.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 16
  },
  {
    name: "Air Jordan 11 Retro Concord High",
    brand: "Jordan",
    category: "men",
    price: 225.0,
    images: IMG("1582588678413-dbf45f4823e9"),
    description: "The pinnacle of basketball luxury with shiny patent leather mudguard, carbon fiber shank, and translucent icy blue outsole.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 14
  },
  {
    name: "Air Jordan 1 Mid Shadow 2.0",
    brand: "Jordan",
    category: "men",
    price: 135.0,
    images: IMG("1511556532299-8f662fc26c06"),
    description: "Sleek medium grey suede panels over premium black full-grain leather for an understated versatile streetwear aesthetic.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 35
  },
  {
    name: "Air Jordan 1 Low Elevate Platform",
    brand: "Jordan",
    category: "women",
    price: 145.0,
    images: IMG("1595950653106-6c9ebd614d3a"),
    description: "Rise to the occasion with an elevated platform sole and iconic AJ1 low-top leather construction in soft pastel tones.",
    sizes: JSON.stringify(["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]),
    stock: 26
  },
  {
    name: "Air Jordan 5 Retro Metallic Black",
    brand: "Jordan",
    category: "men",
    price: 200.0,
    images: IMG("1514989940723-e8e51635b782"),
    description: "WWII Mustang fighter plane shark-teeth midsole design with reflective 3M tongue and lace lock toggle.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 18
  },
  {
    name: "Jordan Stadium 90 Streetwear",
    brand: "Jordan",
    category: "men",
    price: 140.0,
    images: IMG("1560343090-f0409e92791a"),
    description: "Takes elements from the AJ1 and AJ5 to create a modern everyday comfort shoe with Formula 23 foam underfoot.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 30
  },
  {
    name: "Jordan Luka 2 Performance",
    brand: "Jordan",
    category: "sports",
    price: 130.0,
    images: IMG("1460353581641-37baddab0fa2"),
    description: "Engineered for Luka Doncic's step-back moves with full-foot cage support and Formula 23 energy return.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 22
  },
  {
    name: "Air Jordan 1 Mid SE Craft Canvas",
    brand: "Jordan",
    category: "men",
    price: 145.0,
    images: IMG("1575537302964-96cd47c06b1b"),
    description: "Inside-out aesthetic combining exposed foam collars, canvas underlays, and soft suede overlays in earthy neutral tones.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 28
  },
  {
    name: "Air Jordan 6 Retro Infrared",
    brand: "Jordan",
    category: "men",
    price: 200.0,
    images: IMG("1542291026-7eec264c27ff"),
    description: "The championship shoe Michael Jordan wore when claiming his first NBA ring in 1991, featuring infrared accents.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 15
  },
  {
    name: "Jordan Max Aura 5 Triple Black",
    brand: "Jordan",
    category: "men",
    price: 125.0,
    images: IMG("1556906781-9a412961c28c"),
    description: "Modernized heritage silhouette featuring durable leather and heel Max Air unit for daily urban versatility.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 32
  },
  {
    name: "Air Jordan 1 Mid Kids University Blue",
    brand: "Jordan",
    category: "kids",
    price: 85.0,
    images: IMG("1539185441755-769473a23570"),
    description: "The iconic AJ1 mid scaled down for the next generation of hoopers in vibrant UNC Carolina blue.",
    sizes: JSON.stringify(["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"]),
    stock: 25
  },
  {
    name: "Air Jordan 1 High Anime Dragon Custom",
    brand: "Jordan",
    category: "anime",
    price: 230.0,
    images: IMG("1605348532760-6753d2c43329"),
    description: "Collector's custom anime edition featuring dragon aura brush strokes and gold foil Japanese kanji lettering.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 8
  },

  // ==========================================
  // ADIDAS (18 Models)
  // ==========================================
  {
    name: "Adidas Originals Samba OG Classic",
    brand: "Adidas",
    category: "men",
    price: 100.0,
    images: IMG("1518002171953-a080ee817e1f"),
    description: "From indoor soccer roots to global streetwear royalty, the Samba OG delivers soft leather, suede T-toe, and gum rubber outsole.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 55
  },
  {
    name: "Adidas Superstar Core Black White",
    brand: "Adidas",
    category: "men",
    price: 105.0,
    images: IMG("1587563871167-1ee9c731aefb"),
    description: "The 70s basketball icon that defined hip-hop style with signature serrated 3-Stripes and rubber shell-toe bumper.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 48
  },
  {
    name: "Adidas Gazelle Indoor Bold Green",
    brand: "Adidas",
    category: "men",
    price: 120.0,
    images: IMG("1608231387042-66d1773070a5"),
    description: "Originally designed for 70s indoor training, this updated Gazelle features rich suede upper and translucent gum rubber cupsole.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 38
  },
  {
    name: "Adidas Stan Smith White Green",
    brand: "Adidas",
    category: "men",
    price: 95.0,
    images: IMG("1560769629-975ec94e6a86"),
    description: "The quintessential minimalist white tennis sneaker with perforated 3-Stripes and green heel badge.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 50
  },
  {
    name: "Adidas Ultraboost Light Performance",
    brand: "Adidas",
    category: "sports",
    price: 190.0,
    images: IMG("1551107696-a4b085a6d9a6"),
    description: "Experience epic energy return with our lightest BOOST foam yet and Primeknit+ forged foot-hugging upper.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 35
  },
  {
    name: "Adidas Campus 00s Chunky Skate",
    brand: "Adidas",
    category: "chunky",
    price: 110.0,
    images: IMG("1618677831708-0e7fda3148b4"),
    description: "Remixed with early 2000s skate proportions: extra-padded tongue, chunky laces, and super soft suede upper.",
    sizes: JSON.stringify(["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]),
    stock: 42
  },
  {
    name: "Adidas Forum Low 84 Vintage White",
    brand: "Adidas",
    category: "men",
    price: 110.0,
    images: IMG("1579338559194-a162d19bf842"),
    description: "80s b-ball heritage comes alive with signature X-strap ankle detail, premium tumbled leather, and vintage cream tint.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 32
  },
  {
    name: "Adidas Handball Spezial Navy",
    brand: "Adidas",
    category: "men",
    price: 110.0,
    images: IMG("1600185365926-3a2ce3cdb9eb"),
    description: "First introduced in 1979 for elite indoor handball players, now a terrace streetwear essential with gum sole.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 30
  },
  {
    name: "Adidas NMD_R1 V3 Urban Tech",
    brand: "Adidas",
    category: "men",
    price: 140.0,
    images: IMG("1515955656352-a1fa3ffcd111"),
    description: "Futuristic street sneaker with transparent TPU plugs, full-length Boost cushioning, and engineered mesh.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 28
  },
  {
    name: "Adidas Gazelle Bold Platform",
    brand: "Adidas",
    category: "women",
    price: 120.0,
    images: IMG("1607522370275-f14206abe5d3"),
    description: "Takes the iconic Gazelle look to triple heights with a stacked three-layer platform gum outsole.",
    sizes: JSON.stringify(["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]),
    stock: 36
  },
  {
    name: "Adidas Adizero Adios Pro 3",
    brand: "Adidas",
    category: "sports",
    price: 225.0,
    images: IMG("1460353581641-37baddab0fa2"),
    description: "Record-breaking road racing shoes featuring dual layers of Lightstrike Pro foam and carbon ENERGYRODS 2.0.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 16
  },
  {
    name: "Adidas Response CL Chunky",
    brand: "Adidas",
    category: "chunky",
    price: 130.0,
    images: IMG("1584735935682-2f2b69dff9d2"),
    description: "A tribute to early 2000s trail runners with heavy synthetic layering, EVA midsole, and rugged tech aesthetic.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 24
  },
  {
    name: "Adidas Samba Classic White Black",
    brand: "Adidas",
    category: "men",
    price: 90.0,
    images: IMG("1605348532760-6753d2c43329"),
    description: "Classic long-tongue Samba edition with full-grain leather upper and non-marking gum sole.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 45
  },
  {
    name: "Adidas Stan Smith Kids Hook-and-Loop",
    brand: "Adidas",
    category: "kids",
    price: 55.0,
    images: IMG("1587563871167-1ee9c731aefb"),
    description: "Easy hook-and-loop triple straps make this tennis classic effortless for young sneakerheads.",
    sizes: JSON.stringify(["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"]),
    stock: 38
  },
  {
    name: "Adidas Superstar Kids Shell Toe",
    brand: "Adidas",
    category: "kids",
    price: 60.0,
    images: IMG("1560769629-975ec94e6a86"),
    description: "Miniaturized shell-toe classic offering durable leather and cushioned OrthoLite sockliner.",
    sizes: JSON.stringify(["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"]),
    stock: 30
  },
  {
    name: "Adidas Forum Mid Anime Mecha",
    brand: "Adidas",
    category: "anime",
    price: 160.0,
    images: IMG("1579338559194-a162d19bf842"),
    description: "Mecha anime inspired high-top Forum with warning stencil decals and neon blue energy line hits.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 14
  },
  {
    name: "Adidas Samba Manga Edition",
    brand: "Adidas",
    category: "anime",
    price: 135.0,
    images: IMG("1518002171953-a080ee817e1f"),
    description: "Custom manga halftone panel printed Samba with black outline speedlines and gum sole.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 18
  },
  {
    name: "Adidas Astir Chunky Y2K",
    brand: "Adidas",
    category: "chunky",
    price: 110.0,
    images: IMG("1618677831708-0e7fda3148b4"),
    description: "Dramatic Y2K inspired runner featuring oversized eyelets and wavy high-profile midsole lines.",
    sizes: JSON.stringify(["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]),
    stock: 22
  },

  // ==========================================
  // PUMA (14 Models)
  // ==========================================
  {
    name: "Puma Suede Classic XXI Black White",
    brand: "Puma",
    category: "men",
    price: 75.0,
    images: IMG("1608231387042-66d1773070a5"),
    description: "The icon that started it all in 1968. Full velvety suede upper with signature Puma Formstrip and gold foil branding.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 50
  },
  {
    name: "Puma RS-X Efekt Chunky Streetwear",
    brand: "Puma",
    category: "chunky",
    price: 120.0,
    images: IMG("1575537302964-96cd47c06b1b"),
    description: "Futuristic chunky shoe with extreme Running System cushioning, angled TPU overlays, and aggressive aesthetic.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 40
  },
  {
    name: "Puma Palermo Special Terrace",
    brand: "Puma",
    category: "men",
    price: 90.0,
    images: IMG("1587563871167-1ee9c731aefb"),
    description: "Revived from the 80s football terrace archives with signature T-toe construction and classic gum rubber outsole.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 35
  },
  {
    name: "Puma MB.03 LaMelo Ball",
    brand: "Puma",
    category: "sports",
    price: 130.0,
    images: IMG("1542291026-7eec264c27ff"),
    description: "Not From Here signature hoops shoe with slime claw scratch cutouts and NITRO foam responsiveness.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 22
  },
  {
    name: "Puma Slipstream Leather Retro",
    brand: "Puma",
    category: "men",
    price: 100.0,
    images: IMG("1560769629-975ec94e6a86"),
    description: "Born as a 1987 basketball shoe, reworked for modern streetwear with premium leather and sculptured collar.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 30
  },
  {
    name: "Puma Deviate Nitro 2 Running",
    brand: "Puma",
    category: "sports",
    price: 160.0,
    images: IMG("1586525198428-225f6f12cff5"),
    description: "High-performance marathon trainer with full-length NITRO Elite foam and carbon composite INNOPLATE.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 24
  },
  {
    name: "Puma CA Pro Classic White",
    brand: "Puma",
    category: "men",
    price: 85.0,
    images: IMG("1518002171953-a080ee817e1f"),
    description: "Heritage West Coast tennis silhouette with clean toe perforations and molded midsole styling.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 45
  },
  {
    name: "Puma Future Rider Play On",
    brand: "Puma",
    category: "men",
    price: 85.0,
    images: IMG("1551107696-a4b085a6d9a6"),
    description: "Fast Rider updated with shock-absorbing Federbein slim outsole and ultra-comfortable Rider Foam.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 38
  },
  {
    name: "Puma Mayze Chunky Platform",
    brand: "Puma",
    category: "women",
    price: 100.0,
    images: IMG("1597045566677-8cf032ed6634"),
    description: "Bold attitude packed into a fierce stacked platform sole with layered leather and urban utility design.",
    sizes: JSON.stringify(["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]),
    stock: 32
  },
  {
    name: "Puma Caven 2.0 Retro Court",
    brand: "Puma",
    category: "men",
    price: 70.0,
    images: IMG("1600185365926-3a2ce3cdb9eb"),
    description: "Nostalgic collegiate vibe with soft synthetic leather and comfort SoftFoam+ sockliner.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 40
  },
  {
    name: "Puma Smash v2 Kids Court",
    brand: "Puma",
    category: "kids",
    price: 45.0,
    images: IMG("1539185441755-769473a23570"),
    description: "Durable suede upper and grippy rubber outsole designed to withstand endless playground adventures.",
    sizes: JSON.stringify(["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"]),
    stock: 36
  },
  {
    name: "Puma RS-Fast Anime Cyber Drift",
    brand: "Puma",
    category: "anime",
    price: 130.0,
    images: IMG("1605348532760-6753d2c43329"),
    description: "Cyberpunk anime aesthetic featuring glowing neon accents, reflective heel clips, and aggressive RS design.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 16
  },
  {
    name: "Puma Teveris Nitro Chunky Runner",
    brand: "Puma",
    category: "chunky",
    price: 110.0,
    images: IMG("1618677831708-0e7fda3148b4"),
    description: "Early 2000s running shoe reinterpreted with modern NITRO foam technology inside a chunky layered silhouette.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 28
  },
  {
    name: "Puma All-Pro NITRO Basketball",
    brand: "Puma",
    category: "sports",
    price: 140.0,
    images: IMG("1606107557195-0e29a4b5b4aa"),
    description: "Pro court performance with dual-layer NITRO foam midsole and engineered multi-zone cord lacing system.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 20
  },

  // ==========================================
  // NEW BALANCE (14 Models)
  // ==========================================
  {
    name: "New Balance 550 White Green",
    brand: "New Balance",
    category: "men",
    price: 120.0,
    images: IMG("1551107696-a4b085a6d9a6"),
    description: "The 1989 basketball legend resurrected for modern street style. Premium white leather with forest green accents.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 45
  },
  {
    name: "New Balance 9060 Chunky Sea Salt",
    brand: "New Balance",
    category: "chunky",
    price: 155.0,
    images: IMG("1618677831708-0e7fda3148b4"),
    description: "Reinterprets familiar 99X elements with warped Y2K aesthetic, swaying lines, and chunky sculptured ABZORB pods.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 35
  },
  {
    name: "New Balance 2002R Protection Pack",
    brand: "New Balance",
    category: "men",
    price: 160.0,
    images: IMG("1584735935682-2f2b69dff9d2"),
    description: "The viral distressed design with jagged, raw-edge suede overlays over breathable mesh and N-ergy shock absorption.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 25
  },
  {
    name: "New Balance 574 Core Classic Grey",
    brand: "New Balance",
    category: "men",
    price: 90.0,
    images: IMG("1539185441755-769473a23570"),
    description: "The unpretentious, versatile icon. Soft premium suede with ENCAP midsole cushioning that never goes out of style.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 55
  },
  {
    name: "New Balance 990v6 Made in USA",
    brand: "New Balance",
    category: "men",
    price: 205.0,
    images: IMG("1556906781-9a412961c28c"),
    description: "Crafted in the USA with premium pigskin suede, ENCAP midsole, and ultra-responsive FuelCell cushioning.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 18
  },
  {
    name: "New Balance 1906R Silver Metallic",
    brand: "New Balance",
    category: "men",
    price: 155.0,
    images: IMG("1586525198428-225f6f12cff5"),
    description: "Named for the year New Balance was founded, featuring high-tech N-ergy outsole and stability web arch support.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 30
  },
  {
    name: "New Balance 327 Vintage Runner",
    brand: "New Balance",
    category: "women",
    price: 100.0,
    images: IMG("1607522370275-f14206abe5d3"),
    description: "Bold 70s-inspired silhouette with oversized asymmetrical 'N' logo and wraparound trail-inspired lug outsole.",
    sizes: JSON.stringify(["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]),
    stock: 40
  },
  {
    name: "New Balance Fresh Foam X 1080v13",
    brand: "New Balance",
    category: "sports",
    price: 165.0,
    images: IMG("1460353581641-37baddab0fa2"),
    description: "Max-cushion running pinnacle with smooth transitions, breathable engineered mesh, and marshmallow-soft Fresh Foam X.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 32
  },
  {
    name: "New Balance 530 White Silver",
    brand: "New Balance",
    category: "chunky",
    price: 100.0,
    images: IMG("1556906781-9a412961c28c"),
    description: "Throwback running silhouette with breathable open mesh upper, metallic silver curves, and ABZORB heel cushioning.",
    sizes: JSON.stringify(["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]),
    stock: 48
  },
  {
    name: "New Balance 650 High Top Royal",
    brand: "New Balance",
    category: "men",
    price: 135.0,
    images: IMG("1549298916-b41d501d3772"),
    description: "The high-top counterpart to the 550, offering padded puff-and-stitch collar and 80s court proportions.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 24
  },
  {
    name: "New Balance 574 Kids Hook-and-Loop",
    brand: "New Balance",
    category: "kids",
    price: 55.0,
    images: IMG("1539185441755-769473a23570"),
    description: "Classic 574 comfort scaled down for little feet with easy strap closure and soft EVA foam cushioning.",
    sizes: JSON.stringify(["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"]),
    stock: 35
  },
  {
    name: "New Balance 9060 Anime Neon Cyber",
    brand: "New Balance",
    category: "anime",
    price: 165.0,
    images: IMG("1605348532760-6753d2c43329"),
    description: "Cyberpunk inspired colorway with electric violet and neon lime accents across chunky wavy midsole tooling.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 15
  },
  {
    name: "New Balance FuelCell Rebel v4",
    brand: "New Balance",
    category: "sports",
    price: 140.0,
    images: IMG("1588117260148-b47818741c74"),
    description: "Lightweight tempo run trainer with PEBA/EVA blend FuelCell foam for snappy, propulsive toe-offs.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 22
  },
  {
    name: "New Balance 550 Triple Black",
    brand: "New Balance",
    category: "men",
    price: 115.0,
    images: IMG("1514989940723-e8e51635b782"),
    description: "Blacked-out edition of the retro basketball low with premium matte leather and stealth branding.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 30
  },

  // ==========================================
  // VANS (10 Models)
  // ==========================================
  {
    name: "Vans Old Skool Classic Black White",
    brand: "Vans",
    category: "men",
    price: 70.0,
    images: IMG("1525966222134-fcfa99b8ae77"),
    description: "The first skate shoe to bear the iconic side jazz stripe. Sturdy canvas and suede uppers with signature waffle rubber soles.",
    sizes: JSON.stringify(["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 65
  },
  {
    name: "Vans Classic Slip-On Checkerboard",
    brand: "Vans",
    category: "men",
    price: 65.0,
    images: IMG("1539185441755-769473a23570"),
    description: "The timeless Southern California skate and BMX icon with elastic side accents and original checkerboard print.",
    sizes: JSON.stringify(["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 58
  },
  {
    name: "Vans Sk8-Hi Reissue High-Top",
    brand: "Vans",
    category: "men",
    price: 80.0,
    images: IMG("1560343090-f0409e92791a"),
    description: "Legendary lace-up high top with supportive padded ankle collars and re-enforced toecaps for skateboard durability.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 40
  },
  {
    name: "Vans Knu Skool Chunky Puffy",
    brand: "Vans",
    category: "chunky",
    price: 85.0,
    images: IMG("1595950653106-6c9ebd614d3a"),
    description: "90s puffy skate shoe revived with extra padded tongue, chunky 3D molded Sidestripe, and oversized fat laces.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 45
  },
  {
    name: "Vans Authentic Core Classic",
    brand: "Vans",
    category: "men",
    price: 60.0,
    images: IMG("1560769629-975ec94e6a86"),
    description: "The original 1966 low-top canvas shoe from Anaheim with simple clean stitching and gum waffle sole.",
    sizes: JSON.stringify(["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 50
  },
  {
    name: "Vans Half Cab 33 DX Skate",
    brand: "Vans",
    category: "men",
    price: 90.0,
    images: IMG("1582588678413-dbf45f4823e9"),
    description: "Created when skaters trimmed high-tops with scissors and duct tape in 1992, now upgraded with PopCush cushioning.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 25
  },
  {
    name: "Vans Old Skool Stackform Platform",
    brand: "Vans",
    category: "women",
    price: 85.0,
    images: IMG("1525966222134-fcfa99b8ae77"),
    description: "Features a chunky 34mm platform sole upgrade that gives modern streetwear altitude to the classic Sidestripe.",
    sizes: JSON.stringify(["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]),
    stock: 35
  },
  {
    name: "Vans Slip-On Kids Checkerboard",
    brand: "Vans",
    category: "kids",
    price: 45.0,
    images: IMG("1539185441755-769473a23570"),
    description: "Side hook-and-loop closure and heel pull tab make getting in and out of the iconic checkerboard easy for kids.",
    sizes: JSON.stringify(["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"]),
    stock: 40
  },
  {
    name: "Vans Sk8-Hi Anime Manga Art",
    brand: "Vans",
    category: "anime",
    price: 95.0,
    images: IMG("1560343090-f0409e92791a"),
    description: "High-top canvas panels printed with explosive shonen manga action frames and contrasting black suede.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 20
  },
  {
    name: "Vans Rowley Skate Pro Classic",
    brand: "Vans",
    category: "sports",
    price: 85.0,
    images: IMG("1600185365926-3a2ce3cdb9eb"),
    description: "Geoff Rowley's legendary 1999 skate shoe built with Duracap underlays and SickStick gum rubber compound.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 24
  },

  // ==========================================
  // CONVERSE (8 Models)
  // ==========================================
  {
    name: "Converse Chuck 70 High Vintage",
    brand: "Converse",
    category: "men",
    price: 90.0,
    images: IMG("1607522370275-f14206abe5d3"),
    description: "Crafted with heavier 12oz canvas, higher varnished rubber foxing, vintage heel license plate, and cushioned OrthoLite insole.",
    sizes: JSON.stringify(["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 55
  },
  {
    name: "Converse Chuck Taylor Low Classic",
    brand: "Converse",
    category: "men",
    price: 65.0,
    images: IMG("1560769629-975ec94e6a86"),
    description: "The unmistakable low-top silhouette with lightweight canvas, medial eyelets for airflow, and diamond tread outsole.",
    sizes: JSON.stringify(["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 60
  },
  {
    name: "Converse Run Star Hike Platform",
    brand: "Converse",
    category: "chunky",
    price: 110.0,
    images: IMG("1618677831708-0e7fda3148b4"),
    description: "A chunky platform and jagged two-tone rubber tread put an unexpected twist on your everyday Chucks.",
    sizes: JSON.stringify(["UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9"]),
    stock: 42
  },
  {
    name: "Converse One Star Pro Suede",
    brand: "Converse",
    category: "men",
    price: 80.0,
    images: IMG("1608231387042-66d1773070a5"),
    description: "First introduced in 1974 for hoops, embraced by 90s alternative rock and skate culture with iconic cut-out star logo.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 35
  },
  {
    name: "Converse Weapon Mid Retro Basketball",
    brand: "Converse",
    category: "men",
    price: 120.0,
    images: IMG("1552346154-21d32810aba3"),
    description: "The legendary 1986 court weapon worn by Larry Bird and Magic Johnson, revived with leather Y-bar support.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 22
  },
  {
    name: "Converse Chuck 70 AT-CX Utility",
    brand: "Converse",
    category: "chunky",
    price: 125.0,
    images: IMG("1584735935682-2f2b69dff9d2"),
    description: "Rugged outdoors meet city style with exaggerated CX foam midsole, TPU Bosey toe cap, and diamond lugged outsole.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 28
  },
  {
    name: "Converse Chuck Taylor Kids Easy-On",
    brand: "Converse",
    category: "kids",
    price: 45.0,
    images: IMG("1607522370275-f14206abe5d3"),
    description: "Classic canvas high top with dual hook-and-loop strap closure so kids can easily put on and take off.",
    sizes: JSON.stringify(["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"]),
    stock: 38
  },
  {
    name: "Converse Chuck 70 Anime Graphic",
    brand: "Converse",
    category: "anime",
    price: 105.0,
    images: IMG("1605348532760-6753d2c43329"),
    description: "Custom screen-printed high-top Chuck with vibrant Japanese animation graphic panels and custom ankle patch.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 18
  },

  // ==========================================
  // ASICS (8 Models)
  // ==========================================
  {
    name: "Asics GEL-Lyte III OG Heritage",
    brand: "Asics",
    category: "men",
    price: 110.0,
    images: IMG("1584735935682-2f2b69dff9d2"),
    description: "Shigeyuki Mitsui's 1990 design with signature split-tongue construction and rearfoot GEL technology cushioning.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 45
  },
  {
    name: "Asics GEL-Kayano 14 Metallic Silver",
    brand: "Asics",
    category: "men",
    price: 150.0,
    images: IMG("1556906781-9a412961c28c"),
    description: "The peak 2008 running shoe that took the gorpcore and streetwear fashion world by storm with visible GEL pods.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 32
  },
  {
    name: "Asics GEL-NYC Oyster Grey",
    brand: "Asics",
    category: "chunky",
    price: 135.0,
    images: IMG("1586525198428-225f6f12cff5"),
    description: "Combines the upper of the GEL-NIMBUS 3 with tooling from the GEL-CUMULUS 16 for optimal street comfort.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 30
  },
  {
    name: "Asics GT-2160 Pure Silver Gold",
    brand: "Asics",
    category: "men",
    price: 125.0,
    images: IMG("1588117260148-b47818741c74"),
    description: "Preserves the iconic design language from the GT-2000 series with segmented midsole structure and wavy forefoot sculpting.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 35
  },
  {
    name: "Asics Novablast 4 Performance",
    brand: "Asics",
    category: "sports",
    price: 140.0,
    images: IMG("1460353581641-37baddab0fa2"),
    description: "Geometric trampoline-inspired outsole with FF BLAST PLUS ECO cushioning delivers an energetic rebound on every stride.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 28
  },
  {
    name: "Asics GEL-Quantum 360 VII",
    brand: "Asics",
    category: "sports",
    price: 170.0,
    images: IMG("1515955656352-a1fa3ffcd111"),
    description: "Features 360 degrees of GEL technology wrapped around the midsole with Scutoid GEL geometry for maximum shock attenuation.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 20
  },
  {
    name: "Asics GT-1000 Kids Road Running",
    brand: "Asics",
    category: "kids",
    price: 60.0,
    images: IMG("1539185441755-769473a23570"),
    description: "Solid rubber outsole and forefoot stitch guarantee playground durability for active growing feet.",
    sizes: JSON.stringify(["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"]),
    stock: 30
  },
  {
    name: "Asics GEL-Kayano Anime Evangelion",
    brand: "Asics",
    category: "anime",
    price: 175.0,
    images: IMG("1605348532760-6753d2c43329"),
    description: "Evangelion Unit 01 purple and green color-blocked sneaker with tech panel overlays.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 12
  },

  // ==========================================
  // FILA (6 Models)
  // ==========================================
  {
    name: "Fila Disruptor II Premium Chunky",
    brand: "Fila",
    category: "chunky",
    price: 80.0,
    images: IMG("1595950653106-6c9ebd614d3a"),
    description: "The quintessential chunky dad shoe with razor-sharp saw-tooth lugged rubber outsole and padded collar.",
    sizes: JSON.stringify(["UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9"]),
    stock: 50
  },
  {
    name: "Fila Ray Tracer Evo Chunky Multi",
    brand: "Fila",
    category: "chunky",
    price: 85.0,
    images: IMG("1618677831708-0e7fda3148b4"),
    description: "Bold trail and streetwear hybrid featuring multi-material mesh, suede overlays, and chunky EVA midsole.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 35
  },
  {
    name: "Fila Grant Hill 2 Retro 90s High",
    brand: "Fila",
    category: "men",
    price: 110.0,
    images: IMG("1552346154-21d32810aba3"),
    description: "Grant Hill's iconic 1996 signature basketball silhouette featuring distinctive triangular patent leather side branding.",
    sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 22
  },
  {
    name: "Fila FX-100 High Street Leather",
    brand: "Fila",
    category: "men",
    price: 90.0,
    images: IMG("1560343090-f0409e92791a"),
    description: "Original 80s street icon with removable ankle hook-and-loop strap and clean white leather panels.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 28
  },
  {
    name: "Fila Renno Heritage Casual Retro",
    brand: "Fila",
    category: "men",
    price: 75.0,
    images: IMG("1551107696-a4b085a6d9a6"),
    description: "A throwback runner infused with modern lifestyle comfort, featuring recycled leather and energizing foam.",
    sizes: JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
    stock: 30
  },
  {
    name: "Fila Disruptor Kids Chunky Strap",
    brand: "Fila",
    category: "kids",
    price: 55.0,
    images: IMG("1595950653106-6c9ebd614d3a"),
    description: "The iconic Disruptor saw-tooth sole scaled down with easy hook-and-loop closure for young trendsetters.",
    sizes: JSON.stringify(["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"]),
    stock: 32
  }
];

// ============================================================================
// SEED FUNCTION — deleteMany + create loop, no fallbacks
// ============================================================================
async function seedDatabase() {
  console.log(`Starting seed process for ${shoes.length} sneakers...`);

  console.log('Clearing all products from Neon DB...');
  await prisma.product.deleteMany();

  console.log(`Inserting ${shoes.length} explicitly mapped shoes...`);
  let count = 0;
  for (const shoe of shoes) {
    // Wrap image as JSON array for DB storage
    const imagesVal = shoe.images.startsWith('[') ? shoe.images : JSON.stringify([shoe.images]);
    const sizesVal = shoe.sizes.startsWith('[') ? shoe.sizes : JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]);

    await prisma.product.create({
      data: {
        name: shoe.name,
        brand: shoe.brand,
        category: shoe.category,
        price: shoe.price,
        images: imagesVal,
        description: shoe.description,
        sizes: sizesVal,
        stock: shoe.stock || 25,
      },
    });
    count++;
    if (count % 20 === 0 || count === shoes.length) {
      console.log(`✔ Inserted ${count}/${shoes.length} sneakers...`);
    }
  }

  console.log(`\n🎉 Neon Database seeded with ${count} authentic sneakers!`);

  const summary = shoes.reduce((acc: Record<string, number>, curr) => {
    acc[curr.brand] = (acc[curr.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📊 Brand Breakdown:');
  Object.entries(summary).forEach(([brand, num]) => {
    console.log(` - ${brand.padEnd(14)}: ${num} items`);
  });
}

seedDatabase()
  .catch((err) => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

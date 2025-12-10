import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Code, Download, Languages } from 'lucide-react';

export default function ShopPage() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [language, setLanguage] = useState('en');
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const translations = {
    en: {
      shopName: 'Scripts Shop',
      hero: {
        title: 'Premium Game Scripts',
        subtitle: 'Professional scripts for FiveM, Minecraft & Roblox servers'
      },
      categories: {
        all: 'All',
        fivem: 'FiveM',
        minecraft: 'Minecraft',
        roblox: 'Roblox'
      },
      cart: {
        title: 'Shopping Cart',
        empty: 'Your cart is empty',
        total: 'Total:',
        delivery: '✓ Instant delivery via email',
        updates: '✓ Lifetime updates included',
        loading: 'Loading PayPal...',
        emailLabel: 'Your Email (for download links):',
        emailPlaceholder: 'your@email.com',
        emailRequired: 'Email is required for delivery',
        processing: 'Processing your order...'
      },
      addToCart: 'Add to Cart',
      features: 'Features:',
      category: 'Category'
    },
    es: {
      shopName: 'Tienda de Scripts',
      hero: {
        title: 'Scripts Premium para Juegos',
        subtitle: 'Scripts profesionales para servidores FiveM, Minecraft y Roblox'
      },
      categories: {
        all: 'Todos',
        fivem: 'FiveM',
        minecraft: 'Minecraft',
        roblox: 'Roblox'
      },
      cart: {
        title: 'Carrito de Compras',
        empty: 'Tu carrito está vacío',
        total: 'Total:',
        delivery: '✓ Entrega instantánea por correo',
        updates: '✓ Actualizaciones de por vida incluidas',
        loading: 'Cargando PayPal...',
        emailLabel: 'Tu Email (para enlaces de descarga):',
        emailPlaceholder: 'tu@email.com',
        emailRequired: 'El email es requerido para la entrega',
        processing: 'Procesando tu orden...'
      },
      addToCart: 'Añadir al Carrito',
      features: 'Características:',
      category: 'Categoría'
    }
  };

  const t = translations[language];

  const getProducts = () => {
    try {
      const stored = localStorage.getItem('shop-products');
      if (stored) {
        const storedProducts = JSON.parse(stored);
        return storedProducts.map(p => ({
          ...p,
          name: language === 'en' ? p.name.en : p.name.es,
          description: language === 'en' ? p.description.en : p.description.es,
          features: language === 'en' ? p.features.en : p.features.es
        }));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }

    return [
      { 
        id: 1,
        name: language === 'en' ? 'Premium Car Services' : 'Servicios Premium para Vehículos',
        price: 4.99,
        image: '/images/products/car-services.jpg',
        youtubeUrl: null,
        category: 'FiveM',
        description: language === 'en'
          ? 'Premium Car Services with Debadge, Armoring, Repaint, and Tuning. These services are available after purchase only.'
          : 'Servicios Premium para Vehículos con eliminación de emblemas, blindaje, repintado y tuning. Disponibles solo después de la compra.',
        features: language === 'en'
          ? ['Debadge', 'Full Armoring', 'Custom Repaint', 'Performance Tuning', 'Post-purchase service via Discord https://discord.gg/wT4sRsnY9m']
          : ['Eliminación de emblemas', 'Blindaje completo', 'Repintado personalizado', 'Tuning de rendimiento', 'Servicio post-compra vía Discord https://discord.gg/wT4sRsnY9m']
      },
      { 
        id: 2,
        name: language === 'en' ? 'Advanced Mechanic Tablet QBCORE' : 'Tablet de Mecánico Avanzado QBCORE',
        price: 9.99,
        image: '/images/products/mechanic-tablet.jpg',
        youtubeUrl: null,
        category: 'FiveM',
        description: language === 'en'
          ? 'Advanced Mechanic Tablet - Transform any vehicle with ultimate customization power! Modify ALL car aspects with Monster Truck mode.'
          : 'Tablet de Mecánico Avanzado - Transforma cualquier vehículo con el poder definitivo de personalización. Modifica TODOS los aspectos con modo Monster Truck.',
        features: language === 'en'
          ? ['Full Car Customization', 'Monster Truck Mode', 'Inventory Integration', 'Paint, Wheels & Suspension', 'Optimized for Mechanic Jobs', 'Discord https://discord.gg/wT4sRsnY9m']
          : ['Personalización completa de vehículos', 'Modo Monster Truck', 'Integración con inventario', 'Pintura, ruedas y suspensión', 'Optimizado para mecánicos','Discord https://discord.gg/wT4sRsnY9m']
      },
      { 
        id: 3, 
        name: language === 'en' ? 'Alien Rampage Weed' : 'Maria: Ataque Alien',
        price: 4.99, 
        image: '/images/products/alien-rampage-weed.jpg',
        youtubeUrl: 'https://www.youtube.com/watch?v=7LQifGiWblc',
        category: 'FiveM',
        description: language === 'en'
          ? 'QBCORE Defend Yourself while you are stoned: The script includes the cigar and edible items after you smoke or eat you get stoned then a UFO flies to your position.'
          : 'QBCORE Defiendete Mientras Estas hasta arriba: El Script cuenta con el cigarro y un comestible dspues de fumar o comer sufres los efectos de la maria pero un OVNI baja hasta tu posición',
        features: language === 'en'
          ? ['Cigar', 'Edible', 'Aliens','Discord https://discord.gg/wT4sRsnY9m']
          : ['Cigarro', 'Comestible', 'Aliens','Discord https://discord.gg/wT4sRsnY9m']
      },
      { 
        id: 4, 
        name: language === 'en' ? 'Dino Rampage Weed' : 'Maria: Furia Del Dinosaurio',
        price: 4.99, 
        image: '/images/products/dino-rampage-weed.jpg',
        youtubeUrl: 'https://www.youtube.com/watch?v=5cm3cV8IcBs',
        category: 'FiveM',
        description: language === 'en'
          ? 'QBCORE After Smoking Grab the Fury and transform into a mighty Dinosaur, The script includes the cigar and edible items'
          : 'QBCORE Despues de Fumar abraza la furia y transformate en un Poderoso Dinosaurio, El Script cuenta con el cigarro y un comestible',
        features: language === 'en'
          ? ['Cigar', 'Edible', 'Dinosaurs', 'Discord https://discord.gg/wT4sRsnY9m']
          : ['Cigarro', 'Comestible', 'Dinosaurios', 'Discord https://discord.gg/wT4sRsnY9m']
      },
      { 
        id: 5, 
        name: language === 'en' ? 'Spirit Animal Weed' : 'Maria: Tu Animal Interno',
        price: 4.99, 
        image: '/images/products/spirit-animal-weed.jpg',
        youtubeUrl: 'https://www.youtube.com/watch?v=5cm3cV8IcBs',
        category: 'FiveM',
        description: language === 'en'
          ? 'QBCORE After Smoking you suffer the effect of your spirit animal, dont panic just enjoy the ride, The script includes the cigar and edible items'
          : 'QBCORE Después de Fumar sufriras los efectos de tu Animal Interno no entres en panico solo disfruta el viaje, El Script cuenta con el cigarro y un comestible',
        features: language === 'en'
          ? ['Cigar', 'Edible', 'Animals', 'Discord https://discord.gg/wT4sRsnY9m']
          : ['Cigarro', 'Comestible', 'Animales', 'Discord https://discord.gg/wT4sRsnY9m']
      },
      { 
        id: 6, 
        name: language === 'en' ? 'Undead Nightmare Weed' : 'Maria: Pesadilla Zombie',
        price: 4.99, 
        image: '/images/products/undead-nightmare-weed.jpg',
        youtubeUrl: 'https://www.youtube.com/watch?v=LIB2N7bdNaw',
        category: 'FiveM',
        description: language === 'en'
          ? 'QBCORE After Smoking you suffer the effect of the undead, The script includes the cigar and edible items'
          : 'QBCORE Después de Fumar sufriras los efectos de la Ultratumba, El Script cuenta con el cigarro y un comestible',
        features: language === 'en'
          ? ['Cigar', 'Edible', 'Zombies', 'Discord https://discord.gg/wT4sRsnY9m']
          : ['Cigarro', 'Comestible', 'Zombies', 'Discord https://discord.gg/wT4sRsnY9m']
      },
      { 
        id: 7, 
        name: language === 'en' ? 'Personal Assistant' : 'Asistencia Personalizada',
        price: 20.00, 
        image: '/images/products/personal-assistant.jpg',
        youtubeUrl: null,
        category: 'Fivem',
        description: language === 'en'
          ? 'If you’re having any issues with your FiveM server, or if you want to start your own server but don’t know how — our team is here to help you every step of the way!'
          : '¿Tienes problemas con tu servidor de FiveM? ¿O quieres crear uno desde cero y no sabes por dónde empezar?',
        features: language === 'en'
          ? ['Personal Asistance', '24/7', 'Discord https://discord.gg/wT4sRsnY9m']
          : ['Asistencia Personalizada', '24/7', 'Discord https://discord.gg/wT4sRsnY9m']
      },
      { 
        id: 8, 
        name: language === 'en' ? 'Advanced Backpack System' : 'Sistema Avanzado de Mochilas',
        price: 9.99, 
        image: '/images/products/advanced-backpack.jpg',
        youtubeUrl: 'https://www.youtube.com/watch?v=EXwkTaWr68o',
        category: 'Fivem',
        description: language === 'en'
          ? 'QBCORE ✨ Features: Custom Menu: user-friendly interface for seamless backpack access. 3 Backpack Sizes: Normal, Medium, and Large – perfect for any playstyle. Auto-Detection: Automatically supports a wide variety of inventories ox_inventory, qb-inventory, qs-inventory, lj-inventory, core_inventory, and more!. Easy Setup: Just drag & drop into your resources folder, add the items, and youre ready to go One-time purchase. Lifetime updates. Have fun 🚀'
		  : 'QBCORE ✨ Características: Menú custom: Interfaz elegante y fácil de usar para acceder a tu mochila. 3 Tamaños de Mochila: Normal, Mediana y Grande – ideal para cualquier estilo de juego. Detección Automática: Compatible automáticamente con una amplia variedad de inventarios (ox_inventory, qb-inventory, qs-inventory, lj-inventory, core_inventory, y más). Instalación Fácil: Solo arrastra y suelta en tu carpeta de recursos, añade los items y ¡listo! Compra única. Actualizaciones de por vida. ¡Diviértete! 🚀',
        features: language === 'en'
          ? ['Custom Menu', '3 Backpack Sizes', 'Auto-Detection', 'Discord https://discord.gg/wT4sRsnY9m']
          : ['Menú custom', '3 Tamaños de Mochila', 'Detección Automática', 'Discord https://discord.gg/wT4sRsnY9m']
      },
      { 
        id: 9, 
        name: language === 'en' ? '(Coming soon) Simulator Game Kit' : '(Próximamente) Kit de Juego Simulador',
        price: 9.99, 
        image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop',
        youtubeUrl: null,
        category: 'Roblox',
        description: language === 'en'
          ? 'Complete simulator game template with monetization'
          : 'Plantilla completa de juego simulador con monetización',
        features: language === 'en'
          ? ['Pet System', 'Rebirth System', 'Shop Integration']
          : ['Sistema de Mascotas', 'Sistema de Renacimiento', 'Integración de Tienda']
      }
    ];
  };

  const products = getProducts();
  const categories = ['All', 'FiveM', 'Minecraft', 'Roblox'];
  const filteredProducts = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);

  const makeLinksClickable = (text) => {
    if (!text) return '';
    return text.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 underline">$1</a>'
    );
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AV7C-Q-bBIgRhHJ7_OcwOCTnYtg3_EymCaSas83D69BiVuBTNR3V7uRDXhumcfsq7M3FELTAWFLld5rZ&currency=USD';
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!paypalLoaded || cart.length === 0 || !customerEmail) return;

    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    container.innerHTML = '';

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: total.toFixed(2),
              currency_code: 'USD',
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: total.toFixed(2)
                }
              }
            },
            items: cart.map(item => ({
              name: item.name,
              unit_amount: {
                currency_code: 'USD',
                value: item.price.toFixed(2)
              },
              quantity: item.quantity,
              category: 'DIGITAL_GOODS'
            }))
          }]
        });
      },
      onApprove: async (data, actions) => {
        setIsProcessing(true);
        try {
          const details = await actions.order.capture();
          
          const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderID: details.id,
              customerEmail: customerEmail,
              items: cart.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              totalAmount: total
            })
          });

          if (response.ok) {
            alert(`✅ Payment successful!\n\n📧 Download links have been sent to:\n${customerEmail}\n\nCheck your email (and spam folder) for your scripts!\n\nTransaction ID: ${details.id}`);
            setCart([]);
            setCustomerEmail('');
            setShowCart(false);
          } else {
            alert('Payment received, but there was an issue sending the download links. Please contact support with your transaction ID: ' + details.id);
          }
        } catch (error) {
          console.error('Order processing error:', error);
          alert('Payment successful, but please contact support for your download links. Transaction ID: ' + data.orderID);
        } finally {
          setIsProcessing(false);
        }
      },
      onError: (err) => {
        console.error('PayPal error:', err);
        alert('Payment failed. Please try again.');
        setIsProcessing(false);
      }
    }).render('#paypal-button-container');
  }, [paypalLoaded, cart, total, customerEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #9333ea;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a855f7;
        }
      `}</style>
      
      <header className="bg-black bg-opacity-50 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-purple-500">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">{t.shopName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 bg-opacity-30 hover:bg-opacity-50 rounded-lg transition text-white"
            >
              <Languages className="w-5 h-5" />
              <span className="text-sm font-semibold">{language === 'en' ? 'ES' : 'EN'}</span>
            </button>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 hover:bg-purple-800 hover:bg-opacity-30 rounded-lg transition"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">{t.hero.title}</h2>
          <p className="text-xl text-purple-100">{t.hero.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-3 flex-wrap justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              {cat === 'All' ? t.categories.all : cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition border border-purple-500 border-opacity-30">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {product.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <div 
                  className="text-gray-300 text-sm mb-3 max-h-20 overflow-y-auto pr-2 scrollbar-thin"
                  dangerouslySetInnerHTML={{ __html: makeLinksClickable(product.description) }}
                />
                
                <div className="mb-4">
                  <p className="text-xs text-purple-300 font-semibold mb-2">{t.features}</p>
                  <ul className="space-y-1 max-h-24 overflow-y-auto pr-2 scrollbar-thin">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-300 flex items-start gap-1">
                        <Download className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span dangerouslySetInnerHTML={{ __html: makeLinksClickable(feature) }} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-purple-500 border-opacity-30">
                  <span className="text-2xl font-bold text-white">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold"
                  >
                    {t.addToCart}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50" onClick={() => setShowCart(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-slate-900 to-purple-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-purple-500">
                <h2 className="text-2xl font-bold text-white">{t.cart.title}</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-300 hover:text-white text-2xl">
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                  <p>{t.cart.empty}</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 mb-4 pb-4 border-b border-purple-500 border-opacity-30">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          <p className="text-purple-300 text-sm">{item.category}</p>
                          <p className="text-white font-bold">${item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-purple-700 rounded bg-purple-600 bg-opacity-50"
                            >
                              <Minus className="w-4 h-4 text-white" />
                            </button>
                            <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-purple-700 rounded bg-purple-600 bg-opacity-50"
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto p-1 hover:bg-red-600 text-red-400 hover:text-white rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-purple-500 pt-4 mt-4">
                    <div className="flex justify-between text-xl font-bold mb-4 text-white">
                      <span>{t.cart.total}</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-purple-200 mb-2">
                        {t.cart.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => {
                          setCustomerEmail(e.target.value);
                          setEmailError('');
                        }}
                        placeholder={t.cart.emailPlaceholder}
                        className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                        required
                      />
                      {emailError && (
                        <p className="text-red-400 text-xs mt-1">{emailError}</p>
                      )}
                    </div>

                    <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-3">
                      <p className="text-xs text-purple-200 mb-1">{t.cart.delivery}</p>
                      <p className="text-xs text-purple-200">{t.cart.updates}</p>
                      <p className="text-xs text-purple-200 mt-2">🔒 Secure one-time download links</p>
                    </div>
                    
                    {isProcessing && (
                      <div className="text-center text-purple-300 py-3 mb-2">
                        {t.cart.processing}
                      </div>
                    )}
                    
                    {customerEmail && !isProcessing && (
                      <div id="paypal-button-container" className="mb-2"></div>
                    )}
                    
                    {!customerEmail && (
                      <div className="text-center text-purple-300 py-3 text-sm">
                        {t.cart.emailRequired}
                      </div>
                    )}
                    
                    {!paypalLoaded && customerEmail && (
                      <div className="text-center text-purple-300 py-3">
                        {t.cart.loading}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
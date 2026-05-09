import React, { createContext, useState, useEffect } from 'react';

export const BakeryContext = createContext();

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`Could not save ${key} to localStorage. Quota exceeded or storage disabled.`);
  }
};

const defaultProducts = [
  { id: 1, name: 'Golden Almond Biscuits', price: 5, description: 'Inspired by grandmother\'s recipe, these biscuits feature double-toasted almonds and a hint of Himalayan salt.', image: '/biscuit.png' },
  { id: 2, name: 'Signature Cupcakes', price: 6, description: 'Each cupcake is hand-piped with our signature bourbon vanilla bean frosting.', image: '/cupcake.png' },
  { id: 3, name: 'Sourdough Boule', price: 12, description: 'Naturally leavened sourdough with a perfectly blistered crust.', image: '/sourdough.png' },
  { id: 4, name: 'Chocolate Tart', price: 8, description: 'Rich dark chocolate ganache in a buttery shortbread crust.', image: '/tart.png' },
];

const defaultUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' }
];

const defaultReviews = [
  { id: 1, text: "I look forward to her weekend drops all week! The almond biscuits are the perfect companion for my morning coffee.", author: "Elena Richardson", tag: "Local Coffee Lover", rating: 5 },
  { id: 2, text: "It's hard to believe these pastries are made in a home kitchen. The love and care put into every batch is so evident. Best side-hustle ever!", author: "Jameson Park", rating: 5 },
  { id: 3, text: "Our favorite professor by day, and our favorite baker by night. The sourdough is always fresh, warm, and incredible.", author: "Sarah Jenkins", tag: "Former Student", rating: 5 }
];

export const BakeryProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('bakeryRole') || 'guest';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('bakeryCurrentUser') || null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('bakeryUsers');
    if (saved) return JSON.parse(saved);
    return defaultUsers;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('bakeryProducts');
    if (saved) return JSON.parse(saved);
    return defaultProducts;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('bakeryOrders');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [allCarts, setAllCarts] = useState(() => {
    const saved = localStorage.getItem('bakeryCarts');
    if (saved) return JSON.parse(saved);
    return {};
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('bakeryReviews');
    if (saved) return JSON.parse(saved);
    return defaultReviews;
  });

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyhGqDX6O12YJMVpvpDX6U6H48JBcYDIQHiatL9PNvgUjElkSdAOGMp6KNsYO6l_oVV/exec";
  const [hasFetchedDB, setHasFetchedDB] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchData = React.useCallback(() => {
    if (GOOGLE_SCRIPT_URL === "PASTE_YOUR_URL_HERE" || GOOGLE_SCRIPT_URL === "") {
      setHasFetchedDB(true);
      return;
    }

    fetch(`${GOOGLE_SCRIPT_URL}?action=getData`)
      .then(res => res.json())
      .then(data => {
        if (data.users && data.users.length > 0) {
          const cleanUsers = data.users.filter(u => (u.username || u.Username));
          setUsers(cleanUsers);
        }
        if (data.products && data.products.length > 0) {
          // Filter out blank rows and duplicates by name
          const cleanProducts = data.products.filter(p => {
            const name = p.name || p.Name;
            return name && String(name).trim() !== "";
          });
          const uniqueProducts = Array.from(new Map(cleanProducts.map(p => [p.name || p.Name, p])).values());
          setProducts(uniqueProducts);
        }
        if (data.orders && data.orders.length > 0) {
          const cleanOrders = data.orders.filter(o => o.id || o.ID);
          setOrders(cleanOrders.map(o => ({ ...o, items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items })));
        }
        if (data.carts && data.carts.length > 0) {
          const cartsObj = {};
          data.carts.forEach(c => {
            if (c.username || c.Username) {
              const uName = c.username || c.Username;
              cartsObj[uName] = typeof c.items === 'string' ? JSON.parse(c.items) : c.items;
            }
          });
          setAllCarts(cartsObj);
        }
        if (data.reviews && data.reviews.length > 0) {
          const cleanReviews = data.reviews.filter(r => r.text || r.Text);
          setReviews(cleanReviews);
        }
        setHasFetchedDB(true);
      })
      .catch(err => {
        console.error("Failed to load from Google Sheets:", err);
        setHasFetchedDB(true);
      });
  }, [GOOGLE_SCRIPT_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const syncToSheet = React.useCallback((sheetName, data) => {
    if (hasFetchedDB && GOOGLE_SCRIPT_URL !== "PASTE_YOUR_URL_HERE" && GOOGLE_SCRIPT_URL !== "") {
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ sheet: sheetName, data: data })
      }).catch(console.error);
    }
  }, [hasFetchedDB, GOOGLE_SCRIPT_URL]);

  useEffect(() => {
    safeSetItem('bakeryProducts', JSON.stringify(products));
    // Only sync if it's a user action, not initial load
    if (hasFetchedDB) syncToSheet('Products', products);
  }, [products]);

  useEffect(() => {
    safeSetItem('bakeryUsers', JSON.stringify(users));
    if (hasFetchedDB) syncToSheet('Users', users);
  }, [users]);

  useEffect(() => {
    safeSetItem('bakeryOrders', JSON.stringify(orders));
    if (hasFetchedDB) syncToSheet('Orders', orders);
  }, [orders]);

  useEffect(() => {
    safeSetItem('bakeryCarts', JSON.stringify(allCarts));
    // Flatten carts object for Google Sheets storage
    const flatCarts = Object.keys(allCarts).map(username => ({
      username,
      items: JSON.stringify(allCarts[username])
    }));
    if (hasFetchedDB) syncToSheet('Carts', flatCarts);
  }, [allCarts]);

  useEffect(() => {
    safeSetItem('bakeryReviews', JSON.stringify(reviews));
    if (hasFetchedDB) syncToSheet('Reviews', reviews);
  }, [reviews]);

  useEffect(() => {
    safeSetItem('bakeryRole', role);
  }, [role]);

  useEffect(() => {
    if (currentUser) {
      safeSetItem('bakeryCurrentUser', currentUser);
    } else {
      localStorage.removeItem('bakeryCurrentUser');
    }
  }, [currentUser]);

  const activeUser = currentUser || 'guest';
  const cart = allCarts[activeUser] || [];

  const updateCart = (newCart) => {
    setAllCarts(prev => ({
      ...prev,
      [activeUser]: newCart
    }));
  };

  const login = (username, password) => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const user = users.find(u => {
      // Handle potential header variations (username vs Username)
      const uName = u.username || u.Username || u.USERNAME;
      const uPass = u.password || u.Password || u.PASSWORD;

      return String(uName).trim() === trimmedUsername && String(uPass).trim() === trimmedPassword;
    });

    if (user) {
      // Normalize role for consistent state
      const userRole = user.role || user.Role || 'user';
      const userName = user.username || user.Username || trimmedUsername;

      const guestCart = allCarts['guest'] || [];
      if (guestCart.length > 0) {
        setAllCarts(prev => {
          const userCart = prev[userName] || [];
          return {
            ...prev,
            [userName]: [...userCart, ...guestCart],
            'guest': []
          };
        });
      }

      setCurrentUser(userName);
      setRole(userRole);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const signup = (username, password) => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (users.find(u => (u.username || u.Username || "").toLowerCase() === trimmedUsername.toLowerCase())) {
      return { success: false, message: 'Username already exists' };
    }
    const newUser = { username: trimmedUsername, password: trimmedPassword, role: 'user' };
    setUsers([...users, newUser]);

    const guestCart = allCarts['guest'] || [];
    if (guestCart.length > 0) {
      setAllCarts(prev => ({
        ...prev,
        [trimmedUsername]: [...guestCart],
        'guest': []
      }));
    }

    setCurrentUser(trimmedUsername);
    setRole('user');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setRole('guest');
  };

  const addToCart = (product) => {
    updateCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    updateCart(newCart);
  };

  const placeOrder = (orderDetails = {}) => {
    if (cart.length === 0) return;

    const newOrder = {
      id: `ORD-${Date.now()}`,
      username: currentUser || 'guest',
      customerName: orderDetails.name || currentUser || 'Guest',
      date: new Date().toLocaleDateString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price, 0),
      ...orderDetails
    };

    setOrders([newOrder, ...orders]);
    updateCart([]); // Clear cart after order
  };

  const addProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: Date.now() }]);
  };

  const addReview = (newReview) => {
    setReviews([{ ...newReview, id: Date.now() }, ...reviews]);
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removeProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const userOrders = orders.filter(o => o.username === currentUser);

  const WHAPI_TOKEN = "mbTTNq04owGtriWLoY4Dw5Glwr5TG0HE";
  const OWNER_PHONE = "916301607490";

  const sendWhatsAppBotMessage = async (message) => {
    if (WHAPI_TOKEN === "PASTE_YOUR_WHAPI_TOKEN_HERE" || !WHAPI_TOKEN) {
      console.warn("Whapi Token not configured. Message not sent via bot.");
      return { success: false, error: "Token not configured" };
    }

    try {
      const response = await fetch("https://gate.whapi.cloud/messages/text", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHAPI_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: OWNER_PHONE,
          body: message
        })
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error("Whapi API Error:", error);
      return { success: false, error };
    }
  };

  return (
    <BakeryContext.Provider value={{
      role, currentUser, login, signup, logout,
      products, addProduct, updateProduct, removeProduct,
      orders: userOrders, placeOrder,
      cart, addToCart, removeFromCart,
      reviews, addReview,
      showAuthModal, setShowAuthModal,
      refreshData: fetchData,
      sendWhatsAppBotMessage
    }}>
      {children}
    </BakeryContext.Provider>
  );
};

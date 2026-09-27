export const initialData = {
  menu: [
    {
      id: "menu-1",
      name: "Paneer Tikka",
      category: "Starters",
      price: 280,
      description: "Char-grilled cottage cheese cubes marinated in aromatic mustard-infused tandoori spices with bell peppers and onions.",
      image: "https://images.unsplash.com/photo-1567184109411-b28f2780e054?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 2,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: true,
      ingredients: ["Fresh Cottage Cheese", "Hung Curd", "Mustard Oil", "Kashmiri Degi Chilli", "Garam Masala", "Capsicum"],
      addons: [
        { id: "add-1", name: "Extra Cheese Melt", price: 40 },
        { id: "add-2", name: "Spicy Tandoori Chutney", price: 20 },
        { id: "add-3", name: "Creamy Mint Dip", price: 25 }
      ]
    },
    {
      id: "menu-2",
      name: "Chicken 65",
      category: "Starters",
      price: 340,
      description: "Crispy fried boneless chicken bites tossed with fresh curry leaves, crushed pepper, green chillies, and southern spices.",
      image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
      isVeg: false,
      spiceLevel: 3,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: false,
      ingredients: ["Boneless Chicken", "Curry Leaves", "Southern Spice Blend", "Ginger Garlic", "Lemon Juice"],
      addons: [
        { id: "add-4", name: "Pickled Onion Relish", price: 20 },
        { id: "add-5", name: "Garlic Mayo", price: 30 }
      ]
    },
    {
      id: "menu-3",
      name: "Veg Spring Roll",
      category: "Starters",
      price: 220,
      description: "Crisp golden pastry wrappers loaded with seasoned cabbage, carrots, bell peppers, and scallions, served with sweet chilli relish.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 1,
      isAvailable: true,
      isPopular: false,
      isChefSpecial: false,
      ingredients: ["Spring Pastry Sheet", "Shredded Cabbage", "Carrot", "Spring Onions", "Sesame Oil"],
      addons: [
        { id: "add-6", name: "Sweet Chilli Dip", price: 25 },
        { id: "add-7", name: "Schezwan Sauce", price: 25 }
      ]
    },
    {
      id: "menu-4",
      name: "Tandoori Malai Broccoli",
      category: "Starters",
      price: 290,
      description: "Tender broccoli florets steeped in velvety cream cheese, toasted cardamom, and crushed black pepper, flame-blistered in clay oven.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 0,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: true,
      ingredients: ["Farm Fresh Broccoli", "Cream Cheese", "Green Cardamom", "White Pepper", "Cashew Paste"],
      addons: [
        { id: "add-8", name: "Extra Toasted Cashews", price: 35 }
      ]
    },
    {
      id: "menu-5",
      name: "Butter Chicken",
      category: "Main Course",
      price: 420,
      description: "Charcoal-roasted succulent chicken morsels simmered in a silky tomato, cashew cream, and fragrant kasuri methi gravy.",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
      isVeg: false,
      spiceLevel: 1,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: true,
      ingredients: ["Tandoori Chicken", "San Marzano Style Tomatoes", "Cashew Cream", "Amul Butter", "Fenugreek Leaves"],
      addons: [
        { id: "add-9", name: "Extra Butter Float", price: 30 },
        { id: "add-10", name: "Shredded Chicken Top-up", price: 60 }
      ]
    },
    {
      id: "menu-6",
      name: "Paneer Butter Masala",
      category: "Main Course",
      price: 360,
      description: "Creamy cubes of fresh malai paneer bathed in an aromatic, rich, and mildly sweet tomato and butter reduction.",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 1,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: false,
      ingredients: ["Fresh Cottage Cheese", "Ripe Tomatoes", "Butter", "Fresh Cream", "Aromatic Spices"],
      addons: [
        { id: "add-11", name: "Extra Paneer Cubes", price: 45 },
        { id: "add-12", name: "Fresh Cream Swirl", price: 20 }
      ]
    },
    {
      id: "menu-7",
      name: "Dal Makhani",
      category: "Main Course",
      price: 310,
      description: "Traditional slow-cooked overnight black lentils enriched with churned butter and dairy cream on slow charcoal embers.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 0,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: true,
      ingredients: ["Whole Urad Dal", "Rajma", "Churned White Butter", "Fresh Cream", "Garlic Ginger Paste"],
      addons: [
        { id: "add-13", name: "Desi Ghee Tadka", price: 25 }
      ]
    },
    {
      id: "menu-8",
      name: "Mutton Rogan Josh",
      category: "Main Course",
      price: 490,
      description: "Tender mountain goat braised in an opulent crimson gravy perfumed with Kashmiri dried chillies, fennel seeds, and ratanjot.",
      image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80",
      isVeg: false,
      spiceLevel: 2,
      isAvailable: true,
      isPopular: false,
      isChefSpecial: true,
      ingredients: ["Tender Lamb/Goat Cuts", "Kashmiri Mirch", "Fennel Powder", "Yogurt Gravy", "Cinnamon & Cloves"],
      addons: [
        { id: "add-14", name: "Extra Bone Broth Reduction", price: 40 }
      ]
    },
    {
      id: "menu-9",
      name: "Garlic Naan",
      category: "Breads",
      price: 75,
      description: "Traditional leavened clay-oven flatbread smothered with roasted minced garlic, freshly chopped coriander, and melted butter.",
      image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 0,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: false,
      ingredients: ["Refined Flour", "Minced Garlic", "Coriander Leaves", "Pure Ghee/Butter"],
      addons: [
        { id: "add-15", name: "Cheese Burst Filling", price: 35 }
      ]
    },
    {
      id: "menu-10",
      name: "Butter Naan",
      category: "Breads",
      price: 65,
      description: "Pillow-soft, multi-fold tandoori naan brushed generously with pure dairy butter.",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 0,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: false,
      ingredients: ["Refined Wheat Flour", "Milk", "Butter", "Yeast"],
      addons: []
    },
    {
      id: "menu-11",
      name: "Chicken Dum Biryani",
      category: "Rice & Biryani",
      price: 410,
      description: "Aged Kohinoor basmati rice cooked on slow dum with aromatic spices, caramelized onions, fresh mint, and tender bone-in chicken.",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
      isVeg: false,
      spiceLevel: 2,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: true,
      ingredients: ["Royal Basmati Rice", "Tender Chicken Pieces", "Saffron Milk", "Crispy Birista Onions", "Mint & Coriander"],
      addons: [
        { id: "add-16", name: "Boiled Egg (2 pcs)", price: 30 },
        { id: "add-17", name: "Special Mirchi Ka Salan", price: 25 },
        { id: "add-18", name: "Burani Garlic Raita", price: 35 }
      ]
    },
    {
      id: "menu-12",
      name: "Veg Dum Biryani",
      category: "Rice & Biryani",
      price: 320,
      description: "Layers of fragrant saffron-infused basmati rice, garden vegetables, paneer cubes, and caramelized brown shallots in earthen handi.",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 1,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: false,
      ingredients: ["Basmati Rice", "Cottage Cheese", "French Beans", "Carrots", "Mint Gravy", "Kewra Water"],
      addons: [
        { id: "add-19", name: "Mixed Veg Raita", price: 30 }
      ]
    },
    {
      id: "menu-13",
      name: "Gulab Jamun with Rabdi",
      category: "Desserts",
      price: 180,
      description: "Twin warm golden fried milk dumplings infused with green cardamom syrup, layered over chilled condensed slow-reduced rabdi.",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 0,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: true,
      ingredients: ["Mawa/Khoya", "Cardamom Sugar Syrup", "Thick Rabdi", "Pistachio Slivers", "Silver Leaf"],
      addons: [
        { id: "add-20", name: "Extra Warm Jamun", price: 40 }
      ]
    },
    {
      id: "menu-14",
      name: "Sizzling Walnut Brownie",
      category: "Desserts",
      price: 240,
      description: "Decadent dark Belgian chocolate and roasted walnut fudge brownie served bubbling on a cast-iron skillet with Madagascar vanilla scoop.",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 0,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: false,
      ingredients: ["Belgian Dark Chocolate", "California Walnuts", "Vanilla Bean Ice Cream", "Hot Chocolate Ganache"],
      addons: [
        { id: "add-21", name: "Extra Scoop Vanilla", price: 50 },
        { id: "add-22", name: "Hot Fudge Drizzle", price: 30 }
      ]
    },
    {
      id: "menu-15",
      name: "Fresh Lime Soda",
      category: "Beverages",
      price: 110,
      description: "Zesty freshly squeezed hand-pressed lemons, sparkling chilled club soda, rock salt, and mint leaves (Sweet, Salted, or Mixed).",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 0,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: false,
      ingredients: ["Fresh Lime", "Club Soda", "Mint", "Black Salt", "Simple Syrup"],
      addons: []
    },
    {
      id: "menu-16",
      name: "Mango Lassi",
      category: "Beverages",
      price: 140,
      description: "Traditional thick blended artisanal yogurt with sweet Ratnagiri Alphonso mango pulp, saffron, and sliced almonds.",
      image: "https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 0,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: true,
      ingredients: ["Whole Milk Yogurt", "Alphonso Mango Pulp", "Green Cardamom", "Pistachio Flakes"],
      addons: [
        { id: "add-23", name: "Chia Seeds Topping", price: 20 }
      ]
    },
    {
      id: "menu-17",
      name: "Masala Chai",
      category: "Beverages",
      price: 70,
      description: "Authentic slow-simmered Assam whole leaf tea infused with crushed fresh ginger, green cardamom pods, and lemongrass.",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      spiceLevel: 0,
      isAvailable: true,
      isPopular: true,
      isChefSpecial: false,
      ingredients: ["Assam CTC Tea", "Crushed Ginger", "Cardamom", "Fresh Cow Milk"],
      addons: []
    }
  ],

  events: [
    {
      id: "event-1",
      title: "Weekend Candlelight Dinner",
      date: "Every Friday & Saturday",
      time: "7:00 PM – 11:00 PM",
      description: "Immerse in an intimate, softly lit dining experience accompanied by gentle acoustic jazz, handpicked wine pairings, and a complimentary amuse-bouche.",
      discount: "15% OFF",
      offerText: "Complimentary Chef's Dessert Platter with reservations of 2 or more.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      availableSeats: 24,
      isActive: true
    },
    {
      id: "event-2",
      title: "Live Acoustic Sufi Night",
      date: "Upcoming Sunday",
      time: "8:00 PM – 10:30 PM",
      description: "A soulful musical evening featuring live acoustic sitar and Sufi fusion renditions while you savor our charcoal kebabs and royal biryanis.",
      discount: "20% OFF",
      offerText: "20% off on all signature starters during the performance.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      availableSeats: 18,
      isActive: true
    },
    {
      id: "event-3",
      title: "Grand Family Sunday Brunch",
      date: "Every Sunday",
      time: "12:00 PM – 4:00 PM",
      description: "The ultimate 50+ item lavish buffet feast featuring live chaat counters, dim sum stations, slow-dum biryanis, and an interactive dessert bar.",
      discount: "Kids Dine Free",
      offerText: "Children under 8 dine complimentary with family reservations.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      availableSeats: 35,
      isActive: true
    },
    {
      id: "event-4",
      title: "Royal Awadhi Degustation Festival",
      date: "Limited Edition (This Week)",
      time: "7:30 PM – 10:30 PM",
      description: "Curated 5-course heritage tasting menu hand-crafted by our Master Chef, celebrating lost recipes from the royal kitchens of Lucknow.",
      discount: "Special Tasting",
      offerText: "Includes customized culinary storytelling and signature dessert pairing.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      availableSeats: 12,
      isActive: true
    }
  ],

  timeSlots: [
    { id: "slot-1", startTime: "12:00 PM", endTime: "01:30 PM", maxBookings: 12, availableSeats: 8, isActive: true },
    { id: "slot-2", startTime: "01:30 PM", endTime: "03:00 PM", maxBookings: 15, availableSeats: 11, isActive: true },
    { id: "slot-3", startTime: "06:00 PM", endTime: "07:00 PM", maxBookings: 12, availableSeats: 9, isActive: true },
    { id: "slot-4", startTime: "07:00 PM", endTime: "08:00 PM", maxBookings: 18, availableSeats: 14, isActive: true },
    { id: "slot-5", startTime: "08:00 PM", endTime: "09:00 PM", maxBookings: 18, availableSeats: 5, isActive: true },
    { id: "slot-6", startTime: "09:00 PM", endTime: "10:00 PM", maxBookings: 15, availableSeats: 7, isActive: true },
    { id: "slot-7", startTime: "10:00 PM", endTime: "11:00 PM", maxBookings: 10, availableSeats: 8, isActive: true }
  ],

  pricing: {
    vipSeatPrice: 450,
    normalSeatPrice: 200,
    acRoomPrice: 2500,
    acRoomLabel: "Recommended",
    nonAcRoomPrice: 1800,
    nonAcRoomLabel: "Budget Friendly"
  },

  settings: {
    restaurantName: "SUNSHINE",
    subtitle: "Restaurant & Dining Experience",
    tagline: "Good food. Great moments.",
    heroTitle: "Good food. Great moments.",
    heroSubtitle: "Fine Gastronomy & Artisanal Dining",
    heroDescription: "Discover fresh flavours, memorable dining and experiences made for every occasion. From slow-simmered handi delicacies to sizzling clay-oven grills.",
    announcement: "Grand Awadhi Degustation Festival this weekend • Complimentary Chef's Tasting with reservations of 4 or more!",
    announcementEnabled: true,
    announcementLink: "/events",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "concierge@sunshinerestaurant.com",
    address: "Plot 42, Sunshine Boulevard, Gourmet Enclave, Jubilee Hills, Hyderabad, Telangana 500033",
    googleMapsUrl: "https://maps.google.com/?q=Plot+42,+Sunshine+Boulevard,+Gourmet+Enclave,+Jubilee+Hills,+Hyderabad,+Telangana+500033",
    openingTime: "11:00 AM",
    closingTime: "11:30 PM",
    businessDays: "Monday – Sunday (Open 7 Days)",
    aboutText: "SUNSHINE is born out of a deep reverence for fine culinary traditions, exquisite ingredients, and memorable gatherings. Every meal is an unhurried journey through vibrant spices, artisanal presentation, and heartfelt warmth.",
    footerAboutText: "Crafted with culinary reverence, locally-sourced produce, and centuries of authentic gastronomy.",
    footerCopyright: "SUNSHINE Restaurant & Dining Experience. All rights reserved.",
    currency: "₹",
    gstPercent: 5
  },

  bookings: [
    {
      id: "SUN-2026-00128",
      token: "A7K42",
      customerName: "Rahul Sharma",
      phone: "+91 98111 23456",
      email: "rahul.sharma@example.com",
      date: "2026-09-23",
      time: "07:30 PM",
      guests: 4,
      bookingType: "Dinner",
      roomType: "VIP Table",
      amount: 1800,
      status: "Confirmed",
      specialRequest: "Window side table requested with anniversary rose petals.",
      createdAt: "2026-09-21T14:30:00.000Z"
    },
    {
      id: "SUN-2026-00129",
      token: "B9X11",
      customerName: "Priya Nair",
      phone: "+91 98222 34567",
      email: "priya.nair@example.com",
      date: "2026-09-23",
      time: "08:00 PM",
      guests: 6,
      bookingType: "Birthday",
      roomType: "AC Room",
      amount: 2500,
      status: "Pending",
      specialRequest: "Bringing birthday cake, please arrange candles and plates.",
      createdAt: "2026-09-22T09:15:00.000Z"
    },
    {
      id: "SUN-2026-00130",
      token: "R4M88",
      customerName: "Vikram Malhotra",
      phone: "+91 98333 45678",
      email: "vikram.m@example.com",
      date: "2026-09-22",
      time: "08:30 PM",
      guests: 2,
      bookingType: "Anniversary",
      roomType: "VIP Table",
      amount: 900,
      status: "Checked In",
      specialRequest: "Quiet booth, no loud music.",
      createdAt: "2026-09-22T11:00:00.000Z"
    },
    {
      id: "SUN-2026-00131",
      token: "K2N55",
      customerName: "Ananya Deshmukh",
      phone: "+91 98444 56789",
      email: "ananya.d@example.com",
      date: "2026-09-22",
      time: "01:30 PM",
      guests: 5,
      bookingType: "Family Gathering",
      roomType: "Normal",
      amount: 1000,
      status: "Completed",
      specialRequest: "High chair for infant needed.",
      createdAt: "2026-09-20T16:45:00.000Z"
    },
    {
      id: "SUN-2026-00132",
      token: "C8T33",
      customerName: "Sanjay Patel",
      phone: "+91 98555 67890",
      email: "sanjay.p@example.com",
      date: "2026-09-21",
      time: "07:00 PM",
      guests: 3,
      bookingType: "Dining",
      roomType: "Normal",
      amount: 600,
      status: "Cancelled",
      specialRequest: "Flight delayed.",
      createdAt: "2026-09-19T18:20:00.000Z"
    },
    {
      id: "SUN-2026-00133",
      token: "F5V92",
      customerName: "Meera Reddy",
      phone: "+91 98666 78901",
      email: "meera.reddy@example.com",
      date: "2026-09-24",
      time: "08:00 PM",
      guests: 8,
      bookingType: "Private Event",
      roomType: "AC Room",
      amount: 3200,
      status: "Confirmed",
      specialRequest: "Corporate dinner with client presentation.",
      createdAt: "2026-09-22T13:40:00.000Z"
    }
  ],

  customers: [
    {
      id: "cust-1",
      name: "Rahul Sharma",
      phone: "+91 98111 23456",
      email: "rahul.sharma@example.com",
      bookingsCount: 4,
      totalSpend: 7850,
      lastVisit: "2026-09-21",
      status: "VIP Guest"
    },
    {
      id: "cust-2",
      name: "Priya Nair",
      phone: "+91 98222 34567",
      email: "priya.nair@example.com",
      bookingsCount: 2,
      totalSpend: 4200,
      lastVisit: "2026-08-15",
      status: "Regular"
    },
    {
      id: "cust-3",
      name: "Vikram Malhotra",
      phone: "+91 98333 45678",
      email: "vikram.m@example.com",
      bookingsCount: 6,
      totalSpend: 14600,
      lastVisit: "2026-09-22",
      status: "VIP Guest"
    },
    {
      id: "cust-4",
      name: "Ananya Deshmukh",
      phone: "+91 98444 56789",
      email: "ananya.d@example.com",
      bookingsCount: 3,
      totalSpend: 5400,
      lastVisit: "2026-09-22",
      status: "Regular"
    },
    {
      id: "cust-5",
      name: "Meera Reddy",
      phone: "+91 98666 78901",
      email: "meera.reddy@example.com",
      bookingsCount: 5,
      totalSpend: 19800,
      lastVisit: "2026-09-10",
      status: "Corporate"
    }
  ],

  reviews: [
    {
      id: "rev-1",
      customerName: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      rating: 5,
      category: "Food",
      review: "The Paneer Tikka was world-class! Authentic char-grilled spices and exceptionally fresh cottage cheese.",
      menuItemId: "menu-1",
      bookingId: "SUN-2026-00128",
      status: "Published",
      createdAt: "2026-09-22T19:30:00.000Z"
    },
    {
      id: "rev-p1",
      customerName: "Sneha Kapur",
      email: "sneha.k@example.com",
      rating: 5,
      category: "Food",
      review: "Melt in mouth texture with the perfect touch of mustard oil, hung curd marinade and smokiness.",
      menuItemId: "menu-1",
      bookingId: "SUN-2026-00129",
      status: "Published",
      createdAt: "2026-09-21T18:00:00.000Z"
    },
    {
      id: "rev-p2",
      customerName: "Rohan Varma",
      email: "rohan.v@example.com",
      rating: 4,
      category: "Food",
      review: "Loved the smoky tandoor flavour and the fresh bell peppers. Highly recommended starter.",
      menuItemId: "menu-1",
      bookingId: "SUN-2026-00130",
      status: "Published",
      createdAt: "2026-09-20T17:15:00.000Z"
    },
    {
      id: "rev-2",
      customerName: "Priya Nair",
      email: "priya.nair@example.com",
      rating: 5,
      category: "Overall Experience",
      review: "Celebrated our family birthday in the AC private dining room. The concierge attention and quick token check-in were impeccable.",
      menuItemId: null,
      bookingId: "SUN-2026-00129",
      status: "Published",
      createdAt: "2026-09-21T21:15:00.000Z"
    },
    {
      id: "rev-3",
      customerName: "Vikram Malhotra",
      email: "vikram.m@example.com",
      rating: 4,
      category: "Food",
      review: "The Chicken 65 had amazing crunch, aroma of curry leaves and well balanced heat.",
      menuItemId: "menu-2",
      bookingId: "SUN-2026-00130",
      status: "Published",
      createdAt: "2026-09-20T20:45:00.000Z"
    },
    {
      id: "rev-c2",
      customerName: "Pooja Hegde",
      email: "pooja.h@example.com",
      rating: 5,
      category: "Food",
      review: "Very flavourful, spicy and crunchy on the outside. Authentic southern restaurant spice blend.",
      menuItemId: "menu-2",
      bookingId: "SUN-2026-00131",
      status: "Published",
      createdAt: "2026-09-19T21:00:00.000Z"
    },
    {
      id: "rev-4",
      customerName: "Ananya Deshmukh",
      email: "ananya.d@example.com",
      rating: 5,
      category: "Ambience",
      review: "Exquisite interior aesthetic, soft lighting, and gentle sitar acoustics. The Tandoori Malai Broccoli is a culinary masterpiece.",
      menuItemId: "menu-4",
      bookingId: "SUN-2026-00131",
      status: "Published",
      createdAt: "2026-09-19T14:10:00.000Z"
    },
    {
      id: "rev-b1",
      customerName: "Kunal Ghosh",
      email: "kunal.g@example.com",
      rating: 5,
      category: "Food",
      review: "Silky smooth Butter Chicken gravy with rich cashew paste and butter notes. Pairs delightfully with garlic naan.",
      menuItemId: "menu-5",
      bookingId: "SUN-2026-00132",
      status: "Published",
      createdAt: "2026-09-21T19:45:00.000Z"
    },
    {
      id: "rev-d1",
      customerName: "Swati Sen",
      email: "swati.s@example.com",
      rating: 5,
      category: "Food",
      review: "Slow-simmered perfection overnight. The Dal Makhani is rich, creamy, and heavenly.",
      menuItemId: "menu-7",
      bookingId: "SUN-2026-00133",
      status: "Published",
      createdAt: "2026-09-18T19:30:00.000Z"
    },
    {
      id: "rev-cb1",
      customerName: "Farhan Ali",
      email: "farhan.a@example.com",
      rating: 5,
      category: "Food",
      review: "Aromatic long-grain basmati with deeply infused saffron and succulent chicken pieces. Royal taste.",
      menuItemId: "menu-11",
      bookingId: "SUN-2026-00134",
      status: "Published",
      createdAt: "2026-09-20T13:30:00.000Z"
    },
    {
      id: "rev-g1",
      customerName: "Deepa Menon",
      email: "deepa.m@example.com",
      rating: 5,
      category: "Food",
      review: "Warm gulab jamuns bathed in thick cardamom rabdi. Unforgettable dessert ending.",
      menuItemId: "menu-13",
      bookingId: "SUN-2026-00135",
      status: "Published",
      createdAt: "2026-09-17T21:45:00.000Z"
    },
    {
      id: "rev-5",
      customerName: "Meera Reddy",
      email: "meera.reddy@example.com",
      rating: 5,
      category: "Booking Experience",
      review: "Seamless digital reservation with the instant 5-digit token. Zero waiting at the reception!",
      menuItemId: null,
      bookingId: "SUN-2026-00133",
      status: "Published",
      createdAt: "2026-09-18T18:00:00.000Z"
    }
  ],

  dashboardStats: {
    totalBookings: 128,
    todayBookings: 24,
    pending: 5,
    confirmed: 16,
    cancelled: 3,
    todayRevenue: 48650
  }
};

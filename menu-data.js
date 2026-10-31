// Areca - The Culinary Destination by La-Flora (Timeless Memories)
// 100% Exact text matching DOC-20261026-WA0031.pdf

const RESTAURANT_INFO = {
  name: "Areca",
  tagline: "THE CULINARY DESTINATION",
  by: "BY La-Flora",
  bySubtitle: "TIMELESS MEMORIES",
  contact: "97379 82028",
  location: "Areca, La Flora, Ville Flora",
  timings: [
    { name: "Breakfast", hours: "7:00 AM – 10:30 AM" },
    { name: "Lunch", hours: "12:00 PM – 3:30 PM" },
    { name: "Dinner", hours: "7:00 PM – 11:00 PM" },
    { name: "Round The Clock", hours: "4:30 PM to 6:30 PM" }
  ],
  pleaseNote: [
    "Timings may vary on special occasions and holidays.",
    "Last order will be accepted 30 minutes before closing.",
    "Please inform our team about any food allergies or dietary requirements before ordering.",
    "Jain / special dietary preparations are available on request, subject to availability.",
    "Prices are inclusive/exclusive of applicable taxes mention whichever applies.",
    "Outside food and beverages are not permitted."
  ],
  reservations: "For reservations, celebrations or special requests, please contact our restaurant team."
};

const MENU_SECTIONS = [
  {
    id: "breakfast-menu",
    title: "Breakfast Menu",
    timing: "(Timings 7:00 Am to 10:30 Am)",
    categoryNote: "Breakfast Menu",
    items: [
      {
        name: "SEASONAL CUT FRUIT PLATTER",
        price: "₹175",
        desc: "Watermelon, Pineapple, Papaya, Apple and Banana"
      },
      {
        name: "CEREALS - CHOOSE ANY ONE",
        price: "₹175",
        desc: "Corn Flakes/Wheat Flakes/Chocos/Muesli with Cold or Hot Milk."
      },
      {
        name: "CHOICE OF BREADS",
        price: "₹100",
        desc: "Toast - White/Brown/Multigrain."
      },
      {
        name: "CHOICE OF ANY ONE PARATHA",
        price: "₹125",
        desc: "Aloo/Gobi/Paneer/Pyaz\n(Grilled North Indian whole-wheat with a choice of filling served with plain yoghurt and pickle)."
      },
      {
        name: "POORI BHAJI",
        price: "₹150",
        desc: "Whole wheat fried Indian Bread with a spiced potato curry."
      },
      {
        name: "POHA",
        price: "₹125",
        desc: "Pressed rice tempered with spices, mustard seeds, potatoes, and peanuts, served with chopped onion and lemon."
      },
      {
        name: "DOSA",
        price: "₹120",
        desc: "Paper-thin rice pancake served with sambar, coconut chutney, and tomato-ginger chutney."
      },
      {
        name: "UTTAPAM",
        price: "₹90",
        desc: "Traditional rice pancake topped with onion and tomato, served with sambar, coconut chutney, and tomato-ginger chutney."
      },
      {
        name: "IDLI",
        price: "₹120",
        desc: "Steamed rice dumplings served with South Indian lentil stew and a trio of coconut, tomato, and coriander chutneys."
      },
      {
        name: "FRESH JUICE",
        price: "₹125",
        desc: "Watermelon/Pineapple/Orange."
      },
      {
        name: "COLD COFFEE",
        price: "₹160",
        desc: "Coffee blended with chilled milk, sugar syrup, and ice until thick and frothy."
      }
    ]
  },
  {
    id: "soup",
    title: "Soup",
    parentTitle: "Areca Menu",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "THUKPA SOUP",
        price: "₹220",
        desc: "Hot & spicy noodle soup with fresh vegetables."
      },
      {
        name: "BURMESE SOUP",
        price: "₹220",
        desc: "Creamy coconut-turmeric curry soup with noodles & veggies."
      },
      {
        name: "VEGETABLE MANCHOW SOUP",
        price: "₹220",
        desc: "A dark brown, hot and spicy Indo-Chinese soup."
      },
      {
        name: "VEGETABLE HOT & SOUR SOUP",
        price: "₹220",
        desc: "Spicy and tangy broth with finely chopped vegetables."
      },
      {
        name: "SWEET CORN SOUP",
        price: "₹220",
        desc: "A warm, slightly thick soup."
      },
      {
        name: "ROASTED TOMATO SOUP WITH BASIL",
        price: "₹220",
        desc: "Sweet & savoury tomato broth with croutons."
      },
      {
        name: "CREAM OF MUSHROOM SOUP",
        price: "₹220",
        desc: "Creamy mushroom broth with cheesy dumplings."
      },
      {
        name: "BROCCOLI ALMOND SOUP",
        price: "₹220",
        desc: "A healthy, creamy broccoli soup enriched with almonds."
      },
      {
        name: "TOMATO SOUP",
        price: "₹220",
        desc: "A classic soup made primarily from tomatoes."
      }
    ]
  },
  {
    id: "shorba",
    title: "Shorba",
    parentTitle: "Areca Menu",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "DAL NARIYAL KA SHORBA",
        price: "₹220",
        desc: "A blend of lentil broth and coconut milk."
      },
      {
        name: "MAKAI NARIYAL KA SHORBA",
        price: "₹220",
        desc: "Creamy and healthy shorba made from sweet corn and coconut milk."
      },
      {
        name: "DAL DHANIYA SHORBA",
        price: "₹220",
        desc: "Indian soup made with yellow moong dal, masoor dal, fresh coriander stems, and whole spices."
      }
    ]
  },
  {
    id: "salads-accompaniments",
    title: "Salads & Accompaniments",
    parentTitle: "Areca Menu",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "CITRUS CRUNCH SALAD",
        price: "₹225",
        desc: "Charred corn & onion with orange maple dressing."
      },
      {
        name: "GARDEN GREEN SALAD",
        price: "₹225",
        desc: "Carrot, cucumber, tomato, onion, chilli & lemon."
      },
      {
        name: "SOM TUM SALAD",
        price: "₹225",
        desc: "Raw papaya salad with Thai chilli & peanuts."
      },
      {
        name: "VAN ZEST SALAD",
        price: "₹225",
        desc: "Mixed lettuce with carrot dressing."
      },
      {
        name: "GREEK SALAD",
        price: "₹225",
        desc: "Fresh tomatoes, cucumber, onions, bell peppers, olives, and feta cheese tossed with a light herb dressing."
      },
      {
        name: "SPROUT CHAAT",
        price: "₹225",
        desc: "Fresh sprouts tossed with chopped vegetables, herbs, lemon juice, and aromatic chaat masala for a light and flavorful Indian snack."
      },
      {
        name: "CAESAR SALAD",
        price: "₹225",
        desc: "Crisp romaine lettuce tossed with creamy Caesar dressing, Parmesan cheese, and crunchy croutons."
      },
      {
        name: "ROASTED PAPAD",
        price: "₹110",
        desc: "Lightly roasted papad, served crisp."
      },
      {
        name: "MASALA PAPAD",
        price: "₹150",
        desc: "Papad topped with onion, tomato, coriander, lemon and spices."
      },
      {
        name: "CHOICE OF RAITA",
        price: "₹140",
        desc: "Vegetable/Boondi/Fruit/Burani."
      },
      {
        name: "PLAIN CURD",
        price: "₹120",
        desc: "Classic, unflavored yogurt with a smooth texture and a naturally tangy finish."
      }
    ]
  },
  {
    id: "oriental-starters",
    title: "Oriental Starters",
    parentTitle: "Areca Menu",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "SPICY PANEER DUMPLING",
        price: "₹300",
        desc: "Crispy dumplings stuffed with paneer, served with spicy sauce."
      },
      {
        name: "THAI-STYLE SPRING ROLL",
        price: "₹270",
        desc: "Traditional Thai wraps stuffed with julienned vegetables."
      },
      {
        name: "DRY MANCHURIAN",
        price: "₹220",
        desc: "Crispy deep-fried veg. balls tossed in a thick, sticky, and glossy umami sauce."
      },
      {
        name: "WOK-TOSSED DRY CHILLI PANEER",
        price: "₹275",
        desc: "Spicy Oriental preparation of cottage cheese tossed with bell peppers and onions."
      },
      {
        name: "CRISPY WONTON",
        price: "₹300",
        desc: "Crispy stuffed wontons."
      },
      {
        name: "HOUSE SURPRISE DIM SUM",
        price: "₹375",
        desc: "Chef’s special assorted dim sum."
      }
    ]
  },
  {
    id: "tandoor-e-zaika",
    title: "Tandoor-e-zaika",
    parentTitle: "Areca Menu",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "OG PANEER TIKKA",
        price: "₹350",
        desc: "Paneer marinated in traditional Indian spices."
      },
      {
        name: "TANDOORI BHARWAN MUSHROOM",
        price: "₹375",
        desc: "Mushrooms stuffed with spices & cheese."
      },
      {
        name: "DAHI KE KEBAB",
        price: "₹300",
        desc: "Creamy kebabs made with curd & kataifi."
      },
      {
        name: "PERI-PERI PANEER TIKKA",
        price: "₹350",
        desc: "Paneer marinated in peri-peri sauce."
      },
      {
        name: "MATAR KAJU SEEKH KEBAB",
        price: "₹375",
        desc: "Mashed green peas & cashew kebabs."
      },
      {
        name: "HOUSE CHAAP",
        price: "₹275",
        desc: "Spicy tandoori chaap served with thecha."
      }
    ]
  },
  {
    id: "western-starters",
    title: "Western Starters",
    parentTitle: "Areca Menu",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "BRUSCHETTA",
        price: "₹150",
        desc: "Crispy toasted bread topped with juicy tomatoes, fresh basil, garlic, and extra-virgin olive oil."
      },
      {
        name: "CHEESE GARLIC BREAD",
        price: "₹200",
        desc: "Toasted garlic bread loaded with melted cheese & herbs."
      },
      {
        name: "CHEESE CHILLI TOSSED",
        price: "₹175",
        desc: "Quick-baked canapé made with a balanced combination of cheese & chilli."
      },
      {
        name: "SUPER LOADED NACHOS",
        price: "₹225",
        desc: "Nachos topped with sour créame, cheese sauce."
      },
      {
        name: "VEG. SANDWICH",
        price: "₹175",
        desc: "Crisp, fresh garden vegetables and a light spread layered between soft or toasted bread slices."
      },
      {
        name: "CHEESE SANDWICH",
        price: "₹175",
        desc: "Cheese between two slices of bread."
      },
      {
        name: "VEG. CLUB SANDWICH",
        price: "₹220",
        desc: "Three-layer sandwich made with toasted bread, fresh vegetables, spreads, and often cheese."
      },
      {
        name: "BOMBAY SANDWICH",
        price: "₹200",
        desc: "Soft white bread, butter, green coriander-mint chutney, and boiled potatoes."
      },
      {
        name: "VEG. BURGER",
        price: "₹200",
        desc: "Vegetable patty inside a bun with lettuce, tomatoes, and sauces."
      },
      {
        name: "CHEESE BURGER",
        price: "₹220",
        desc: "Vegetable and potato patty with a slice of cheese, crisp lettuce, sliced tomatoes, and tomato ketchup."
      },
      {
        name: "ENCHILADAS",
        price: "₹350",
        desc: "Soft tortillas stuffed with flavorful filling, topped with rich sauce & melted cheese."
      }
    ]
  },
  {
    id: "italian-delicious",
    title: "Italian Delicious",
    parentTitle: "Areca Menu",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "MARGHERITA",
        price: "₹220",
        desc: "Fresh tomatoes, fresh mozzarella, fresh basil leaves scattered on top, and extra-virgin olive oil."
      },
      {
        name: "VEGGIE PIZZA",
        price: "₹230",
        desc: "Mozzarella with toppings including bell peppers, onions, mushrooms, tomatoes, olives, spinach, and corn."
      },
      {
        name: "HAWAIIAN PIZZA",
        price: "₹350",
        desc: "Sweet pineapple with savoury, salty, or spicy elements like paneer, sweet corn, jalapeños, and cheese."
      },
      {
        name: "TOMATO BASIL PIZZA",
        price: "₹375",
        desc: "A vegetable-loaded pizza topped with fresh garden produce, tomato sauce, and melted mozzarella cheese."
      },
      {
        name: "PANEER TIKKA PIZZA",
        price: "₹375",
        desc: "Tomato pizza sauce, cubes of paneer marinated in thick yogurt and tandoori spices, bell peppers, onions, and tomatoes."
      },
      {
        name: "ALFREDO PASTA",
        price: "₹275",
        desc: "Creamy white sauce pasta."
      },
      {
        name: "PASTA AGLIO E OLIO",
        price: "₹275",
        desc: "Spaghetti in olive oil, garlic & parmesan."
      },
      {
        name: "CREMATO SAUCE PASTA",
        price: "₹275",
        desc: "Pasta in pomodoro & creamy sauce."
      }
    ]
  },
  {
    id: "oriental-express",
    title: "Oriental Express",
    parentTitle: "Areca Menu",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "TERIYAKI TEMPLE NOODLES",
        price: "₹275",
        desc: "Noodles with vegetables in teriyaki sauce."
      },
      {
        name: "HOUSE NOODLES",
        price: "₹275",
        desc: "Wok-tossed noodles with vegetables."
      },
      {
        name: "BUTTER CHILLI GARLIC NOODLES",
        price: "₹275",
        desc: "Noodles tossed in butter, chilli & garlic."
      },
      {
        name: "TRADITIONAL THAI CURRY (RED/YELLOW/GREEN)",
        price: "₹400",
        desc: "Vegetables in Thai spiced coconut curry."
      },
      {
        name: "STEAMED JASMINE RICE",
        price: "₹180",
        desc: "Gently steamed to a soft, tender, and slightly clumping texture."
      },
      {
        name: "CLASSIC BURNT GARLIC FRIED RICE",
        price: "₹200",
        desc: "Jasmine rice tossed in sesame oil & burnt garlic."
      }
    ]
  },
  {
    id: "indian-delicious",
    title: "Indian Delicious",
    parentTitle: "Areca Menu",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "PANEER AAP KI PASAND",
        price: "₹350",
        desc: "Makhani, Palak, Lababdar, Butter masala, Matar, Korma, Kadhai, Tikka Masala."
      },
      {
        name: "KOFTA E KHAAS",
        price: "₹350",
        desc: "Malai Kofta/Dilkhush Kofta in red gravy/Chana Kofta in palak gravy."
      },
      {
        name: "TAWA SUBZ MASALA",
        price: "₹300",
        desc: "Assorted vegetables curry."
      },
      {
        name: "DINGRI JAHANARA",
        price: "₹300",
        desc: "Succulent mushrooms cooked in a rich, creamy sauce with fragrant Indian spices."
      },
      {
        name: "CORN PALAK LASOONI",
        price: "₹275",
        desc: "Sweet corn and fresh spinach infused with fragrant spices and the rich aroma of roasted garlic."
      },
      {
        name: "DUM ALOO",
        price: "₹250",
        desc: "Baby potatoes slow-cooked in a rich, aromatic gravy with traditional Indian spices."
      },
      {
        name: "METHI MATAR MALAI",
        price: "₹325",
        desc: "Creamy fenugreek peas curry."
      },
      {
        name: "SOYA MAKHANI",
        price: "₹350",
        desc: "Soya in makhani gravy."
      },
      {
        name: "BATATA NU SHAAK",
        price: "₹300",
        desc: "Gujarati \"potato vegetable/curry\"."
      },
      {
        name: "RINGNA BATETA NU SHAAK",
        price: "₹300",
        desc: "Gujarati curry made with eggplant and potatoes cooked in a spiced tomato or garlic-tomato gravy."
      },
      {
        name: "KUMBH VATANA CURRY",
        price: "₹375",
        desc: "Button mushrooms & peas cooked with ethnic spices."
      },
      {
        name: "SURTI DAL",
        price: "₹300",
        desc: "Surti Dal is a traditional, sweet, sour, and mildly spicy lentil dish from , soupy consistency and boiled peanuts."
      },
      {
        name: "DAL MAKHANI",
        price: "₹325",
        desc: "Creamy lentil curry."
      },
      {
        name: "TUVAR TARANNUM",
        price: "₹300",
        desc: "A flavorful preparation of tender tuvar cooked with aromatic spices for a rich and comforting taste."
      }
    ]
  },
  {
    id: "shahi-handi-chawal",
    title: "Shahi Handi Chawal",
    parentTitle: "Areca Menu",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "HYDERABADI BIRYANI",
        price: "₹350",
        desc: "Fresh mixed Vegetable and Basmati rice are Yogurt fried Onion and whole spices."
      },
      {
        name: "MOTIYA PUALO",
        price: "₹275",
        desc: "A very fragrant pulao that is topped with some spicy fried paneer balls."
      },
      {
        name: "CHOICE OF PULAO",
        price: "₹275",
        desc: "Cashew Nut/Jeera/Birista/Kashmiri."
      },
      {
        name: "HOUSE STEAM RICE",
        price: "₹250",
        desc: "Rice that has been cooked either by steaming or boiling."
      },
      {
        name: "CHOICE OF KHICHDI",
        price: "₹275",
        desc: "Plain / Masala\nServed with yogurt, pickle & Papad."
      }
    ]
  },
  {
    id: "tandoor-delights",
    title: "Tandoor Delights",
    parentTitle: "Areca Menu",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "TAWA ROTI",
        price: "₹70",
        desc: "Light, fluffy, and freshly roasted whole wheat Indian flatbread."
      },
      {
        name: "TANDOORI ROTI PLAIN",
        price: "₹90",
        desc: "Indian flatbread baked in a traditional clay oven."
      },
      {
        name: "TANDOORI ROTI BUTTER",
        price: "₹110",
        desc: "Indian flatbread baked in a traditional clay oven and brushed with rich, melted butter."
      },
      {
        name: "LACCHA PARATHA",
        price: "₹130",
        desc: "A multi-layered served with clarified butter, mirchi, ajwain, green chilli."
      },
      {
        name: "ROTIYON KI TOKRI",
        price: "₹330",
        desc: "An assortment of roti, paratha, naan, and missi roti."
      },
      {
        name: "CHUR CHUR NAAN",
        price: "₹120",
        desc: "Soft naan with crushed papad for a light crunch."
      },
      {
        name: "CHEESE DELIGHT NAAN",
        price: "₹145",
        desc: "Process cheese stuffed naan."
      },
      {
        name: "TAAZA PUDINA PARATHA",
        price: "₹120",
        desc: "Fresh Mint flavoured unleavened bread."
      },
      {
        name: "LASOONI NAAN",
        price: "₹130",
        desc: "Naan topping with fresh garlic."
      },
      {
        name: "MIRCHI PARATHA",
        price: "₹120",
        desc: "Spiced paratha with red chilli, green chilli, and chopped coriander."
      },
      {
        name: "BHARWAN KULCHA",
        price: "₹140",
        desc: "Stuffed kulcha filled with paneer, aloo, and pyaz."
      }
    ]
  },
  {
    id: "sweet-and-dessert",
    title: "Sweet and Dessert",
    parentTitle: "Areca Menu (Shahi Jugalbandi)",
    timing: "LUNCH (Timing 12:00 pm to 3:30 pm)\nDINNER (Timing 7:00 pm to 11:00 pm)",
    items: [
      {
        name: "COCO BERRY FUSION",
        price: "₹250",
        desc: "Chocolate mousse with raspberry & chocolate sauce."
      },
      {
        name: "MILLE FEUILLE",
        price: "₹250",
        desc: "Phyllo pastry layered with vanilla cream & berry compote."
      },
      {
        name: "HOUSE BROWNIE",
        price: "₹200",
        desc: "65% Single origin chocolate brownie with ice cream."
      },
      {
        name: "HOUSE MILK CAKE",
        price: "₹250",
        desc: "Sponge cake soaked in sweetened milk, Seasonal fruit, Surprise of pistachio butter."
      },
      {
        name: "TIRAMISU",
        price: "₹275",
        desc: "Layers of delicate ladyfingers soaked in espresso, embraced by silky mascarpone cream, and finished with a whisper of cocoa."
      },
      {
        name: "RASMALAI",
        price: "₹250",
        desc: "Soft paneer dumplings soaked in a creamy aromatic milk syrup."
      },
      {
        name: "GULAB JAMUN",
        price: "₹200",
        desc: "Soft, melt-in-the-mouth milk dumplings soaked in warm, fragrant sugar syrup, served delicately for a classic Indian sweet experience."
      },
      {
        name: "MOONG DAL HALWA",
        price: "₹250",
        desc: "Split Yellow Moong lentils generous amounts of desi ghee, milk, and sugar."
      },
      {
        name: "ICE CREAM OF YOUR CHOICE",
        price: "₹180",
        desc: "Vanilla/Chocolate/Strawberry/Butterscotch."
      }
    ]
  },
  {
    id: "refreshing-beverages",
    title: "Refreshing Beverages",
    parentTitle: "Refreshing Beverages",
    items: [
      {
        name: "FRESH LIME SODA / WATER",
        price: "₹120",
        desc: "Plain/Sweet/Mix."
      },
      {
        name: "COLD COFFEE",
        price: "₹160",
        desc: "Coffee blended with chilled milk, sugar syrup, and ice until thick and frothy."
      },
      {
        name: "VIRJIN MOJITO",
        price: "₹150",
        desc: "A crisp and refreshing blend of fresh mint leaves, zesty lime, sugar, and sparkling soda served over crushed ice."
      },
      {
        name: "BUTTER MILK",
        price: "₹125",
        desc: "Plain/Masala."
      },
      {
        name: "PUNJABI LASSI",
        price: "₹125",
        desc: "Plain/Masala/Sweet."
      },
      {
        name: "AERATED BEVERAGE",
        price: "MRP",
        desc: "Coke, Sprite, Fanta & Diet Coke."
      },
      {
        name: "WATER 1 LTR",
        price: "MRP",
        desc: ""
      },
      {
        name: "TONIC WATER",
        price: "MRP",
        desc: ""
      },
      {
        name: "GINGER ALE",
        price: "MRP",
        desc: ""
      },
      {
        name: "RED BULL",
        price: "MRP",
        desc: ""
      },
      {
        name: "HOUSE SPECIAL TEA",
        price: "₹75",
        desc: "Masala/Plain."
      },
      {
        name: "REGULAR COFFEE",
        price: "₹85",
        desc: "Classic, smooth drip coffee brewed daily from premium, medium-roasted beans. Served hot and fresh."
      },
      {
        name: "HOT MILK",
        price: "₹75",
        desc: ""
      }
    ]
  },
  {
    id: "round-the-clock",
    title: "Round The Clock",
    timing: "Timing 4:30 pm to 6:30 pm",
    categoryNote: "Round The Clock",
    items: [
      {
        name: "ALFREDO PASTA",
        price: "₹350",
        desc: "Creamy white sauce pasta."
      },
      {
        name: "AGLIO E OLIO PASTA",
        price: "₹350",
        desc: "Olive oil, garlic & Parmesan."
      },
      {
        name: "CREMATO SAUCE PASTA",
        price: "₹350",
        desc: "Pasta in pomodoro & creamy sauce."
      },
      {
        name: "VEG. SANDWICH",
        price: "₹175",
        desc: "Fresh, crisp garden vegetables layered with creamy spread on toasted whole grain bread."
      },
      {
        name: "CHEESE SANDWICH",
        price: "₹175",
        desc: "Cheese between two slices of bread."
      },
      {
        name: "VEG. CLUB SANDWICH",
        price: "₹220",
        desc: "Three-layer sandwich made with toasted bread, fresh vegetables, spreads, and often cheese."
      },
      {
        name: "BOMBAY SANDWICH",
        price: "₹200",
        desc: "Soft white bread, butter, green coriander-mint chutney & boiled potatoes."
      },
      {
        name: "YELLOW DAL TADKA",
        price: "₹300",
        desc: "Tempered yellow dal."
      },
      {
        name: "VEG.DUM BIRYANI",
        price: "₹350",
        desc: "Fresh mixed vegetables and Basmati rice with yogurt, fried onions, and whole spices."
      },
      {
        name: "HOUSE STEAM RICE",
        price: "₹250",
        desc: "Light, fluffy, and perfectly steamed premium long-grain rice."
      },
      {
        name: "HOUSE JEERA RICE",
        price: "₹275",
        desc: "A fragrant, classic Indian rice dish tempered with toasted cumin seeds and ghee."
      },
      {
        name: "TAWA PARATHA",
        price: "₹110",
        desc: "Indian flatbread made from wheat flour and ghee."
      },
      {
        name: "FRENCH FRIES",
        price: "₹110",
        desc: "Crisp, golden potato strips tossed in salt"
      },
      {
        name: "PERI-PERI FRIES",
        price: "₹120",
        desc: "Extra-crispy fries dusted with a bold, spicy, and tangy peri-peri seasoning."
      },
      {
        name: "PEANUT MASALA",
        price: "₹110",
        desc: "Bold, savory, spicy, and tangy."
      },
      {
        name: "MASALA PAPAD",
        price: "₹110",
        desc: "A crispy roasted or fried papad."
      },
      {
        name: "ASSORTED PAKODA",
        price: "₹200",
        desc: "A crispy, golden medley of fresh seasonal vegetables dipped in a spiced chickpea flour batter."
      },
      {
        name: "GULAB JAMUN",
        price: "₹250",
        desc: "Fried cottage cheese dumpling steeped in sugary saffron syrup."
      },
      {
        name: "ICE CREAM OF YOUR CHOICE",
        price: "₹180",
        desc: "Vanilla / Chocolate / Strawberry / Butterscotch."
      }
    ]
  }
];

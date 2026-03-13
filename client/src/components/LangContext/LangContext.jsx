import { createContext, useContext, useState, useEffect } from "react";

export const LangContext = createContext();

export const LANGS = [
  { code:"en", label:"EN",     full:"English", flag:"🇬🇧" },
  { code:"ta", label:"தமிழ்", full:"தமிழ்",   flag:"🇮🇳" },
  { code:"hi", label:"हिंदी", full:"हिंदी",   flag:"🇮🇳" },
];

export const translations = {
  en: {
    /* Navbar */
    navHome:"Home", navProducts:"Products", navBlog:"Blog", navContact:"Contact Us",
    navCart:"Cart", navDiwali:"🪔 Happy Diwali 2025! ✨",
    /* Home hero */
    badge:"✨ Premium Crackers from Sivakasi",
    h1a:"Spark the Joy of Every", h1b:"Festival",
    subtext:"Premium Sivakasi crackers", subtext2:"Pan India delivery",
    shopNow:"Shop Now", kidsSafe:"Kids Safe",
    happyCust:"Happy Customers", products:"Products", rating:"Rating", shipping:"Shipping ₹999+",
    /* Home categories */
    browseLabel:"Browse Categories", catTitle1:"Product", catTitle2:"Categories",
    catSub:"8 categories · 144+ products · direct from Sivakasi",
    /* Category names */
    catSparklers:"Sparklers", catRockets:"Rockets", catBombs:"Bombs",
    catFlowerPots:"Flower Pots", catSkyShots:"Sky Shots", catKidsSpecial:"Kids Special",
    catComboPacks:"Combo Packs", catGiftBoxes:"Gift Boxes",
    /* Home about */
    aboutLabel:"About SparkNest", aboutH2a:"Born in Sivakasi", aboutH2b:", Delivered Across India",
    aboutP1:"SparkNest was founded with one mission — to bring the finest crackers straight from Sivakasi's legendary factories to your doorstep. Every product is handpicked, safety-certified, and packed with care.",
    aboutP2:"Sivakasi, Tamil Nadu has been India's fireworks capital since 1923. We partner directly with trusted manufacturers to bring you the best quality at the best prices — cutting out the middlemen.",
    /* Home reviews */
    reviewsLabel:"Customer Reviews", reviewsH2a:"What Our", reviewsH2b:"Customers Say",
    /* Home why */
    whyLabel:"Why SparkNest?", whyH2:"Trusted by", whyH2b:"Happy Customers",
    trust1title:"Direct from Sivakasi", trust1desc:"Sourced directly from India's cracker capital — freshest stock every season.",
    trust2title:"Safety Certified",     trust2desc:"All products comply with Govt. safety standards. Kids & family safe.",
    trust3title:"Pan India Delivery",   trust3desc:"Fast & secure delivery across all 28 states. Free above ₹999.",
    /* Products */
    allProducts:"All Products", myWishlist:"My Wishlist",
    searchPlaceholder:"Search crackers…",
    filters:"Filters", filtersTitle:"Filters", clearFilters:"Clear Filters",
    clear:"Clear", apply:"Apply",
    categories:"Categories", priceRange:"Price Range", kidsSafeOnly:"Kids Safe Only",
    kidsSafeOn:"Kids Safe ON", kidsSafeOff:"Kids Safe OFF",
    sortBy:"Sort By", loading:"Loading…", noProducts:"No products found",
    inStock:"In Stock", outOfStock:"Out of Stock", lowStock:"Only {n} left",
    addToCart:"Add to Cart", addedToCart:"Added!", wishlistAdd:"Wishlisted!", wishlistRemove:"Removed", wishlistEmpty:"Your wishlist is empty",
    newest:"Newest First", priceLow:"Price: Low to High", priceHigh:"Price: High to Low",
    popular:"Most Popular",
    /* ProductDetail */
    backToProducts:"← Back to Products",
    qty:"Qty", stockLeft:"{n} left in stock",
    freeDelivery:"Free delivery on orders above ₹999",
    securePayment:"Secure UPI & Bank Transfer",
    sivakasiFresh:"Direct from Sivakasi",
    certified:"Safety Certified",
    /* CartDrawer */
    yourCart:"Your Cart",
    item:"item", items:"items",
    emptyCart:"Your cart is empty",
    shopNowCart:"Shop Now 🎆",
    youSave:"You save",
    totalPayable:"Total",
    freeDeliveryCart:"Free delivery on orders above ₹999",
    proceedCheckout:"Proceed to Checkout →",
    /* Checkout */
    checkoutTitle:"Checkout",
    deliveryAddress:"Delivery Address",
    paymentSummary:"Payment & Summary",
    fullName:"Full Name *", phone:"Phone *", emailOpt:"Email (optional)",
    address:"Address *", city:"City *", pincode:"Pincode *", state:"State *",
    continuePayment:"Continue to Payment →",
    orderSummary:"Order Summary",
    totalPayableChk:"Total Payable",
    upiId:"UPI ID", bankTransfer:"Bank Transfer",
    bankName:"Bank Name", acctName:"Account Name", acctNo:"Account Number",
    ifsc:"IFSC Code", branch:"Branch",
    payNote:"After payment, send your",
    payNote2:"order details + payment screenshot",
    payNote3:"to our admin on WhatsApp to complete your order.",
    sendWhatsapp:"Send Order on WhatsApp",
    orderPlaced:"Order Placed!",
    orderId:"Order ID",
    continueShopping:"Continue Shopping",
    secure:"Secure", safe:"100% safe",
    fastShip:"Fast Ship", days:"2–5 days",
    verified:"Verified", trusted:"Trusted store",
    support:"Support", whatsappHelp:"WhatsApp help",
    copied:"Copied", copy:"Copy",
  },
  ta: {
    /* Navbar */
    navHome:"முகப்பு", navProducts:"பொருட்கள்", navBlog:"வலைப்பதிவு", navContact:"தொடர்பு கொள்க",
    navCart:"கார்ட்", navDiwali:"🪔 தீபாவளி நல்வாழ்த்துகள் 2025! ✨",
    /* Home hero */
    badge:"✨ சிவகாசியிலிருந்து நேரடியாக தரமான பட்டாசுகள்",
    h1a:"ஒவ்வொரு கொண்டாட்டத்திலும்", h1b:"மகிழ்ச்சி பொங்கட்டும்",
    subtext:"சிவகாசியின் தரமான பட்டாசுகள்", subtext2:"இந்தியா முழுவதும் டெலிவரி",
    shopNow:"இப்போதே வாங்குங்கள்", kidsSafe:"குழந்தைகளுக்கு ஏற்றது",
    happyCust:"மகிழ்ச்சியான வாடிக்கையாளர்கள்", products:"பொருட்கள்", rating:"மதிப்பெண்", shipping:"₹999-க்கு மேல் இலவச டெலிவரி",
    /* Home categories */
    browseLabel:"வகைகளை உலாவுக", catTitle1:"பொருள்", catTitle2:"வகைகள்",
    catSub:"8 வகைகள் · 144+ பொருட்கள் · சிவகாசியிலிருந்து நேரடியாக",
    /* Category names */
    catSparklers:"மத்தாப்பு", catRockets:"ராக்கெட்", catBombs:"அனு குண்டு",
    catFlowerPots:"சட்டி வெடி", catSkyShots:"வானவேடிக்கை", catKidsSpecial:"குழந்தைகள் சிறப்பு",
    catComboPacks:"கலவை தொகுப்பு", catGiftBoxes:"பரிசு பெட்டி",
    /* Home about */
    aboutLabel:"SparkNest பற்றி", aboutH2a:"சிவகாசியில் உதித்தது", aboutH2b:", இந்தியா முழுவதும் வழங்குகிறோம்",
    aboutP1:"SparkNest ஒரே குறிக்கோளுடன் தொடங்கப்பட்டது — சிவகாசியின் புகழ்வாய்ந்த தொழிற்சாலைகளிலிருந்து நேரடியாக உங்கள் இல்லம் வரை சிறந்த பட்டாசுகளை கொண்டு சேர்க்க. ஒவ்வொரு பொருளும் கவனமாக தேர்வு செய்யப்பட்டு, பாதுகாப்பு சான்று பெற்று, அன்புடன் பேக் செய்யப்படுகிறது.",
    aboutP2:"தமிழ்நாட்டின் சிவகாசி 1923 ஆம் ஆண்டு முதல் இந்தியாவின் பட்டாசு தலைநகராக திகழ்கிறது. நாங்கள் நம்பகமான உற்பத்தியாளர்களுடன் நேரடி கூட்டாண்மை வைத்து, இடைத்தரகர்களை நீக்கி, சிறந்த தரத்தை சிறந்த விலையில் உங்களுக்கு வழங்குகிறோம்.",
    /* Home reviews */
    reviewsLabel:"வாடிக்கையாளர் கருத்துகள்", reviewsH2a:"எங்கள்", reviewsH2b:"வாடிக்கையாளர்கள் சொல்வதைக் கேளுங்கள்",
    /* Home why */
    whyLabel:"ஏன் SparkNest தேர்வு செய்யணும்?", whyH2:"", whyH2b:"மகிழ்ச்சியான வாடிக்கையாளர்களின் நம்பிக்கை",
    trust1title:"சிவகாசியிலிருந்து நேரடியாக", trust1desc:"இந்தியாவின் பட்டாசு தலைநகரிலிருந்து நேரடியாகப் பெறப்பட்டது — ஒவ்வொரு பருவத்திலும் புதியதாக கிடைக்கும்.",
    trust2title:"பாதுகாப்பு சான்றிதழ் பெற்றது", trust2desc:"அனைத்து பொருட்களும் அரசு பாதுகாப்பு விதிகளுக்கு உட்பட்டவை. குழந்தைகளுக்கும் குடும்பத்தினருக்கும் பாதுகாப்பானது.",
    trust3title:"இந்தியா முழுவதும் டெலிவரி", trust3desc:"28 மாநிலங்களிலும் வேகமான, பாதுகாப்பான டெலிவரி. ₹999-க்கு மேல் இலவசம்.",
    /* Products */
    allProducts:"அனைத்து பொருட்களும்", myWishlist:"என் விருப்பப் பட்டியல்",
    searchPlaceholder:"பட்டாசுகளை தேடுங்கள்…",
    filters:"வடிகட்டிகள்", filtersTitle:"வடிகட்டிகள்", clearFilters:"வடிகட்டிகளை நீக்கு",
    clear:"நீக்கு", apply:"பயன்படுத்து",
    categories:"வகைகள்", priceRange:"விலை வரம்பு", kidsSafeOnly:"குழந்தைகளுக்கு மட்டும்",
    kidsSafeOn:"குழந்தை பாதுகாப்பு: இயக்கத்தில்", kidsSafeOff:"குழந்தை பாதுகாப்பு: நிறுத்தப்பட்டது",
    sortBy:"வரிசைப்படுத்து", loading:"ஏற்றுகிறது…", noProducts:"பொருட்கள் எதுவும் கிடைக்கவில்லை",
    inStock:"கையிருப்பில் உள்ளது", outOfStock:"தற்போது இல்லை", lowStock:"மட்டும் {n} மீதம் உள்ளது",
    addToCart:"கார்ட்டில் சேர்க்கவும்", addedToCart:"சேர்க்கப்பட்டது!", wishlistAdd:"விருப்பத்தில் சேர்த்தது!", wishlistRemove:"நீக்கப்பட்டது", wishlistEmpty:"உங்கள் விருப்பப்பட்டியல் காலியாக உள்ளது",
    newest:"புதியவை முதலில்", priceLow:"விலை: குறைவானது முதல்", priceHigh:"விலை: அதிகமானது முதல்",
    popular:"மிகவும் பிரபலமானது",
    /* ProductDetail */
    backToProducts:"← பொருட்களுக்கு திரும்பு",
    qty:"அளவு", stockLeft:"{n} மட்டுமே மீதம்",
    freeDelivery:"₹999-க்கு மேல் இலவச டெலிவரி",
    securePayment:"பாதுகாப்பான UPI & வங்கி பரிமாற்றம்",
    sivakasiFresh:"சிவகாசியிலிருந்து நேரடியாக",
    certified:"பாதுகாப்பு சான்றிதழ் பெற்றது",
    /* CartDrawer */
    yourCart:"உங்கள் கார்ட்",
    item:"பொருள்", items:"பொருட்கள்",
    emptyCart:"உங்கள் கார்ட் காலியாக உள்ளது",
    shopNowCart:"இப்போதே வாங்குங்கள் 🎆",
    youSave:"நீங்கள் மிச்சப்படுத்துகிறீர்கள்",
    totalPayable:"மொத்தம்",
    freeDeliveryCart:"₹999-க்கு மேல் இலவச டெலிவரி",
    proceedCheckout:"கட்டண பக்கத்திற்கு செல்க →",
    /* Checkout */
    checkoutTitle:"கட்டண விவரம்",
    deliveryAddress:"டெலிவரி முகவரி",
    paymentSummary:"கட்டணம் & சுருக்கம்",
    fullName:"முழு பெயர் *", phone:"கைப்பேசி எண் *", emailOpt:"மின்னஞ்சல் (விருப்பமானது)",
    address:"முகவரி *", city:"நகரம் *", pincode:"அஞ்சல் குறியீடு *", state:"மாநிலம் *",
    continuePayment:"கட்டணத்திற்கு தொடரவும் →",
    orderSummary:"ஆர்டர் சுருக்கம்",
    totalPayableChk:"செலுத்த வேண்டிய மொத்தத் தொகை",
    upiId:"UPI எண்", bankTransfer:"வங்கி பரிமாற்றம்",
    bankName:"வங்கியின் பெயர்", acctName:"கணக்துதாரர் பெயர்", acctNo:"கணக்கு எண்",
    ifsc:"IFSC குறியீடு", branch:"கிளை",
    payNote:"கட்டணம் செலுத்திய பின்னர், உங்கள்",
    payNote2:"ஆர்டர் விவரங்கள் + கட்டண ஸ்கிரீன்ஷாட்",
    payNote3:"ஐ WhatsApp-ல் அனுப்பவும்.",
    sendWhatsapp:"WhatsApp-ல் ஆர்டர் அனுப்பவும்",
    orderPlaced:"ஆர்டர் பதிவாகிவிட்டது!",
    orderId:"ஆர்டர் எண்",
    continueShopping:"தொடர்ந்து கடை பார்க்கவும்",
    secure:"பாதுகாப்பானது", safe:"100% பாதுகாப்பு",
    fastShip:"விரைவு அனுப்புதல்", days:"2–5 நாட்களில்",
    verified:"சரிபார்க்கப்பட்டது", trusted:"நம்பகமான கடை",
    support:"ஆதரவு", whatsappHelp:"WhatsApp உதவி",
    copied:"நகலெடுக்கப்பட்டது", copy:"நகலெடு",
  },
  hi: {
    /* Navbar */
    navHome:"होम", navProducts:"उत्पाद", navBlog:"ब्लॉग", navContact:"संपर्क करें",
    navCart:"कार्ट", navDiwali:"🪔 दीपावली की शुभकामनाएँ 2025! ✨",
    /* Home hero */
    badge:"✨ सिवाकासी से प्रीमियम पटाखे",
    h1a:"हर त्योहार की खुशी को", h1b:"रोशन करें",
    subtext:"सिवाकासी के प्रीमियम पटाखे", subtext2:"पूरे भारत में डिलीवरी",
    shopNow:"अभी खरीदें", kidsSafe:"बच्चों के लिए सुरक्षित",
    happyCust:"खुश ग्राहक", products:"उत्पाद", rating:"रेटिंग", shipping:"मुफ्त शिपिंग ₹999+",
    /* Home categories */
    browseLabel:"श्रेणियाँ देखें", catTitle1:"उत्पाद", catTitle2:"श्रेणियाँ",
    catSub:"8 श्रेणियाँ · 144+ उत्पाद · सिवाकासी से सीधे",
    /* Category names */
    catSparklers:"फुलझड़ी", catRockets:"राकेट", catBombs:"बम",
    catFlowerPots:"फूलदान", catSkyShots:"आकाश फूल", catKidsSpecial:"बच्चों के लिए",
    catComboPacks:"कॉम्बो पैक", catGiftBoxes:"गिफ्ट बॉक्स",
    /* Home about */
    aboutLabel:"SparkNest के बारे में", aboutH2a:"सिवाकासी से जन्मा", aboutH2b:", पूरे भारत में डिलीवरी",
    aboutP1:"SparkNest की स्थापना एक मिशन के साथ हुई — सिवाकासी की प्रसिद्ध फैक्ट्रियों से सीधे आपके दरवाजे तक बेहतरीन पटाखे पहुँचाना। हर उत्पाद को सावधानी से चुना और पैक किया जाता है।",
    aboutP2:"तमिलनाडु का सिवाकासी 1923 से भारत की आतिशबाजी राजधानी रहा है। हम विश्वसनीय निर्माताओं के साथ सीधे साझेदारी करते हैं और बिचौलियों को हटाकर सर्वोत्तम गुणवत्ता देते हैं।",
    /* Home reviews */
    reviewsLabel:"ग्राहक समीक्षाएँ", reviewsH2a:"हमारे", reviewsH2b:"ग्राहक क्या कहते हैं",
    /* Home why */
    whyLabel:"SparkNest क्यों?", whyH2:"10,000+ खुश", whyH2b:"ग्राहकों का भरोसा",
    trust1title:"सिवाकासी से सीधे",   trust1desc:"भारत की आतिशबाजी राजधानी से सीधे — हर सीजन ताजा स्टॉक।",
    trust2title:"सुरक्षा प्रमाणित",   trust2desc:"सभी उत्पाद सरकारी सुरक्षा मानकों के अनुरूप। बच्चों के लिए सुरक्षित।",
    trust3title:"पूरे भारत में डिलीवरी", trust3desc:"सभी 28 राज्यों में तेज डिलीवरी। ₹999 से ऊपर मुफ्त।",
    /* Products */
    allProducts:"सभी उत्पाद", myWishlist:"मेरी पसंद सूची",
    searchPlaceholder:"पटाखे खोजें…",
    filters:"फ़िल्टर", filtersTitle:"फ़िल्टर", clearFilters:"फ़िल्टर साफ़ करें",
    clear:"साफ़", apply:"लागू करें",
    categories:"श्रेणियाँ", priceRange:"मूल्य सीमा", kidsSafeOnly:"केवल बच्चों के लिए",
    kidsSafeOn:"बच्चे सुरक्षित: चालू", kidsSafeOff:"बच्चे सुरक्षित: बंद",
    sortBy:"क्रमबद्ध करें", loading:"लोड हो रहा है…", noProducts:"कोई उत्पाद नहीं मिला",
    inStock:"स्टॉक में है", outOfStock:"स्टॉक में नहीं", lowStock:"केवल {n} बचे",
    addToCart:"कार्ट में जोड़ें", addedToCart:"जोड़ा गया!", wishlistAdd:"पसंद में जोड़ा!", wishlistRemove:"हटाया गया", wishlistEmpty:"आपकी पसंद सूची खाली है",
    newest:"नया पहले", priceLow:"कीमत: कम से अधिक", priceHigh:"कीमत: अधिक से कम",
    popular:"सबसे लोकप्रिय",
    /* ProductDetail */
    backToProducts:"← उत्पादों पर वापस जाएँ",
    qty:"मात्रा", stockLeft:"{n} बचे हैं",
    freeDelivery:"₹999 से ऊपर मुफ्त डिलीवरी",
    securePayment:"सुरक्षित UPI & बैंक ट्रांसफर",
    sivakasiFresh:"सिवाकासी से सीधे",
    certified:"सुरक्षा प्रमाणित",
    /* CartDrawer */
    yourCart:"आपकी कार्ट",
    item:"आइटम", items:"आइटम",
    emptyCart:"आपकी कार्ट खाली है",
    shopNowCart:"अभी खरीदें 🎆",
    youSave:"आप बचाते हैं",
    totalPayable:"कुल",
    freeDeliveryCart:"₹999 से ऊपर मुफ्त डिलीवरी",
    proceedCheckout:"चेकआउट पर जाएँ →",
    /* Checkout */
    checkoutTitle:"चेकआउट",
    deliveryAddress:"डिलीवरी पता",
    paymentSummary:"भुगतान & सारांश",
    fullName:"पूरा नाम *", phone:"फ़ोन *", emailOpt:"ईमेल (वैकल्पिक)",
    address:"पता *", city:"शहर *", pincode:"पिनकोड *", state:"राज्य *",
    continuePayment:"भुगतान जारी रखें →",
    orderSummary:"ऑर्डर सारांश",
    totalPayableChk:"कुल देय",
    upiId:"UPI आईडी", bankTransfer:"बैंक ट्रांसफर",
    bankName:"बैंक का नाम", acctName:"खाता नाम", acctNo:"खाता संख्या",
    ifsc:"IFSC कोड", branch:"शाखा",
    payNote:"भुगतान के बाद, अपना",
    payNote2:"ऑर्डर विवरण + पेमेंट स्क्रीनशॉट",
    payNote3:"WhatsApp पर भेजें।",
    sendWhatsapp:"WhatsApp पर ऑर्डर भेजें",
    orderPlaced:"ऑर्डर हो गया!",
    orderId:"ऑर्डर आईडी",
    continueShopping:"खरीदारी जारी रखें",
    secure:"सुरक्षित", safe:"100% सुरक्षित",
    fastShip:"तेज शिपिंग", days:"2–5 दिन",
    verified:"सत्यापित", trusted:"भरोसेमंद दुकान",
    support:"सहायता", whatsappHelp:"WhatsApp सहायता",
    copied:"कॉपी हुआ", copy:"कॉपी",
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("sparknest_lang") || "en");
  useEffect(() => { localStorage.setItem("sparknest_lang", lang); }, [lang]);
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t, LANGS }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() { return useContext(LangContext); }

/**
 * CHRISTMAS FEUD — ULTIMATE EXPANSION (50 ADDITIONAL UNIQUE ALL-CHRISTMAS ROUNDS: #101–#150)
 * Covers all 15 official Christmas categories with zero duplicates.
 * Combined with Classic (70) + Deluxe (30), Ultimate Edition provides 150 unique rounds.
 * Point values are illustrative game-show data summing to exactly 100.
 */

const STANDARD_ULTIMATE_EXTRA_ROUNDS = [
  // Category 1: Christmas Traditions (101-104)
  {
    id: 'cf-101',
    category: 'Christmas Traditions',
    question: 'Name something typically tucked inside a British Christmas Cracker.',
    answers: [
      { text: 'Colorful Paper Crown', points: 35 },
      { text: 'Cheesy Dad Joke / Motto', points: 24 },
      { text: 'Tiny Plastic Toy or Keychain', points: 16 },
      { text: 'Mini Screwdriver or Nail Clippers', points: 9 },
      { text: 'Paper Fortune / Trivia Card', points: 6 },
      { text: 'Snap Strip That Pops', points: 4 },
      { text: 'Balloon or Whistle', points: 3 },
      { text: 'Miniature Playing Cards / Dice', points: 3 }
    ]
  },
  {
    id: 'cf-102',
    category: 'Christmas Traditions',
    question: 'Name a classic keepsake ornament families add to their tree every year.',
    answers: [
      { text: 'Baby’s First Christmas Ornament', points: 29 },
      { text: 'Family Name & Year Dated Ornament', points: 22 },
      { text: 'Vacation Souvenir Ornament', points: 15 },
      { text: 'Kids’ School Craft Ornament', points: 12 },
      { text: 'Pet’s Name or Paw-Print Ornament', points: 8 },
      { text: 'Newlywed / First Home Ornament', points: 6 },
      { text: 'Heirloom Glass Ornament From Grandma', points: 5 },
      { text: 'Favorite Sports Team or Hobby Ornament', points: 3 }
    ]
  },
  {
    id: 'cf-103',
    category: 'Christmas Traditions',
    question: 'Name a symbol people associate with the true spirit of Christmas.',
    answers: [
      { text: 'Star of Bethlehem', points: 27 },
      { text: 'Christmas Tree / Evergreen', points: 21 },
      { text: 'Angels', points: 15 },
      { text: 'Nativity Manger', points: 12 },
      { text: 'Glowing Candles', points: 9 },
      { text: 'Wreath (Circle of Eternal Love)', points: 6 },
      { text: 'Church Bells', points: 5 },
      { text: 'Dove of Peace', points: 5 }
    ]
  },
  {
    id: 'cf-104',
    category: 'Christmas Traditions',
    question: 'Name a midnight or late-night activity people do on Christmas Eve.',
    answers: [
      { text: 'Wrapping Last-Minute Presents', points: 31 },
      { text: 'Attending Midnight Church Service', points: 23 },
      { text: 'Parents Playing Santa Under the Tree', points: 17 },
      { text: 'Stuffing the Christmas Stockings', points: 11 },
      { text: 'Taking a Bite Out of Santa’s Cookie', points: 7 },
      { text: 'Listening to Quiet Holiday Music', points: 5 },
      { text: 'Watching Snow Fall Out the Window', points: 3 },
      { text: 'Prepping Tomorrow’s Breakfast Casserole', points: 3 }
    ]
  },

  // Category 2: Christmas Gifts (105-108)
  {
    id: 'cf-105',
    category: 'Christmas Gifts',
    question: 'Name a stocking stuffer adults genuinely love receiving.',
    answers: [
      { text: 'Gift Cards or Cash', points: 27 },
      { text: 'Lip Balm / Hand Lotion', points: 19 },
      { text: 'Warm Fuzzy Socks', points: 15 },
      { text: 'Gourmet Chocolates or Candy', points: 13 },
      { text: 'Scratch-Off Lottery Tickets', points: 10 },
      { text: 'Phone Charging Cable', points: 7 },
      { text: 'Mini Candle or Travel Cologne', points: 5 },
      { text: 'Coffee Beans / Tea Sampler', points: 4 }
    ]
  },
  {
    id: 'cf-106',
    category: 'Christmas Gifts',
    question: 'Name a popular tech gadget gifted at Christmas.',
    answers: [
      { text: 'Wireless Earbuds / Headphones', points: 29 },
      { text: 'Smartwatch / Fitness Tracker', points: 21 },
      { text: 'Tablet / iPad', points: 15 },
      { text: 'Bluetooth Portable Speaker', points: 11 },
      { text: 'Gaming Console / Controller', points: 9 },
      { text: 'E-Reader (Kindle)', points: 6 },
      { text: 'Smart Home Speaker', points: 5 },
      { text: 'Drone or Instant Camera', points: 4 }
    ]
  },
  {
    id: 'cf-107',
    category: 'Christmas Gifts',
    question: 'Name an "experience gift" that doesn’t need a box to wrap.',
    answers: [
      { text: 'Concert or Theater Tickets', points: 29 },
      { text: 'Spa Day or Massage Voucher', points: 21 },
      { text: 'Weekend Getaway / Hotel Stay', points: 15 },
      { text: 'Fine Dining Restaurant Gift Certificate', points: 12 },
      { text: 'Streaming or Subscription Box', points: 9 },
      { text: 'Cooking or Art Class', points: 6 },
      { text: 'Theme Park or Zoo Annual Pass', points: 4 },
      { text: 'Sports Game Tickets', points: 4 }
    ]
  },
  {
    id: 'cf-108',
    category: 'Christmas Gifts',
    question: 'Name a classic Christmas gift people buy for their family pet.',
    answers: [
      { text: 'Squeaky Holiday Plush Toy', points: 32 },
      { text: 'Bag of Gourmet Pet Treats / Bones', points: 24 },
      { text: 'Festive Sweater or Bandana', points: 14 },
      { text: 'Plush New Pet Bed', points: 10 },
      { text: 'Catnip Mice / Laser Toy', points: 8 },
      { text: 'Holiday-Themed Collar or Leash', points: 5 },
      { text: 'Pet Advent Calendar', points: 4 },
      { text: 'Tennis Balls Pack', points: 3 }
    ]
  },

  // Category 3: Christmas Movies (109-112)
  {
    id: 'cf-109',
    category: 'Christmas Movies',
    question: 'Name one of Kevin McCallister’s famous booby traps in "Home Alone."',
    answers: [
      { text: 'Swinging Paint Cans Down the Stairs', points: 30 },
      { text: 'Red-Hot Heated Doorknob', points: 22 },
      { text: 'Blowtorch Above the Back Door', points: 15 },
      { text: 'Micro Machines / Toy Cars on the Floor', points: 10 },
      { text: 'Glass Ornaments Under the Window', points: 8 },
      { text: 'Icy Front Steps', points: 6 },
      { text: 'Tar & Feathers Fan', points: 5 },
      { text: 'Falling Iron in the Laundry Chute', points: 4 }
    ]
  },
  {
    id: 'cf-110',
    category: 'Christmas Movies',
    question: 'Name one of Buddy the Elf’s hilarious habits or rules in the movie "Elf."',
    answers: [
      { text: 'Pouring Maple Syrup on Spaghetti', points: 31 },
      { text: 'Four Main Food Groups (Candy, Syrup...)', points: 22 },
      { text: 'Smiling Is My Favorite', points: 15 },
      { text: 'Spinning Wildly in Revolving Doors', points: 10 },
      { text: 'Screaming "SANTA! I KNOW HIM!"', points: 8 },
      { text: 'Singing Loud for All to Hear', points: 6 },
      { text: 'Pressing Every Elevator Button (Christmas Tree)', points: 4 },
      { text: 'Rapid-Fire Snowball Throwing', points: 4 }
    ]
  },
  {
    id: 'cf-111',
    category: 'Christmas Movies',
    question: 'Name a memorable Christmas movie quote people repeat every December.',
    answers: [
      { text: '"You’ll shoot your eye out!"', points: 29 },
      { text: '"Keep the change, ya filthy animal!"', points: 21 },
      { text: '"The best way to spread Christmas cheer..."', points: 16 },
      { text: '"Every time a bell rings, an angel gets his wings."', points: 12 },
      { text: '"Bah, humbug!"', points: 8 },
      { text: '"God bless us, every one!"', points: 6 },
      { text: '"Seeing isn’t believing. Believing is seeing."', points: 4 },
      { text: '"Merry Christmas, Shitter was full / Hap-hap-happiest!"', points: 4 }
    ]
  },
  {
    id: 'cf-112',
    category: 'Christmas Movies',
    question: 'Name a heartwarming romantic comedy set at Christmas.',
    answers: [
      { text: 'Love Actually', points: 32 },
      { text: 'The Holiday', points: 25 },
      { text: 'While You Were Sleeping', points: 12 },
      { text: 'Last Christmas', points: 10 },
      { text: 'Serendipity', points: 7 },
      { text: 'The Family Stone', points: 6 },
      { text: 'Four Christmases', points: 4 },
      { text: 'Happiest Season', points: 4 }
    ]
  },

  // Category 4: Christmas Music (113-116)
  {
    id: 'cf-113',
    category: 'Christmas Music',
    question: 'Name a classic Christmas song that mentions snow or cold winter weather.',
    answers: [
      { text: 'Let It Snow! Let It Snow! Let It Snow!', points: 30 },
      { text: 'White Christmas', points: 24 },
      { text: 'Winter Wonderland', points: 16 },
      { text: 'Frosty the Snowman', points: 11 },
      { text: 'Baby, It’s Cold Outside', points: 7 },
      { text: 'Sleigh Ride', points: 5 },
      { text: 'Jingle Bells (Through the Snow)', points: 4 },
      { text: 'Marshmallow World', points: 3 }
    ]
  },
  {
    id: 'cf-114',
    category: 'Christmas Music',
    question: 'Name an upbeat Christmas song that makes everyone want to dance.',
    answers: [
      { text: 'All I Want for Christmas Is You', points: 31 },
      { text: 'Rockin’ Around the Christmas Tree', points: 22 },
      { text: 'Jingle Bell Rock', points: 16 },
      { text: 'Feliz Navidad', points: 11 },
      { text: 'Run Rudolph Run', points: 7 },
      { text: 'Santa Tell Me', points: 5 },
      { text: 'Underneath the Tree', points: 4 },
      { text: 'Step Into Christmas', points: 4 }
    ]
  },
  {
    id: 'cf-115',
    category: 'Christmas Music',
    question: 'Name a song that specifically mentions Santa Claus in its title.',
    answers: [
      { text: 'Santa Claus Is Comin’ to Town', points: 33 },
      { text: 'Santa Baby', points: 24 },
      { text: 'Here Comes Santa Claus', points: 16 },
      { text: 'I Saw Mommy Kissing Santa Claus', points: 12 },
      { text: 'Santa Tell Me', points: 7 },
      { text: 'Up on the Housetop', points: 3 },
      { text: 'Must Be Santa', points: 3 },
      { text: 'Little Saint Nick', points: 2 }
    ]
  },
  {
    id: 'cf-116',
    category: 'Christmas Music',
    question: 'Name a famous Christmas instrumental piece or ballet melody.',
    answers: [
      { text: 'Dance of the Sugar Plum Fairy', points: 32 },
      { text: 'Carol of the Bells', points: 26 },
      { text: 'Sleigh Ride (Orchestral)', points: 15 },
      { text: 'Linus and Lucy (Charlie Brown)', points: 11 },
      { text: 'Waltz of the Flowers', points: 6 },
      { text: 'Greensleeves', points: 4 },
      { text: 'March of the Toy Soldiers', points: 3 },
      { text: 'Christmas Eve / Sarajevo 12/24', points: 3 }
    ]
  },

  // Category 5: Christmas Decorations (117-120)
  {
    id: 'cf-117',
    category: 'Christmas Decorations',
    question: 'Name something people place underneath the Christmas tree besides presents.',
    answers: [
      { text: 'Decorative Tree Skirt', points: 35 },
      { text: 'Electric Toy Train Set', points: 24 },
      { text: 'Woven Collar / Basket Base', points: 12 },
      { text: 'Faux Snow Blanket', points: 9 },
      { text: 'Light-Up Decorative Gift Boxes', points: 7 },
      { text: 'Plush Santa or Snowman', points: 5 },
      { text: 'Mini Christmas Village', points: 4 },
      { text: 'Watering Funnel / Mat', points: 4 }
    ]
  },
  {
    id: 'cf-118',
    category: 'Christmas Decorations',
    question: 'Name a room in the house people unexpectedly decorate for Christmas.',
    answers: [
      { text: 'Guest Bathroom (Holiday Towels & Soap)', points: 32 },
      { text: 'Kitchen (Festive Mugs & Towels)', points: 24 },
      { text: 'Bedrooms (Mini Tree & Pillows)', points: 16 },
      { text: 'Home Office / Desk', points: 10 },
      { text: 'Staircase Banister', points: 8 },
      { text: 'Front Porch / Balcony', points: 5 },
      { text: 'Garage Door (Giant Bow)', points: 3 },
      { text: 'Car Dashboard (Antlers & Red Nose)', points: 2 }
    ]
  },
  {
    id: 'cf-119',
    category: 'Christmas Decorations',
    question: 'Name a collectible holiday decoration people display year after year.',
    answers: [
      { text: 'Miniature Ceramic Christmas Village', points: 30 },
      { text: 'Wooden Nutcrackers', points: 24 },
      { text: 'Musical Snow Globes', points: 17 },
      { text: 'Handcrafted Nativity Set', points: 11 },
      { text: 'Vintage Ceramic Light-Up Tree', points: 7 },
      { text: 'Santa Claus Figurines', points: 5 },
      { text: 'German Wooden Pyramid / Smoker', points: 3 },
      { text: 'Silver Collector Bells', points: 3 }
    ]
  },
  {
    id: 'cf-120',
    category: 'Christmas Decorations',
    question: 'Name a popular scent people diffuse or burn in candles during Christmas.',
    answers: [
      { text: 'Fresh Pine / Balsam Fir', points: 33 },
      { text: 'Cinnamon Spice', points: 22 },
      { text: 'Peppermint / Candy Cane', points: 15 },
      { text: 'Vanilla Sugar Cookie', points: 10 },
      { text: 'Gingerbread', points: 7 },
      { text: 'Spiced Apple Cider', points: 5 },
      { text: 'Cranberry Orange', points: 4 },
      { text: 'Crackling Wood Fireplace', points: 4 }
    ]
  },

  // Category 6: Santa Claus and the North Pole (121-123)
  {
    id: 'cf-121',
    category: 'Santa Claus and the North Pole',
    question: 'Name a job an elf might hold at the North Pole.',
    answers: [
      { text: 'Toy Maker / Painter', points: 34 },
      { text: 'Gift Wrapper', points: 21 },
      { text: 'Reindeer Barn Caretaker', points: 15 },
      { text: 'Mailroom Letter Sorter', points: 11 },
      { text: 'Sleigh Mechanic & Polisher', points: 7 },
      { text: 'Naughty & Nice List Checker', points: 5 },
      { text: 'Cookie Baker Assistant', points: 4 },
      { text: 'Sleigh Loader', points: 3 }
    ]
  },
  {
    id: 'cf-122',
    category: 'Santa Claus and the North Pole',
    question: 'Name another name for Santa Claus used around the world.',
    answers: [
      { text: 'Saint Nicholas / St. Nick', points: 34 },
      { text: 'Father Christmas', points: 24 },
      { text: 'Kris Kringle', points: 18 },
      { text: 'Père Noël (France)', points: 8 },
      { text: 'Papá Noel (Spain / Latin America)', points: 6 },
      { text: 'Sinterklaas (Netherlands)', points: 5 },
      { text: 'Babbo Natale (Italy)', points: 3 },
      { text: 'Joulupukki (Finland)', points: 2 }
    ]
  },
  {
    id: 'cf-123',
    category: 'Santa Claus and the North Pole',
    question: 'Name something Mrs. Claus does to keep the North Pole running smoothly.',
    answers: [
      { text: 'Bakes Cookies & Hot Cocoa for Everyone', points: 33 },
      { text: 'Organizes Santa’s Schedule & Lists', points: 22 },
      { text: 'Mends & Presses Santa’s Red Suit', points: 15 },
      { text: 'Supervises the Elves’ Workshop', points: 11 },
      { text: 'Feeds & Cares for the Reindeer', points: 7 },
      { text: 'Makes Sure Santa Bundles Up Warm', points: 5 },
      { text: 'Reads Children’s Letters', points: 4 },
      { text: 'Decorates the North Pole Cottage', points: 3 }
    ]
  },

  // Category 7: Christmas Activities (124-126)
  {
    id: 'cf-124',
    category: 'Christmas Activities',
    question: 'Name a classic thing people visit a Christmas Tree Farm to do.',
    answers: [
      { text: 'Cut Down Their Own Fresh Tree', points: 36 },
      { text: 'Drink Hot Apple Cider or Cocoa', points: 20 },
      { text: 'Take Family Holiday Photos', points: 15 },
      { text: 'Ride a Tractor Hayride', points: 10 },
      { text: 'Buy a Fresh Pine Wreath', points: 7 },
      { text: 'Pet Reindeer or Farm Animals', points: 5 },
      { text: 'Meet Santa in the Barn', points: 4 },
      { text: 'Tie the Tree to the Car Roof', points: 3 }
    ]
  },
  {
    id: 'cf-125',
    category: 'Christmas Activities',
    question: 'Name something people do on Christmas afternoon once gifts and dinner are done.',
    answers: [
      { text: 'Watch Christmas Movies Together', points: 29 },
      { text: 'Take a Post-Feast Nap', points: 22 },
      { text: 'Play Board Games or Christmas FEUD', points: 16 },
      { text: 'Watch NBA / Sports on TV', points: 10 },
      { text: 'Go for a Brisk Winter Walk', points: 8 },
      { text: 'Eat Pie & Drink Coffee', points: 7 },
      { text: 'Assemble New Toys / Play Video Games', points: 4 },
      { text: 'Facetiming Distant Relatives', points: 4 }
    ]
  },
  {
    id: 'cf-126',
    category: 'Christmas Activities',
    question: 'Name something families do with old Christmas cards after the holidays.',
    answers: [
      { text: 'Display Them All Season Then Recycle', points: 29 },
      { text: 'Save Photo Cards in a Keepsake Box', points: 24 },
      { text: 'Cut Fronts Into Next Year’s Gift Tags', points: 16 },
      { text: 'Keep Cards From Closest Relatives', points: 11 },
      { text: 'Update Address Book for Next Year', points: 8 },
      { text: 'Make a Scrapbook / Ring Binder', points: 6 },
      { text: 'Donate Fronts for Crafts', points: 3 },
      { text: 'Leave Them on the Fridge Until March', points: 3 }
    ]
  },

  // Category 8: Christmas Family and Friends (127-129)
  {
    id: 'cf-127',
    category: 'Christmas Family and Friends',
    question: 'Name a childhood Christmas memory almost everyone treasures forever.',
    answers: [
      { text: 'Waking Up Early to See Presents Under Tree', points: 32 },
      { text: 'Baking Cookies With Grandma or Mom', points: 21 },
      { text: 'Waiting Up Trying to Hear Santa’s Sleigh', points: 15 },
      { text: 'Snow Days & Sledding With Cousins', points: 11 },
      { text: 'School Christmas Pageants & Choirs', points: 7 },
      { text: 'Getting That One Dream Toy', points: 6 },
      { text: 'Looking at Neighborhood Christmas Lights', points: 4 },
      { text: 'Falling Asleep on the Car Ride Home', points: 4 }
    ]
  },
  {
    id: 'cf-128',
    category: 'Christmas Family and Friends',
    question: 'Name something siblings playfully argue about on Christmas morning.',
    answers: [
      { text: 'Who Gets to Open the First Gift', points: 30 },
      { text: 'Who Woke Up Too Early', points: 21 },
      { text: 'Who Got More Presents', points: 16 },
      { text: 'Sharing New Video Games or Toys', points: 12 },
      { text: 'Whose Turn It Is to Play Santa', points: 8 },
      { text: 'Which Christmas Movie to Put On', points: 6 },
      { text: 'Who Gets the Biggest Stocking', points: 4 },
      { text: 'Taking Turns With the Good Chair', points: 3 }
    ]
  },
  {
    id: 'cf-129',
    category: 'Christmas Family and Friends',
    question: 'Name a way long-distance families stay connected on Christmas Day.',
    answers: [
      { text: 'Video Calling (FaceTime / Zoom)', points: 38 },
      { text: 'Opening Shipped Presents Live on Camera', points: 21 },
      { text: 'Sending Family Group-Chat Photos', points: 15 },
      { text: 'Playing Online Multiplayer Games Together', points: 10 },
      { text: 'Mailing Holiday Care Packages Early', points: 7 },
      { text: 'Watching the Same Movie Together Virtually', points: 4 },
      { text: 'Recording Heartfelt Video Messages', points: 3 },
      { text: 'Traditional Long Phone Call', points: 2 }
    ]
  },

  // Category 9: Winter and Snow (130-132)
  {
    id: 'cf-130',
    category: 'Winter and Snow',
    question: 'Name something you keep inside your car trunk during snowy December weather.',
    answers: [
      { text: 'Ice Scraper & Snow Brush', points: 36 },
      { text: 'Warm Emergency Blanket', points: 19 },
      { text: 'Jumper Cables', points: 14 },
      { text: 'Foldable Snow Shovel', points: 10 },
      { text: 'Extra Gloves & Knit Hat', points: 7 },
      { text: 'Flashlight & First-Aid Kit', points: 6 },
      { text: 'Bag of Kitty Litter or Sand (Traction)', points: 5 },
      { text: 'Windshield De-Icer Spray', points: 3 }
    ]
  },
  {
    id: 'cf-131',
    category: 'Winter and Snow',
    question: 'Name a word people use to describe a picture-perfect winter landscape.',
    answers: [
      { text: 'Magical / Winter Wonderland', points: 31 },
      { text: 'Snowy / White', points: 22 },
      { text: 'Sparkling / Glistening', points: 15 },
      { text: 'Peaceful / Serene', points: 11 },
      { text: 'Frosty / Crisp', points: 8 },
      { text: 'Cozy', points: 6 },
      { text: 'Frozen / Icy', points: 4 },
      { text: 'Picturesque / Postcard-Perfect', points: 3 }
    ]
  },
  {
    id: 'cf-132',
    category: 'Winter and Snow',
    question: 'Name something that melts fast once winter turns warm.',
    answers: [
      { text: 'Snowman', points: 36 },
      { text: 'Icicles Hanging From the Roof', points: 23 },
      { text: 'Snowflakes on Your Tongue', points: 15 },
      { text: 'Snowball / Snow Fort', points: 10 },
      { text: 'Frozen Pond / Ice Rink', points: 6 },
      { text: 'Frost on Windowpanes', points: 4 },
      { text: 'Marshmallows in Hot Cocoa', points: 3 },
      { text: 'Butter on Warm Holiday Rolls', points: 3 }
    ]
  },

  // Category 10: Christmas Travel (133-135)
  {
    id: 'cf-133',
    category: 'Christmas Travel',
    question: 'Name a mode of transportation featured in famous Christmas songs or movies.',
    answers: [
      { text: 'Santa’s Flying Sleigh', points: 37 },
      { text: 'The Polar Express Steam Train', points: 25 },
      { text: 'One-Horse Open Sleigh / Carriage', points: 14 },
      { text: 'Airplane (Home Alone)', points: 10 },
      { text: 'Family Station Wagon With Tree on Roof', points: 6 },
      { text: 'Tour Bus / Polka Band Van', points: 3 },
      { text: 'Snowmobile', points: 3 },
      { text: 'Three Ships (I Saw Three Ships)', points: 2 }
    ]
  },
  {
    id: 'cf-134',
    category: 'Christmas Travel',
    question: 'Name a cozy amenity people look for when renting a Christmas winter cabin.',
    answers: [
      { text: 'Wood-Burning Fireplace', points: 33 },
      { text: 'Outdoor Steaming Hot Tub', points: 24 },
      { text: 'Scenic Mountain / Snow Views', points: 14 },
      { text: 'Full Kitchen for Holiday Cooking', points: 10 },
      { text: 'Already Decorated Christmas Tree', points: 7 },
      { text: 'Game Room (Pool / Board Games)', points: 5 },
      { text: 'Ski-In / Ski-Out Access', points: 4 },
      { text: 'Fast Wi-Fi & Cozy Blankets', points: 3 }
    ]
  },
  {
    id: 'cf-135',
    category: 'Christmas Travel',
    question: 'Name something travelers always buy at the airport during Christmas week.',
    answers: [
      { text: 'Hot Coffee or Latte', points: 32 },
      { text: 'Last-Minute Souvenir / Chocolate Gift', points: 20 },
      { text: 'Snacks & Bottled Water', points: 16 },
      { text: 'Neck Pillow or Cozy Blanket', points: 10 },
      { text: 'Magazine or Paperback Book', points: 8 },
      { text: 'Forgotten Phone Charger / Earbuds', points: 6 },
      { text: 'Warm Airport Meal', points: 4 },
      { text: 'Hand Sanitizer or Cough Drops', points: 4 }
    ]
  },

  // Category 11: Christmas Parties (136-138)
  {
    id: 'cf-136',
    category: 'Christmas Parties',
    question: 'Name an unforgettable prize people love winning at a Christmas party raffle.',
    answers: [
      { text: 'Gift Cards or Cash Envelope', points: 31 },
      { text: 'Smart TV or Headphones', points: 22 },
      { text: 'Extra Paid Day Off Work', points: 15 },
      { text: 'Luxury Holiday Gift Basket', points: 11 },
      { text: 'Coffee / Espresso Machine', points: 8 },
      { text: 'Bottle of Champagne or Wine', points: 6 },
      { text: 'Weekend Hotel Voucher', points: 4 },
      { text: 'Cozy Throw Blanket Set', points: 3 }
    ]
  },
  {
    id: 'cf-137',
    category: 'Christmas Parties',
    question: 'Name a polite white lie people use to leave a Christmas party early.',
    answers: [
      { text: '"We Have to Relieve the Babysitter"', points: 29 },
      { text: '"We Have Another Party / Family Stop"', points: 23 },
      { text: '"We Need to Let the Dog Out"', points: 16 },
      { text: '"Early Morning Tomorrow!"', points: 12 },
      { text: '"Roads Are Getting Snowy / Icy"', points: 8 },
      { text: '"Kids Are Getting Way Past Bedtime"', points: 6 },
      { text: '"Still Have Presents to Wrap Tonight"', points: 3 },
      { text: '"Coming Down With a Little Headache"', points: 3 }
    ]
  },
  {
    id: 'cf-138',
    category: 'Christmas Parties',
    question: 'Name a classic festive attire choice for a dressy Christmas Eve party.',
    answers: [
      { text: 'Velvet Red or Emerald Dress', points: 31 },
      { text: 'Sparkly Sequined Top or Skirt', points: 22 },
      { text: 'Tartan Plaid Shirt or Tie', points: 15 },
      { text: 'Sharp Blazer with Holiday Pocket Square', points: 11 },
      { text: 'Cashmere Sweater & Trousers', points: 8 },
      { text: 'Gold Statement Earrings / Jewelry', points: 5 },
      { text: 'Festive Bow Tie', points: 4 },
      { text: 'Dressy Boots or Heels', points: 4 }
    ]
  },

  // Category 12: Christmas Food and Drinks (139-141)
  {
    id: 'cf-139',
    category: 'Christmas Food and Drinks',
    question: 'Name a popular appetizer served on a Christmas party table.',
    answers: [
      { text: 'Cheese & Charcuterie Board', points: 29 },
      { text: 'Pigs in a Blanket', points: 21 },
      { text: 'Cranberry Glazed Meatballs', points: 15 },
      { text: 'Shrimp Cocktail', points: 11 },
      { text: 'Baked Brie with Jam', points: 9 },
      { text: 'Spinach Artichoke Dip', points: 6 },
      { text: 'Deviled Eggs', points: 5 },
      { text: 'Stuffed Mushrooms', points: 4 }
    ]
  },
  {
    id: 'cf-140',
    category: 'Christmas Food and Drinks',
    question: 'Name a delicious dish people make using Christmas dinner leftovers.',
    answers: [
      { text: 'Turkey & Cranberry Sandwich', points: 36 },
      { text: 'Turkey Noodle Soup', points: 19 },
      { text: 'Turkey Pot Pie', points: 14 },
      { text: 'Ham & Swiss Sliders', points: 10 },
      { text: 'Leftover Breakfast Hash', points: 7 },
      { text: 'Split Pea & Ham Soup', points: 6 },
      { text: 'Stuffing Waffles with Gravy', points: 4 },
      { text: 'Open-Faced Hot Turkey Plate', points: 4 }
    ]
  },
  {
    id: 'cf-141',
    category: 'Christmas Food and Drinks',
    question: 'Name an item people set out on a DIY Christmas Hot Chocolate Bar.',
    answers: [
      { text: 'Mini Marshmallows', points: 33 },
      { text: 'Whipped Cream', points: 23 },
      { text: 'Crushed Candy Canes / Peppermints', points: 15 },
      { text: 'Chocolate & Caramel Drizzle', points: 10 },
      { text: 'Cinnamon Sticks', points: 7 },
      { text: 'Holiday Sprinkles', points: 5 },
      { text: 'Wafer Cookies / Pirouettes', points: 4 },
      { text: 'Chocolate Shavings or Chips', points: 3 }
    ]
  },

  // Category 13: Christmas Shopping (142-144)
  {
    id: 'cf-142',
    category: 'Christmas Shopping',
    question: 'Name a smart money-saving trick people use for Christmas shopping.',
    answers: [
      { text: 'Drawing Names / Secret Santa Limits', points: 29 },
      { text: 'Shopping Black Friday & Online Sales', points: 22 },
      { text: 'Setting a Strict Per-Person Budget', points: 16 },
      { text: 'Buying Gifts Months in Advance', points: 11 },
      { text: 'Making Homemade DIY Gifts', points: 8 },
      { text: 'Using Cashback Rewards / Points', points: 6 },
      { text: 'Buying Wrapping Supplies on Clearance', points: 4 },
      { text: 'Comparing Prices Across Websites', points: 4 }
    ]
  },
  {
    id: 'cf-143',
    category: 'Christmas Shopping',
    question: 'Name something people buy specifically on December 26th clearance.',
    answers: [
      { text: 'Wrapping Paper & Gift Bags', points: 34 },
      { text: 'Discounted Holiday Candy & Chocolates', points: 22 },
      { text: 'Christmas Ornaments & Tree Decor', points: 15 },
      { text: 'String Lights for Next Year', points: 10 },
      { text: 'Artificial Christmas Tree', points: 7 },
      { text: 'Holiday Pajamas & Sweaters', points: 5 },
      { text: 'Boxed Christmas Cards', points: 4 },
      { text: 'Scented Winter Candles', points: 3 }
    ]
  },
  {
    id: 'cf-144',
    category: 'Christmas Shopping',
    question: 'Name a common reason people stand in the customer service return line after Christmas.',
    answers: [
      { text: 'Clothing Was the Wrong Size', points: 36 },
      { text: 'Received Two of the Exact Same Gift', points: 21 },
      { text: 'Just Not Their Style / Color', points: 15 },
      { text: 'Item Arrived Broken or Defective', points: 11 },
      { text: 'Trading for Store Credit / Cash', points: 7 },
      { text: 'Already Owned It', points: 5 },
      { text: 'Wrong Video Game Platform', points: 3 },
      { text: 'Exchanging Without a Gift Receipt', points: 2 }
    ]
  },

  // Category 14: Christmas Characters and Stories (145-147)
  {
    id: 'cf-145',
    category: 'Christmas Characters and Stories',
    question: 'Name a character from the classic ballet "The Nutcracker."',
    answers: [
      { text: 'The Nutcracker Prince', points: 30 },
      { text: 'Sugar Plum Fairy', points: 25 },
      { text: 'Clara (or Marie)', points: 17 },
      { text: 'The Mouse King', points: 12 },
      { text: 'Uncle Drosselmeyer', points: 7 },
      { text: 'Snow Queen', points: 4 },
      { text: 'Toy Soldiers', points: 3 },
      { text: 'Mother Ginger', points: 2 }
    ]
  },
  {
    id: 'cf-146',
    category: 'Christmas Characters and Stories',
    question: 'Name a beloved character from "Rudolph the Red-Nosed Reindeer" (1964).',
    answers: [
      { text: 'Rudolph', points: 31 },
      { text: 'Hermey the Dentist Elf', points: 21 },
      { text: 'Yukon Cornelius', points: 16 },
      { text: 'Bumble the Abominable Snow Monster', points: 12 },
      { text: 'Sam the Snowman (Narrator)', points: 7 },
      { text: 'Clarice', points: 5 },
      { text: 'King Moonracer', points: 4 },
      { text: 'Charlie-in-the-Box (Misfit Toys)', points: 4 }
    ]
  },
  {
    id: 'cf-147',
    category: 'Christmas Characters and Stories',
    question: 'Name a lesson learned at the end of almost every classic Christmas story.',
    answers: [
      { text: 'Christmas Is About Love, Not Presents', points: 35 },
      { text: 'Kindness & Generosity Change Lives', points: 22 },
      { text: 'Family & Togetherness Matter Most', points: 16 },
      { text: 'Even the Biggest Grump Can Change', points: 10 },
      { text: 'Believe in the Magic of the Season', points: 7 },
      { text: 'Being Different Makes You Special', points: 4 },
      { text: 'Forgiveness Heals Old Wounds', points: 3 },
      { text: 'Gratitude for What You Have', points: 3 }
    ]
  },

  // Category 15: Funny Christmas Situations (148-150)
  {
    id: 'cf-148',
    category: 'Funny Christmas Situations',
    question: 'Name a funny excuse someone gives for forgetting to buy a Christmas gift.',
    answers: [
      { text: '"It’s Delayed in Shipping / Backordered!"', points: 37 },
      { text: '"I Left It at Home by Mistake!"', points: 21 },
      { text: '"Your Gift Is a Surprise Experience Later"', points: 14 },
      { text: '"I Thought We Agreed No Gifts This Year!"', points: 11 },
      { text: '"I Wanted You to Pick It Out Yourself"', points: 7 },
      { text: '"The Store Sold Out Right Before I Got There"', points: 5 },
      { text: '"My Presence Is Your Present!"', points: 3 },
      { text: '"Santa Took It Back to Upgrade It"', points: 2 }
    ]
  },
  {
    id: 'cf-149',
    category: 'Funny Christmas Situations',
    question: 'Name a funny thing people do when their Christmas tree starts leaning sideways.',
    answers: [
      { text: 'Tie Fishing Line to the Wall or Curtain Rod', points: 30 },
      { text: 'Stuff Books or Cardboard Under the Stand', points: 23 },
      { text: 'Hang Heavy Ornaments on the Opposite Side', points: 16 },
      { text: 'Push It Tight Into the Corner', points: 12 },
      { text: 'Pretend Nobody Notices ("It’s Rustic!")', points: 8 },
      { text: 'Call Everyone in the House to Hold It', points: 5 },
      { text: 'Hide the Stand Behind Big Presents', points: 3 },
      { text: 'Take It All Down and Saw the Trunk Again', points: 3 }
    ]
  },
  {
    id: 'cf-150',
    category: 'Funny Christmas Situations',
    question: 'Name something funny people still have up well past New Year’s Day.',
    answers: [
      { text: 'Outdoor Roofline Christmas Lights', points: 35 },
      { text: 'The Artificial Christmas Tree', points: 24 },
      { text: 'Front Door Christmas Wreath', points: 15 },
      { text: 'Holiday Cards Taped to the Wall / Fridge', points: 10 },
      { text: 'Half-Eaten Tin of Holiday Cookies / Popcorn', points: 6 },
      { text: 'Christmas Throw Pillows & Doormat', points: 4 },
      { text: 'Pine Needles Still Found in the Carpet', points: 3 },
      { text: 'Inflatable Snowman Deflated on the Lawn', points: 3 }
    ]
  }
];

module.exports = STANDARD_ULTIMATE_EXTRA_ROUNDS;

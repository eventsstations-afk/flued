/**
 * CHRISTMAS FEUD — PRIVATE FAST MONEY QUESTION BANK (30 UNIQUE ALL-CHRISTMAS QUESTIONS)
 * Covers all 15 official Christmas categories (2 per category, 6 sets of 5).
 *
 * CRITICAL PRIVACY POLICY:
 * - Accepted answers, point values, and administrator notes belong EXCLUSIVELY in the
 *   Administrator Studio Editor and Administrator-Only PDF Answer Key export.
 * - Live Fast Money gameplay NEVER sends acceptedAnswers, points, or notes to Players,
 *   Audience, or live Host play screens, and contains ZERO automatic answer matching.
 * - Point values are illustrative game-show data, not verified survey research.
 */

const FAST_MONEY_QUESTIONS = [
  // SET 1 (Questions 1–5)
  {
    id: 'fm-001',
    set: 1,
    category: 'Christmas Gifts',
    question: 'Name a popular Christmas gift people give to almost anyone.',
    acceptedAnswers: [
      { text: 'Gift Card', points: 32 },
      { text: 'Socks or Slippers', points: 22 },
      { text: 'Scented Candle', points: 15 },
      { text: 'Pajamas or Cozy Blanket', points: 12 },
      { text: 'Chocolates / Gourmet Treats', points: 9 },
      { text: 'Coffee Mug', points: 6 },
      { text: 'Sweater or Scarf', points: 4 }
    ],
    notes: 'Accept specific store gift cards (Amazon, Starbucks, Visa) under Gift Card (32 pts). Accept fuzzy/wool socks under Socks (22 pts).'
  },
  {
    id: 'fm-002',
    set: 1,
    category: 'Christmas Movies',
    question: 'Name a famous Christmas movie people watch every December.',
    acceptedAnswers: [
      { text: 'Home Alone', points: 31 },
      { text: 'Elf', points: 24 },
      { text: 'How the Grinch Stole Christmas', points: 15 },
      { text: 'It’s a Wonderful Life', points: 11 },
      { text: 'National Lampoon’s Christmas Vacation', points: 8 },
      { text: 'A Christmas Story', points: 6 },
      { text: 'The Polar Express', points: 5 }
    ],
    notes: 'Accept any Grinch version (1966, Jim Carrey, 2018) under Grinch (15 pts). Accept Home Alone 1 or 2 under Home Alone (31 pts).'
  },
  {
    id: 'fm-003',
    set: 1,
    category: 'Christmas Decorations',
    question: 'Name something people hang on a Christmas tree.',
    acceptedAnswers: [
      { text: 'Ornaments / Baubles', points: 35 },
      { text: 'String Lights', points: 24 },
      { text: 'Star or Angel Topper', points: 14 },
      { text: 'Tinsel or Garland', points: 11 },
      { text: 'Candy Canes', points: 8 },
      { text: 'Ribbon Bows', points: 5 },
      { text: 'Icicles / Snowflakes', points: 3 }
    ],
    notes: 'Accept glass balls, photo ornaments, or keepsakes under Ornaments (35 pts). Accept fairy lights under String Lights (24 pts).'
  },
  {
    id: 'fm-004',
    set: 1,
    category: 'Christmas Music',
    question: 'Name a Christmas song almost everyone knows the words to.',
    acceptedAnswers: [
      { text: 'Jingle Bells', points: 30 },
      { text: 'All I Want for Christmas Is You', points: 25 },
      { text: 'Silent Night', points: 14 },
      { text: 'Rudolph the Red-Nosed Reindeer', points: 11 },
      { text: 'White Christmas', points: 8 },
      { text: 'Last Christmas', points: 7 },
      { text: 'Deck the Halls', points: 5 }
    ],
    notes: 'Accept Mariah Carey reference as All I Want for Christmas Is You (25 pts).'
  },
  {
    id: 'fm-005',
    set: 1,
    category: 'Santa Claus and the North Pole',
    question: 'Name one of Santa Claus’s reindeer.',
    acceptedAnswers: [
      { text: 'Rudolph', points: 38 },
      { text: 'Dasher', points: 19 },
      { text: 'Dancer', points: 13 },
      { text: 'Prancer', points: 10 },
      { text: 'Vixen', points: 7 },
      { text: 'Comet / Cupid', points: 7 },
      { text: 'Donner / Blitzen', points: 6 }
    ],
    notes: 'If Player 2 repeats the exact same reindeer as Player 1, score 0 points per standard Fast Money duplicate rules.'
  },

  // SET 2 (Questions 6–10)
  {
    id: 'fm-006',
    set: 2,
    category: 'Christmas Traditions',
    question: 'Name something families do together on Christmas Eve.',
    acceptedAnswers: [
      { text: 'Open One Present Early', points: 31 },
      { text: 'Attend Church / Midnight Mass', points: 22 },
      { text: 'Wear Matching Pajamas', points: 15 },
      { text: 'Watch a Christmas Movie', points: 12 },
      { text: 'Drive to See Christmas Lights', points: 9 },
      { text: 'Leave Out Cookies for Santa', points: 6 },
      { text: 'Big Family Dinner', points: 5 }
    ],
    notes: 'Accept candlelight service under Church / Midnight Mass (22 pts).'
  },
  {
    id: 'fm-007',
    set: 2,
    category: 'Christmas Food and Drinks',
    question: 'Name a popular drink people enjoy at Christmas.',
    acceptedAnswers: [
      { text: 'Hot Chocolate / Cocoa', points: 34 },
      { text: 'Eggnog', points: 26 },
      { text: 'Warm Apple Cider', points: 15 },
      { text: 'Mulled Wine', points: 11 },
      { text: 'Peppermint Mocha / Coffee', points: 7 },
      { text: 'Holiday Punch', points: 4 },
      { text: 'Champagne / Mimosa', points: 3 }
    ],
    notes: 'Accept hot cocoa or cocoa under Hot Chocolate (34 pts). Accept spiced wine or Glühwein under Mulled Wine (11 pts).'
  },
  {
    id: 'fm-008',
    set: 2,
    category: 'Winter and Snow',
    question: 'Name something people put on a snowman.',
    acceptedAnswers: [
      { text: 'Carrot Nose', points: 37 },
      { text: 'Scarf', points: 21 },
      { text: 'Hat / Top Hat / Beanie', points: 16 },
      { text: 'Stick Arms', points: 11 },
      { text: 'Coal Eyes or Buttons', points: 9 },
      { text: 'Corncob Pipe', points: 4 },
      { text: 'Mittens', points: 2 }
    ],
    notes: 'Accept carrot for Carrot Nose (37 pts) and tree branches/twigs for Stick Arms (11 pts).'
  },
  {
    id: 'fm-009',
    set: 2,
    category: 'Christmas Shopping',
    question: 'Name something people forget to buy until Christmas Eve.',
    acceptedAnswers: [
      { text: 'Wrapping Paper / Tape', points: 30 },
      { text: 'Batteries', points: 23 },
      { text: 'Gift Cards', points: 16 },
      { text: 'Groceries / Dinner Rolls', points: 11 },
      { text: 'Stocking Stuffers', points: 9 },
      { text: 'Wine / Drinks', points: 6 },
      { text: 'Greeting Cards / Tags', points: 5 }
    ],
    notes: 'Accept Scotch tape, ribbon, or gift bags under Wrapping Paper / Tape (30 pts).'
  },
  {
    id: 'fm-010',
    set: 2,
    category: 'Christmas Parties',
    question: 'Name something you always see at an office Christmas party.',
    acceptedAnswers: [
      { text: 'Ugly Christmas Sweaters', points: 32 },
      { text: 'Secret Santa / White Elephant', points: 22 },
      { text: 'Cookie & Appetizer Buffet', points: 16 },
      { text: 'Holiday Drinks / Punch', points: 11 },
      { text: 'Photo Booth / Props', points: 8 },
      { text: 'Boss Speech / Toast', points: 6 },
      { text: 'Raffle Prizes', points: 5 }
    ],
    notes: 'Accept Yankee Swap under Secret Santa / White Elephant (22 pts).'
  },

  // SET 3 (Questions 11–15)
  {
    id: 'fm-011',
    set: 3,
    category: 'Christmas Activities',
    question: 'Name a classic December activity that gets people in the holiday spirit.',
    acceptedAnswers: [
      { text: 'Decorating the Tree', points: 31 },
      { text: 'Looking at Christmas Lights', points: 22 },
      { text: 'Baking Christmas Cookies', points: 16 },
      { text: 'Watching Holiday Movies', points: 12 },
      { text: 'Ice Skating', points: 8 },
      { text: 'Visiting a Christmas Market', points: 6 },
      { text: 'Christmas Caroling', points: 5 }
    ],
    notes: 'Accept driving around to see lights or light shows under Looking at Christmas Lights (22 pts).'
  },
  {
    id: 'fm-012',
    set: 3,
    category: 'Christmas Characters and Stories',
    question: 'Name a famous Christmas character besides Santa Claus.',
    acceptedAnswers: [
      { text: 'Rudolph', points: 30 },
      { text: 'The Grinch', points: 24 },
      { text: 'Frosty the Snowman', points: 17 },
      { text: 'Mrs. Claus', points: 11 },
      { text: 'Ebenezer Scrooge', points: 8 },
      { text: 'Buddy the Elf / Elves', points: 6 },
      { text: 'The Nutcracker', points: 4 }
    ],
    notes: 'Accept Scrooge or Tiny Tim from A Christmas Carol under Ebenezer Scrooge (8 pts).'
  },
  {
    id: 'fm-013',
    set: 3,
    category: 'Christmas Family and Friends',
    question: 'Name something people say right after opening a Christmas gift.',
    acceptedAnswers: [
      { text: '"Thank you so much!"', points: 35 },
      { text: '"I love it!"', points: 24 },
      { text: '"Just what I wanted!"', points: 16 },
      { text: '"You shouldn’t have!"', points: 11 },
      { text: '"How did you know?"', points: 6 },
      { text: '"Oh wow!"', points: 5 },
      { text: '"Merry Christmas!"', points: 3 }
    ],
    notes: 'Accept close polite expressions of gratitude in the matching tier.'
  },
  {
    id: 'fm-014',
    set: 3,
    category: 'Christmas Travel',
    question: 'Name a dream city or place to visit for Christmas.',
    acceptedAnswers: [
      { text: 'New York City', points: 36 },
      { text: 'Ski Resort / Mountain Cabin', points: 19 },
      { text: 'London', points: 13 },
      { text: 'Germany (Christmas Markets)', points: 11 },
      { text: 'Warm Beach / Hawaii', points: 9 },
      { text: 'Paris', points: 6 },
      { text: 'Lapland / North Pole / Finland', points: 6 }
    ],
    notes: 'Accept Rockefeller Center or NYC under New York City (36 pts). Accept Aspen/Alps/Colorado under Ski Resort (19 pts).'
  },
  {
    id: 'fm-015',
    set: 3,
    category: 'Funny Christmas Situations',
    question: 'Name a holiday mishap that happens with Christmas decorations.',
    acceptedAnswers: [
      { text: 'Tangled String Lights', points: 35 },
      { text: 'Lights Won’t Turn On / Burned Out', points: 22 },
      { text: 'Pet Knocks Over the Tree', points: 16 },
      { text: 'Broken Glass Ornament', points: 11 },
      { text: 'Tree Leaning or Falling Over', points: 8 },
      { text: 'Blowing a Fuse / Breaker', points: 5 },
      { text: 'Glitter Everywhere', points: 3 }
    ],
    notes: 'Accept cat climbing tree under Pet Knocks Over the Tree (16 pts).'
  },

  // SET 4 (Questions 16–20)
  {
    id: 'fm-016',
    set: 4,
    category: 'Christmas Food and Drinks',
    question: 'Name a classic dish served at Christmas dinner.',
    acceptedAnswers: [
      { text: 'Roast Turkey', points: 34 },
      { text: 'Glazed Ham', points: 26 },
      { text: 'Mashed Potatoes', points: 14 },
      { text: 'Stuffing / Dressing', points: 11 },
      { text: 'Roast Beef / Prime Rib', points: 7 },
      { text: 'Cranberry Sauce', points: 5 },
      { text: 'Pie / Christmas Pudding', points: 3 }
    ],
    notes: 'Accept honey ham or spiral ham under Glazed Ham (26 pts).'
  },
  {
    id: 'fm-017',
    set: 4,
    category: 'Christmas Decorations',
    question: 'Name an outdoor Christmas decoration you see in neighborhoods.',
    acceptedAnswers: [
      { text: 'String / Roofline Lights', points: 33 },
      { text: 'Giant Inflatable Santa / Snowman', points: 23 },
      { text: 'Light-Up Reindeer', points: 16 },
      { text: 'Front Door Wreath', points: 11 },
      { text: 'Nativity Scene', points: 8 },
      { text: 'Candy Cane Walkway Lights', points: 5 },
      { text: 'Light Projector', points: 4 }
    ],
    notes: 'Accept icicle lights under String / Roofline Lights (33 pts).'
  },
  {
    id: 'fm-018',
    set: 4,
    category: 'Winter and Snow',
    question: 'Name an item of winter clothing you wear in freezing weather.',
    acceptedAnswers: [
      { text: 'Winter Coat / Jacket', points: 32 },
      { text: 'Gloves / Mittens', points: 22 },
      { text: 'Knit Hat / Beanie', points: 16 },
      { text: 'Scarf', points: 13 },
      { text: 'Snow Boots', points: 10 },
      { text: 'Warm Socks', points: 4 },
      { text: 'Snow Pants', points: 3 }
    ],
    notes: 'Accept parka or puffy jacket under Winter Coat (32 pts).'
  },
  {
    id: 'fm-019',
    set: 4,
    category: 'Christmas Gifts',
    question: 'Name something you need when wrapping Christmas presents.',
    acceptedAnswers: [
      { text: 'Tape', points: 35 },
      { text: 'Wrapping Paper', points: 25 },
      { text: 'Scissors', points: 17 },
      { text: 'Ribbon / Bows', points: 11 },
      { text: 'Gift Tags & Pen', points: 6 },
      { text: 'Gift Bags / Tissue Paper', points: 4 },
      { text: 'Gift Boxes', points: 2 }
    ],
    notes: 'Accept Scotch tape or clear tape under Tape (35 pts).'
  },
  {
    id: 'fm-020',
    set: 4,
    category: 'Christmas Music',
    question: 'Name a singer famous for Christmas music.',
    acceptedAnswers: [
      { text: 'Mariah Carey', points: 36 },
      { text: 'Michael Bublé', points: 24 },
      { text: 'Bing Crosby', points: 14 },
      { text: 'Frank Sinatra', points: 10 },
      { text: 'Nat King Cole', points: 7 },
      { text: 'Brenda Lee', points: 5 },
      { text: 'Elvis Presley / Wham!', points: 4 }
    ],
    notes: 'Accept George Michael under Elvis Presley / Wham! (4 pts).'
  },

  // SET 5 (Questions 21–25)
  {
    id: 'fm-021',
    set: 5,
    category: 'Christmas Traditions',
    question: 'Name something people do first thing on Christmas morning.',
    acceptedAnswers: [
      { text: 'Open Presents / Check Tree', points: 34 },
      { text: 'Make Coffee / Breakfast', points: 22 },
      { text: 'Open Stockings', points: 16 },
      { text: 'Wake Up Family / Kids', points: 11 },
      { text: 'Turn On Tree Lights', points: 8 },
      { text: 'Take Photos', points: 5 },
      { text: 'Check Santa’s Cookie Plate', points: 4 }
    ],
    notes: 'Accept drinking coffee or cinnamon rolls under Make Coffee / Breakfast (22 pts).'
  },
  {
    id: 'fm-022',
    set: 5,
    category: 'Santa Claus and the North Pole',
    question: 'Name something Santa Claus wears.',
    acceptedAnswers: [
      { text: 'Red Suit / Coat', points: 34 },
      { text: 'Santa Hat', points: 24 },
      { text: 'Black Boots', points: 15 },
      { text: 'Black Belt with Gold Buckle', points: 12 },
      { text: 'White Gloves / Mittens', points: 7 },
      { text: 'Glasses / Spectacles', points: 5 },
      { text: 'White Fur Trim', points: 3 }
    ],
    notes: 'Beard is facial hair rather than clothing; host may award 0 or use discretion if player says fake beard.'
  },
  {
    id: 'fm-023',
    set: 5,
    category: 'Christmas Shopping',
    question: 'Name a popular hiding place for Christmas presents.',
    acceptedAnswers: [
      { text: 'Closet (Top Shelf)', points: 36 },
      { text: 'Car Trunk', points: 22 },
      { text: 'Under the Bed', points: 14 },
      { text: 'Attic or Basement', points: 12 },
      { text: 'Garage', points: 7 },
      { text: 'Inside Suitcases / Bins', points: 5 },
      { text: 'Neighbor’s or Relative’s House', points: 4 }
    ],
    notes: 'Accept master bedroom closet or wardrobe under Closet (36 pts).'
  },
  {
    id: 'fm-024',
    set: 5,
    category: 'Christmas Travel',
    question: 'Name an annoyance when flying during Christmas week.',
    acceptedAnswers: [
      { text: 'Flight Delays / Cancellations', points: 33 },
      { text: 'Long Security Lines', points: 25 },
      { text: 'Crowds / Packed Planes', points: 16 },
      { text: 'High Ticket Prices', points: 10 },
      { text: 'Lost or Heavy Luggage', points: 8 },
      { text: 'Snowstorms', points: 5 },
      { text: 'Airport Traffic / Parking', points: 3 }
    ],
    notes: 'Accept TSA lines under Long Security Lines (25 pts).'
  },
  {
    id: 'fm-025',
    set: 5,
    category: 'Christmas Parties',
    question: 'Name a game people play at Christmas parties.',
    acceptedAnswers: [
      { text: 'White Elephant / Secret Santa', points: 33 },
      { text: 'Trivia / Christmas FEUD', points: 21 },
      { text: 'Charades / Pictionary', points: 15 },
      { text: 'Board or Card Games', points: 12 },
      { text: 'Saran Wrap Ball Game', points: 8 },
      { text: 'Christmas Bingo', points: 6 },
      { text: 'Name That Holiday Tune', points: 5 }
    ],
    notes: 'Accept Dirty Santa or Yankee Swap under White Elephant (33 pts).'
  },

  // SET 6 (Questions 26–30)
  {
    id: 'fm-026',
    set: 6,
    category: 'Christmas Movies',
    question: 'Name an animated Christmas TV special or movie.',
    acceptedAnswers: [
      { text: 'Rudolph the Red-Nosed Reindeer', points: 30 },
      { text: 'A Charlie Brown Christmas', points: 23 },
      { text: 'The Polar Express', points: 17 },
      { text: 'Frosty the Snowman', points: 13 },
      { text: 'How the Grinch Stole Christmas', points: 9 },
      { text: 'The Nightmare Before Christmas', points: 5 },
      { text: 'Klaus', points: 3 }
    ],
    notes: 'Accept Peanuts Christmas under A Charlie Brown Christmas (23 pts).'
  },
  {
    id: 'fm-027',
    set: 6,
    category: 'Christmas Activities',
    question: 'Name a Christmas craft kids make at school or home.',
    acceptedAnswers: [
      { text: 'Paper Snowflakes', points: 31 },
      { text: 'Homemade Ornaments', points: 24 },
      { text: 'Christmas Cards', points: 16 },
      { text: 'Popsicle Stick Crafts', points: 11 },
      { text: 'Paper Chains', points: 8 },
      { text: 'Popcorn Garland', points: 6 },
      { text: 'Pinecone Trees', points: 4 }
    ],
    notes: 'Accept handprint ornaments or clay ornaments under Homemade Ornaments (24 pts).'
  },
  {
    id: 'fm-028',
    set: 6,
    category: 'Christmas Family and Friends',
    question: 'Name a common question relatives ask at Christmas dinner.',
    acceptedAnswers: [
      { text: '"How is work or school?"', points: 31 },
      { text: '"Are you dating / getting married?"', points: 25 },
      { text: '"What did you get for Christmas?"', points: 16 },
      { text: '"Want seconds / dessert?"', points: 11 },
      { text: '"When are you having kids?"', points: 8 },
      { text: '"How was the drive?"', points: 5 },
      { text: '"Can you fix my phone?"', points: 4 }
    ],
    notes: 'Accept job/career questions under How is work or school (31 pts).'
  },
  {
    id: 'fm-029',
    set: 6,
    category: 'Christmas Characters and Stories',
    question: 'Name a classic Christmas book or story.',
    acceptedAnswers: [
      { text: 'Twas the Night Before Christmas', points: 33 },
      { text: 'A Christmas Carol', points: 24 },
      { text: 'How the Grinch Stole Christmas!', points: 19 },
      { text: 'The Polar Express', points: 12 },
      { text: 'The Nutcracker', points: 6 },
      { text: 'The Nativity Story', points: 4 },
      { text: 'The Gift of the Magi', points: 2 }
    ],
    notes: 'Accept A Visit from St. Nicholas under Twas the Night Before Christmas (33 pts).'
  },
  {
    id: 'fm-030',
    set: 6,
    category: 'Funny Christmas Situations',
    question: 'Name something funny people still have up in mid-January.',
    acceptedAnswers: [
      { text: 'Outdoor Christmas Lights', points: 37 },
      { text: 'Christmas Tree', points: 25 },
      { text: 'Front Door Wreath', points: 16 },
      { text: 'Christmas Cards on Fridge', points: 10 },
      { text: 'Holiday Throw Pillows / Doormat', points: 5 },
      { text: 'Leftover Holiday Candy / Popcorn', points: 4 },
      { text: 'Pine Needles in Carpet', points: 3 }
    ],
    notes: 'Accept lawn inflatables or icicle lights under Outdoor Christmas Lights (37 pts).'
  }
];

module.exports = FAST_MONEY_QUESTIONS;

/**
 * CHRISTMAS FEUD — DELUXE EXPANSION (30 ADDITIONAL UNIQUE ALL-CHRISTMAS ROUNDS: #71–#100)
 * 2 unique additional rounds across every one of the 15 Christmas categories.
 * Combined with Classic (70), Deluxe Edition provides 100 unique rounds.
 * Point values are illustrative game-show data summing to exactly 100.
 */

const STANDARD_DELUXE_EXTRA_ROUNDS = [
  // Category 1: Christmas Traditions (71-72)
  {
    id: 'cf-071',
    category: 'Christmas Traditions',
    question: 'Name a classic Christmas tradition from another country around the world.',
    answers: [
      { text: 'Pulling Christmas Crackers (UK)', points: 27 },
      { text: 'St. Nicholas Shoes by the Door (Europe)', points: 20 },
      { text: 'Las Posadas & Piñatas (Mexico)', points: 15 },
      { text: 'Christmas Pickle Hidden on Tree (Germany/US)', points: 12 },
      { text: 'KFC Fried Chicken Feast (Japan)', points: 9 },
      { text: 'Christmas Beach BBQ (Australia)', points: 7 },
      { text: 'Giving Books on Christmas Eve (Iceland)', points: 6 },
      { text: 'Broom Hiding / Yule Goat (Scandinavia)', points: 4 }
    ]
  },
  {
    id: 'cf-072',
    category: 'Christmas Traditions',
    question: 'Name something people write inside a Christmas greeting card.',
    answers: [
      { text: '"Merry Christmas and Happy New Year!"', points: 34 },
      { text: '"Wishing You Peace, Love & Joy"', points: 21 },
      { text: 'Annual Family Year-in-Review Update', points: 15 },
      { text: '"Warmest Holiday Wishes"', points: 10 },
      { text: '"Hope to See You Soon!"', points: 7 },
      { text: '"Season’s Greetings"', points: 5 },
      { text: 'Kids’ Hand-Drawn Signatures', points: 4 },
      { text: 'Love From the Whole Family & Pets', points: 4 }
    ]
  },

  // Category 2: Christmas Gifts (73-74)
  {
    id: 'cf-073',
    category: 'Christmas Gifts',
    question: 'Name a thoughtful homemade gift people craft for Christmas.',
    answers: [
      { text: 'Knitted Scarf or Blanket', points: 28 },
      { text: 'Baked Cookies or Fudge Tin', points: 22 },
      { text: 'Framed Photo Album or Calendar', points: 16 },
      { text: 'Handmade Tree Ornament', points: 11 },
      { text: 'Homemade Candle or Soap', points: 8 },
      { text: 'DIY Coupon Book (Chores / Babysitting)', points: 6 },
      { text: 'Painted Artwork or Pottery', points: 5 },
      { text: 'Custom Recipe Book', points: 4 }
    ]
  },
  {
    id: 'cf-074',
    category: 'Christmas Gifts',
    question: 'Name a classic toy that has topped kids’ Christmas wish lists for decades.',
    answers: [
      { text: 'LEGO Building Sets', points: 30 },
      { text: 'Bicycle', points: 21 },
      { text: 'Dolls / Action Figures', points: 15 },
      { text: 'Toy Train Set', points: 10 },
      { text: 'Teddy Bear / Plush Toy', points: 8 },
      { text: 'Remote-Control Car', points: 7 },
      { text: 'Board Games', points: 5 },
      { text: 'Play-Doh or Art Kit', points: 4 }
    ]
  },

  // Category 3: Christmas Movies (75-76)
  {
    id: 'cf-075',
    category: 'Christmas Movies',
    question: 'Name a movie people passionately debate about whether it is a Christmas movie.',
    answers: [
      { text: 'Die Hard', points: 42 },
      { text: 'The Nightmare Before Christmas', points: 20 },
      { text: 'Gremlins', points: 12 },
      { text: 'Harry Potter & the Sorcerer’s Stone', points: 9 },
      { text: 'Batman Returns', points: 6 },
      { text: 'Edward Scissorhands', points: 5 },
      { text: 'Frozen', points: 3 },
      { text: 'Lethal Weapon / Iron Man 3', points: 3 }
    ]
  },
  {
    id: 'cf-076',
    category: 'Christmas Movies',
    question: 'Name an actor famous for playing Santa Claus in a movie.',
    answers: [
      { text: 'Tim Allen (The Santa Clause)', points: 35 },
      { text: 'Edmund Gwenn / Richard Attenborough (34th St)', points: 21 },
      { text: 'Ed Asner (Elf)', points: 15 },
      { text: 'Kurt Russell (The Christmas Chronicles)', points: 11 },
      { text: 'Tom Hanks (The Polar Express)', points: 7 },
      { text: 'Billy Bob Thornton (Bad Santa)', points: 5 },
      { text: 'Paul Giamatti (Fred Claus)', points: 3 },
      { text: 'David Harbour (Violent Night)', points: 3 }
    ]
  },

  // Category 4: Christmas Music (77-78)
  {
    id: 'cf-077',
    category: 'Christmas Music',
    question: 'Name a cheerful novelty or kids’ Christmas song.',
    answers: [
      { text: 'Rudolph the Red-Nosed Reindeer', points: 30 },
      { text: 'Frosty the Snowman', points: 22 },
      { text: 'Grandma Got Run Over by a Reindeer', points: 15 },
      { text: 'I Want a Hippopotamus for Christmas', points: 11 },
      { text: 'All I Want for Christmas Is My Two Front Teeth', points: 8 },
      { text: 'The Chipmunk Song', points: 6 },
      { text: 'Dominick the Donkey', points: 4 },
      { text: 'Feliz Navidad', points: 4 }
    ]
  },
  {
    id: 'cf-078',
    category: 'Christmas Music',
    question: 'Name a musical instrument strongly linked to Christmas music.',
    answers: [
      { text: 'Sleigh Bells / Jingle Bells', points: 33 },
      { text: 'Piano', points: 20 },
      { text: 'Church Pipe Organ', points: 14 },
      { text: 'Handbells / Chimes', points: 11 },
      { text: 'Little Drummer Boy Snare Drum', points: 8 },
      { text: 'Trumpet / Brass Horn', points: 6 },
      { text: 'Acoustic Guitar', points: 4 },
      { text: 'Harp or Violin', points: 4 }
    ]
  },

  // Category 5: Christmas Decorations (79-80)
  {
    id: 'cf-079',
    category: 'Christmas Decorations',
    question: 'Name a debate families have every year about their Christmas tree.',
    answers: [
      { text: 'Real Pine Tree vs. Artificial Tree', points: 36 },
      { text: 'White Lights vs. Multicolor Lights', points: 24 },
      { text: 'How Early to Put It Up (Nov vs. Dec)', points: 14 },
      { text: 'Star vs. Angel on Top', points: 10 },
      { text: 'Tinsel vs. No Tinsel', points: 6 },
      { text: 'Blinking Lights vs. Steady Glow', points: 4 },
      { text: 'When to Take It Down', points: 3 },
      { text: 'Which Corner of the Living Room', points: 3 }
    ]
  },
  {
    id: 'cf-080',
    category: 'Christmas Decorations',
    question: 'Name a fragrant winter plant or greenery used in Christmas decorating.',
    answers: [
      { text: 'Pine / Fir Branches', points: 31 },
      { text: 'Poinsettia', points: 23 },
      { text: 'Holly with Red Berries', points: 16 },
      { text: 'Mistletoe', points: 12 },
      { text: 'Cedar Garland', points: 6 },
      { text: 'Cinnamon-Scented Pinecones', points: 5 },
      { text: 'Christmas Cactus', points: 4 },
      { text: 'Eucalyptus & Rosemary Sprigs', points: 3 }
    ]
  },

  // Category 6: Santa Claus and the North Pole (81-82)
  {
    id: 'cf-081',
    category: 'Santa Claus and the North Pole',
    question: 'Name a famous phrase or sound Santa Claus makes.',
    answers: [
      { text: '"Ho, Ho, Ho!"', points: 42 },
      { text: '"Merry Christmas to All!"', points: 22 },
      { text: '"On Dasher, On Dancer..."', points: 12 },
      { text: '"Have You Been Naughty or Nice?"', points: 9 },
      { text: 'Jingling Sleigh Bells', points: 6 },
      { text: 'Reindeer Hooves Clicking on the Roof', points: 4 },
      { text: '"What Would You Like for Christmas?"', points: 3 },
      { text: 'Belly Shaking Like a Bowl Full of Jelly', points: 2 }
    ]
  },
  {
    id: 'cf-082',
    category: 'Santa Claus and the North Pole',
    question: 'Name something kids always ask about how Santa delivers presents.',
    answers: [
      { text: '"How Does He Get In Without a Chimney?"', points: 34 },
      { text: '"How Does He Visit the Whole World in One Night?"', points: 24 },
      { text: '"How Do the Reindeer Fly?"', points: 15 },
      { text: '"How Does He Fit All the Toys in One Sack?"', points: 10 },
      { text: '"Doesn’t He Get Full Eating All Those Cookies?"', points: 7 },
      { text: '"Does He Get Soot on His Red Suit?"', points: 4 },
      { text: '"How Does He Know If I’m Asleep?"', points: 3 },
      { text: '"What Does Santa Do All Summer?"', points: 3 }
    ]
  },

  // Category 7: Christmas Activities (83-84)
  {
    id: 'cf-083',
    category: 'Christmas Activities',
    question: 'Name a classic live show or performance people attend during December.',
    answers: [
      { text: 'The Nutcracker Ballet', points: 34 },
      { text: 'A Christmas Carol Stage Play', points: 21 },
      { text: 'School Christmas Concert / Pageant', points: 16 },
      { text: 'Radio City Rockettes Christmas Spectacular', points: 10 },
      { text: 'Holiday Symphony / Choir Concert', points: 8 },
      { text: 'Trans-Siberian Orchestra', points: 5 },
      { text: 'Living Nativity Performance', points: 3 },
      { text: 'Christmas on Ice Show', points: 3 }
    ]
  },
  {
    id: 'cf-084',
    category: 'Christmas Activities',
    question: 'Name something people love doing during the quiet week between Christmas and New Year’s.',
    answers: [
      { text: 'Sleeping In & Relaxing in Pajamas', points: 30 },
      { text: 'Eating Leftovers & Holiday Treats', points: 21 },
      { text: 'Shopping Post-Christmas Clearance Sales', points: 14 },
      { text: 'Returning or Exchanging Gifts', points: 12 },
      { text: 'Binge-Watching Movies & TV', points: 9 },
      { text: 'Playing with New Gifts & Games', points: 6 },
      { text: 'Forgetting What Day of the Week It Is', points: 5 },
      { text: 'Planning New Year’s Eve', points: 3 }
    ]
  },

  // Category 8: Christmas Family and Friends (85-86)
  {
    id: 'cf-085',
    category: 'Christmas Family and Friends',
    question: 'Name a heartwarming gesture that makes a friend or family member feel loved at Christmas.',
    answers: [
      { text: 'Handwritten Personal Note or Card', points: 28 },
      { text: 'Thoughtful Gift Showing You Listened', points: 24 },
      { text: 'Calling or Visiting Someone Who Is Alone', points: 16 },
      { text: 'Baking Their Favorite Treat', points: 11 },
      { text: 'Helping Cook or Clean Without Being Asked', points: 8 },
      { text: 'Big Warm Hug & Quality Unplugged Time', points: 6 },
      { text: 'Framing a Cherished Shared Memory', points: 4 },
      { text: 'Surprising Them by Coming Home Early', points: 3 }
    ]
  },
  {
    id: 'cf-086',
    category: 'Christmas Family and Friends',
    question: 'Name a topic people playfully try to avoid bringing up at the Christmas table.',
    answers: [
      { text: 'Politics', points: 39 },
      { text: 'Money & Salaries', points: 18 },
      { text: 'Dating & Relationship Status', points: 14 },
      { text: 'Weight & Diets', points: 10 },
      { text: 'Old Sibling Grudges', points: 7 },
      { text: 'Sports Rivalries', points: 5 },
      { text: 'Who Spent More on Gifts', points: 4 },
      { text: 'Family Inheritance or Gossip', points: 3 }
    ]
  },

  // Category 9: Winter and Snow (87-88)
  {
    id: 'cf-087',
    category: 'Winter and Snow',
    question: 'Name a winter sport or snowy mountain activity people enjoy in December.',
    answers: [
      { text: 'Downhill Skiing', points: 31 },
      { text: 'Snowboarding', points: 23 },
      { text: 'Ice Skating', points: 17 },
      { text: 'Snow Tubing / Sledding', points: 11 },
      { text: 'Ice Hockey', points: 7 },
      { text: 'Snowshoeing', points: 5 },
      { text: 'Cross-Country Skiing', points: 3 },
      { text: 'Snowmobiling', points: 3 }
    ]
  },
  {
    id: 'cf-088',
    category: 'Winter and Snow',
    question: 'Name an animal strongly associated with snowy winter and Christmas cards.',
    answers: [
      { text: 'Reindeer / Stag', points: 32 },
      { text: 'Polar Bear', points: 22 },
      { text: 'Penguin', points: 16 },
      { text: 'Red Cardinal / Robin', points: 12 },
      { text: 'Snowy Owl', points: 7 },
      { text: 'Arctic Fox', points: 5 },
      { text: 'Siberian Husky', points: 3 },
      { text: 'Winter Dove', points: 3 }
    ]
  },

  // Category 10: Christmas Travel (89-90)
  {
    id: 'cf-089',
    category: 'Christmas Travel',
    question: 'Name a famous landmark that looks spectacular decorated for Christmas.',
    answers: [
      { text: 'Rockefeller Center Christmas Tree (NYC)', points: 34 },
      { text: 'Eiffel Tower & Champs-Élysées (Paris)', points: 18 },
      { text: 'Trafalgar Square & Regent Street (London)', points: 14 },
      { text: 'White House Christmas Tree (DC)', points: 11 },
      { text: 'Cinderella Castle (Disney World)', points: 9 },
      { text: 'Vatican / St. Peter’s Square (Rome)', points: 6 },
      { text: 'Nuremberg Christkindlesmarkt (Germany)', points: 4 },
      { text: 'Sydney Harbour / Bondi Beach', points: 4 }
    ]
  },
  {
    id: 'cf-090',
    category: 'Christmas Travel',
    question: 'Name a challenge of hosting out-of-town overnight guests for Christmas.',
    answers: [
      { text: 'Finding Enough Beds & Air Mattresses', points: 30 },
      { text: 'Sharing Bathrooms in the Morning', points: 22 },
      { text: 'Cooking Three Meals a Day for a Crowd', points: 16 },
      { text: 'Deep-Cleaning the House Before They Arrive', points: 11 },
      { text: 'Running Out of Towels & Closet Space', points: 8 },
      { text: 'Zero Quiet Alone Time', points: 6 },
      { text: 'Coordinating Different Sleep Schedules', points: 4 },
      { text: 'Keeping Kids Quiet at 6 AM', points: 3 }
    ]
  },

  // Category 11: Christmas Parties (91-92)
  {
    id: 'cf-091',
    category: 'Christmas Parties',
    question: 'Name a festive photo-booth prop guests love holding at a Christmas party.',
    answers: [
      { text: 'Santa Hat', points: 30 },
      { text: 'Reindeer Antler Headband', points: 23 },
      { text: 'Fake White Santa Beard on a Stick', points: 15 },
      { text: 'Elf Ears & Hat', points: 11 },
      { text: 'Oversized Holiday Sunglasses', points: 8 },
      { text: '"Naughty / Nice" Chalkboard Sign', points: 6 },
      { text: 'Tinsel Scarf / Feather Boa', points: 4 },
      { text: 'Giant Inflatable Candy Cane', points: 3 }
    ]
  },
  {
    id: 'cf-092',
    category: 'Christmas Parties',
    question: 'Name something a good host always prepares before Christmas party guests arrive.',
    answers: [
      { text: 'Appetizers & Drinks Station', points: 30 },
      { text: 'Christmas Music Playlist', points: 21 },
      { text: 'Coat Rack / Bed for Winter Coats', points: 15 },
      { text: 'Extra Ice & Clean Glassware', points: 11 },
      { text: 'Festive Lighting & Candles', points: 9 },
      { text: 'Clean Guest Bathroom & Holiday Towel', points: 6 },
      { text: 'Party Games & Prizes', points: 4 },
      { text: 'Cleared Driveway & Lit Porch', points: 4 }
    ]
  },

  // Category 12: Christmas Food and Drinks (93-94)
  {
    id: 'cf-093',
    category: 'Christmas Food and Drinks',
    question: 'Name a polarizing holiday food or drink people either adore or refuse to touch.',
    answers: [
      { text: 'Fruitcake', points: 34 },
      { text: 'Eggnog', points: 22 },
      { text: 'Brussels Sprouts', points: 15 },
      { text: 'Canned Jellied Cranberry Sauce', points: 10 },
      { text: 'Mincemeat Pie', points: 7 },
      { text: 'Christmas Figgy Pudding', points: 5 },
      { text: 'Candy Canes', points: 4 },
      { text: 'Sweet Potatoes with Marshmallows', points: 3 }
    ]
  },
  {
    id: 'cf-094',
    category: 'Christmas Food and Drinks',
    question: 'Name a favorite food families make for Christmas morning breakfast.',
    answers: [
      { text: 'Warm Cinnamon Rolls', points: 33 },
      { text: 'Pancakes or Waffles', points: 21 },
      { text: 'Bacon & Scrambled Eggs', points: 15 },
      { text: 'Overnight Breakfast Casserole', points: 10 },
      { text: 'French Toast', points: 8 },
      { text: 'Coffee Cake or Muffins', points: 5 },
      { text: 'Bagels & Smoked Salmon', points: 4 },
      { text: 'Mimosas & Fruit Platter', points: 4 }
    ]
  },

  // Category 13: Christmas Shopping (95-96)
  {
    id: 'cf-095',
    category: 'Christmas Shopping',
    question: 'Name someone on your Christmas shopping list who is always the hardest to buy for.',
    answers: [
      { text: 'Dad', points: 34 },
      { text: 'Teenagers', points: 21 },
      { text: 'Grandparents (Who Have Everything)', points: 15 },
      { text: 'In-Laws', points: 10 },
      { text: 'Your Boss / Coworkers', points: 7 },
      { text: 'Spouse or Partner', points: 6 },
      { text: 'Secret Santa Stranger', points: 4 },
      { text: 'Picky Sibling', points: 3 }
    ]
  },
  {
    id: 'cf-096',
    category: 'Christmas Shopping',
    question: 'Name an everyday person people tip or give a thank-you gift to at Christmas.',
    answers: [
      { text: 'School Teachers', points: 30 },
      { text: 'Mail Carrier / Delivery Drivers', points: 24 },
      { text: 'Hairstylist / Barber', points: 14 },
      { text: 'Housekeeper / Babysitter', points: 10 },
      { text: 'Trash / Recycling Collectors', points: 8 },
      { text: 'Dog Groomer / Pet Sitter', points: 6 },
      { text: 'Building Doorman / Maintenance', points: 4 },
      { text: 'Favorite Barista or Waiter', points: 4 }
    ]
  },

  // Category 14: Christmas Characters and Stories (97-98)
  {
    id: 'cf-097',
    category: 'Christmas Characters and Stories',
    question: 'Name a detail everyone remembers about Frosty the Snowman.',
    answers: [
      { text: 'Old Silk Top Hat Brought Him to Life', points: 33 },
      { text: 'Button Nose & Two Eyes Made of Coal', points: 21 },
      { text: 'Corncob Pipe', points: 16 },
      { text: '"Happy Birthday!" First Words', points: 10 },
      { text: 'Melting in the Greenhouse / Warm Sun', points: 8 },
      { text: 'Broomstick in His Hand', points: 5 },
      { text: 'Dancing Through the Village Square', points: 4 },
      { text: '"I’ll Be Back Again Someday!"', points: 3 }
    ]
  },
  {
    id: 'cf-098',
    category: 'Christmas Characters and Stories',
    question: 'Name a figure found inside a traditional Christmas Nativity scene.',
    answers: [
      { text: 'Baby Jesus in the Manger', points: 31 },
      { text: 'Mary', points: 18 },
      { text: 'Joseph', points: 15 },
      { text: 'The Three Wise Men', points: 13 },
      { text: 'Angels', points: 9 },
      { text: 'Shepherds', points: 6 },
      { text: 'Sheep, Donkey & Ox', points: 5 },
      { text: 'Star of Bethlehem', points: 3 }
    ]
  },

  // Category 15: Funny Christmas Situations (99-100)
  {
    id: 'cf-099',
    category: 'Funny Christmas Situations',
    question: 'Name something funny that happens when putting together a complex Christmas toy.',
    answers: [
      { text: 'Leftover Screws at the End', points: 31 },
      { text: 'Staying Up Until 2 AM on Christmas Eve', points: 23 },
      { text: 'Missing the Right Batteries', points: 16 },
      { text: 'Confusing Wordless Instructions', points: 11 },
      { text: 'Kid Prefers Playing With the Empty Box', points: 8 },
      { text: 'Putting a Piece On Backwards', points: 5 },
      { text: 'Applying Stickers Crooked', points: 3 },
      { text: 'Losing Tiny Parts in the Carpet', points: 3 }
    ]
  },
  {
    id: 'cf-100',
    category: 'Funny Christmas Situations',
    question: 'Name a hilarious holiday tech mishap during a family Christmas.',
    answers: [
      { text: 'Accidental Group-Text Spoiling a Gift', points: 28 },
      { text: 'Grandparents’ Video Call Aimed at Ceiling', points: 22 },
      { text: 'Smart Speaker Spoiling Santa’s Package', points: 16 },
      { text: 'Tripping a Breaker With Too Many Lights', points: 12 },
      { text: 'Online Order Arriving on December 27', points: 9 },
      { text: 'Shared Amazon History Ruining Surprise', points: 6 },
      { text: 'Dead Phone Battery Right Before Presents', points: 4 },
      { text: 'Slow Wi-Fi From Everyone’s New Devices', points: 3 }
    ]
  }
];

module.exports = STANDARD_DELUXE_EXTRA_ROUNDS;

/**
 * CHRISTMAS FEUD — CLASSIC EDITION (70 UNIQUE ALL-CHRISTMAS SURVEY ROUNDS)
 * Covers all 15 official Christmas categories. Food is only 1 of 15 categories.
 * Note: Point values are illustrative game-show data summing to exactly 100 per round,
 * not verified statistical survey research.
 * Authoritative server-only file — NEVER served directly to Players or Audience.
 */

const STANDARD_CLASSIC_ROUNDS = [
  // === CATEGORY 1: CHRISTMAS TRADITIONS (1-5) ===
  {
    id: 'cf-001',
    category: 'Christmas Traditions',
    question: 'Name a beloved tradition families do together on Christmas Eve.',
    answers: [
      { text: 'Open One Present Early', points: 28 },
      { text: 'Attend Midnight Mass / Church', points: 21 },
      { text: 'Wear Matching Christmas Pajamas', points: 15 },
      { text: 'Watch a Classic Christmas Movie', points: 11 },
      { text: 'Drive Around Looking at Lights', points: 9 },
      { text: 'Read "The Night Before Christmas"', points: 7 },
      { text: 'Leave Cookies & Milk for Santa', points: 5 },
      { text: 'Track Santa Online', points: 4 }
    ]
  },
  {
    id: 'cf-002',
    category: 'Christmas Traditions',
    question: 'Name the very first thing people do after waking up on Christmas morning.',
    answers: [
      { text: 'Run to Check Under the Tree', points: 32 },
      { text: 'Brew Coffee or Hot Cocoa', points: 20 },
      { text: 'Open Christmas Stockings', points: 14 },
      { text: 'Wake Up Everyone Else in the House', points: 10 },
      { text: 'Plug In the Christmas Tree Lights', points: 8 },
      { text: 'Take Photos or Videos', points: 7 },
      { text: 'Start Cooking Christmas Breakfast', points: 5 },
      { text: 'Check If Santa Ate the Cookies', points: 4 }
    ]
  },
  {
    id: 'cf-003',
    category: 'Christmas Traditions',
    question: 'Name a classic December countdown tradition leading up to Christmas Day.',
    answers: [
      { text: 'Chocolate Advent Calendar', points: 30 },
      { text: 'Elf on the Shelf', points: 22 },
      { text: 'Lighting Advent Wreath Candles', points: 14 },
      { text: '25 Days of Christmas Movies', points: 10 },
      { text: 'Paper Chain Countdown', points: 8 },
      { text: 'Sending Out Christmas Cards', points: 7 },
      { text: 'Playing Christmas Music Daily', points: 5 },
      { text: 'Countdown Chalkboard / Ornament', points: 4 }
    ]
  },
  {
    id: 'cf-004',
    category: 'Christmas Traditions',
    question: 'Name a traditional holiday custom practiced under or near a doorway.',
    answers: [
      { text: 'Kissing Under the Mistletoe', points: 38 },
      { text: 'Hanging a Christmas Wreath', points: 22 },
      { text: 'Singing Christmas Carols at the Door', points: 13 },
      { text: 'Welcoming Guests with Hugs', points: 9 },
      { text: 'Draping Pine Garland Around the Frame', points: 6 },
      { text: 'Setting Out a Holiday Doormat', points: 5 },
      { text: 'Placing Lanterns or Luminaries', points: 4 },
      { text: 'Leaving Boots Out on St. Nicholas Eve', points: 3 }
    ]
  },
  {
    id: 'cf-005',
    category: 'Christmas Traditions',
    question: 'Name something people love most about the Christmas season.',
    answers: [
      { text: 'Spending Time with Family', points: 31 },
      { text: 'Twinkling Christmas Lights & Decor', points: 19 },
      { text: 'Giving & Receiving Gifts', points: 14 },
      { text: 'Christmas Music & Movies', points: 11 },
      { text: 'Festive Holiday Food & Treats', points: 9 },
      { text: 'Time Off Work or School', points: 7 },
      { text: 'Generosity & Holiday Spirit', points: 5 },
      { text: 'Snowy Winter Cozy Vibes', points: 4 }
    ]
  },

  // === CATEGORY 2: CHRISTMAS GIFTS (6-10) ===
  {
    id: 'cf-006',
    category: 'Christmas Gifts',
    question: 'Name a classic Christmas gift almost everyone has received at least once.',
    answers: [
      { text: 'Socks', points: 29 },
      { text: 'Gift Card', points: 21 },
      { text: 'Pajamas or Slippers', points: 14 },
      { text: 'Sweater or Scarf', points: 11 },
      { text: 'Coffee Mug', points: 9 },
      { text: 'Scented Candle', points: 7 },
      { text: 'Box of Chocolates', points: 5 },
      { text: 'Perfume or Cologne', points: 4 }
    ]
  },
  {
    id: 'cf-007',
    category: 'Christmas Gifts',
    question: 'Name a popular Secret Santa gift that stays under a $25 budget.',
    answers: [
      { text: 'Coffee Shop Gift Card', points: 27 },
      { text: 'Scented Candle', points: 21 },
      { text: 'Cozy Blanket or Fuzzy Socks', points: 15 },
      { text: 'Funny Coffee Mug', points: 12 },
      { text: 'Gourmet Hot Cocoa or Snack Box', points: 9 },
      { text: 'Board Game or Card Game', points: 7 },
      { text: 'Desk Plant or Gadget', points: 5 },
      { text: 'Lottery Scratch-Off Tickets', points: 4 }
    ]
  },
  {
    id: 'cf-008',
    category: 'Christmas Gifts',
    question: 'Name something you always need on hand when wrapping Christmas presents.',
    answers: [
      { text: 'Scotch Tape', points: 34 },
      { text: 'Wrapping Paper', points: 22 },
      { text: 'Sharp Scissors', points: 15 },
      { text: 'Stick-On Bows & Ribbon', points: 10 },
      { text: 'Gift Tags & Pen', points: 7 },
      { text: 'Gift Bags & Tissue Paper', points: 5 },
      { text: 'Cardboard Shirt Boxes', points: 4 },
      { text: 'Flat Floor or Table Space', points: 3 }
    ]
  },
  {
    id: 'cf-009',
    category: 'Christmas Gifts',
    question: 'Name a big-ticket Christmas gift that makes someone scream with excitement.',
    answers: [
      { text: 'New Phone or Laptop', points: 28 },
      { text: 'Video Game Console', points: 21 },
      { text: 'Surprise Vacation / Plane Tickets', points: 15 },
      { text: 'Puppy or Kitten', points: 12 },
      { text: 'Jewelry / Engagement Ring', points: 9 },
      { text: 'Car with a Giant Red Bow', points: 6 },
      { text: 'Concert or Sports Tickets', points: 5 },
      { text: 'Big-Screen Smart TV', points: 4 }
    ]
  },
  {
    id: 'cf-010',
    category: 'Christmas Gifts',
    question: 'Name a sneaky clue people use to guess what is inside a wrapped present.',
    answers: [
      { text: 'Shaking the Box to Listen', points: 35 },
      { text: 'Feeling the Weight of It', points: 20 },
      { text: 'Squeezing to See If It Is Soft', points: 15 },
      { text: 'Checking the Shape & Size', points: 11 },
      { text: 'Peeking at Store Shipping Labels', points: 7 },
      { text: 'Remembering Their Own Wish List', points: 5 },
      { text: 'Peeling a Tiny Corner of Tape', points: 4 },
      { text: 'Watching the Giver’s Facial Expression', points: 3 }
    ]
  },

  // === CATEGORY 3: CHRISTMAS MOVIES (11-15) ===
  {
    id: 'cf-011',
    category: 'Christmas Movies',
    question: 'Name a famous Christmas movie people watch every single year.',
    answers: [
      { text: 'Home Alone', points: 28 },
      { text: 'Elf', points: 22 },
      { text: 'It’s a Wonderful Life', points: 14 },
      { text: 'How the Grinch Stole Christmas', points: 11 },
      { text: 'National Lampoon’s Christmas Vacation', points: 9 },
      { text: 'A Christmas Story', points: 7 },
      { text: 'The Polar Express', points: 5 },
      { text: 'Miracle on 34th Street', points: 4 }
    ]
  },
  {
    id: 'cf-012',
    category: 'Christmas Movies',
    question: 'Name an unforgettable animated Christmas movie or TV special.',
    answers: [
      { text: 'Rudolph the Red-Nosed Reindeer', points: 27 },
      { text: 'A Charlie Brown Christmas', points: 21 },
      { text: 'The Polar Express', points: 16 },
      { text: 'Frosty the Snowman', points: 12 },
      { text: 'How the Grinch Stole Christmas (1966)', points: 9 },
      { text: 'The Nightmare Before Christmas', points: 6 },
      { text: 'Klaus', points: 5 },
      { text: 'Arthur Christmas', points: 4 }
    ]
  },
  {
    id: 'cf-013',
    category: 'Christmas Movies',
    question: 'Name an iconic scene everyone remembers from a famous Christmas film.',
    answers: [
      { text: 'Kevin’s Aftershave Scream (Home Alone)', points: 26 },
      { text: 'Buddy Eating Syrup & Spaghetti (Elf)', points: 21 },
      { text: 'Tongue Stuck to Flagpole (A Christmas Story)', points: 16 },
      { text: 'Clark Lighting Up the House (Vacation)', points: 12 },
      { text: 'The Grinch’s Heart Growing 3 Sizes', points: 9 },
      { text: 'Hot Chocolate Dance (Polar Express)', points: 7 },
      { text: 'Cue Cards at the Door (Love Actually)', points: 5 },
      { text: 'Bell Ringing for an Angel (Wonderful Life)', points: 4 }
    ]
  },
  {
    id: 'cf-014',
    category: 'Christmas Movies',
    question: 'Name a cliché plot twist found in almost every cozy holiday romance movie.',
    answers: [
      { text: 'Big-City Executive Moves to a Small Town', points: 30 },
      { text: 'Saving the Family Bakery or Inn', points: 21 },
      { text: 'Snowstorm Strands Two Strangers Together', points: 15 },
      { text: 'Fake Dating Turns Into Real Love', points: 11 },
      { text: 'Falling for a Secret Prince or Royalty', points: 8 },
      { text: 'Magical Kiss Under Falling Snow', points: 6 },
      { text: 'Hating Christmas Until Meeting Someone', points: 5 },
      { text: 'Old High School Sweetheart Reunion', points: 4 }
    ]
  },
  {
    id: 'cf-015',
    category: 'Christmas Movies',
    question: 'Name a famous Christmas movie villain or grump.',
    answers: [
      { text: 'The Grinch', points: 32 },
      { text: 'Ebenezer Scrooge', points: 24 },
      { text: 'Harry & Marv (The Wet Bandits)', points: 15 },
      { text: 'Hans Gruber (Die Hard)', points: 9 },
      { text: 'Mr. Potter (It’s a Wonderful Life)', points: 7 },
      { text: 'Oogie Boogie', points: 5 },
      { text: 'Burgermeister Meisterburger', points: 4 },
      { text: 'Jack Frost (Santa Clause 3)', points: 4 }
    ]
  },

  // === CATEGORY 4: CHRISTMAS MUSIC (16-20) ===
  {
    id: 'cf-016',
    category: 'Christmas Music',
    question: 'Name a wildly popular Christmas song you hear everywhere in December.',
    answers: [
      { text: 'All I Want for Christmas Is You', points: 31 },
      { text: 'Jingle Bells', points: 20 },
      { text: 'Last Christmas', points: 14 },
      { text: 'White Christmas', points: 10 },
      { text: 'Rockin’ Around the Christmas Tree', points: 8 },
      { text: 'Silent Night', points: 7 },
      { text: 'Jingle Bell Rock', points: 6 },
      { text: 'Rudolph the Red-Nosed Reindeer', points: 4 }
    ]
  },
  {
    id: 'cf-017',
    category: 'Christmas Music',
    question: 'Name a famous singer known for iconic Christmas albums or hits.',
    answers: [
      { text: 'Mariah Carey', points: 33 },
      { text: 'Michael Bublé', points: 22 },
      { text: 'Bing Crosby', points: 14 },
      { text: 'Frank Sinatra', points: 10 },
      { text: 'Nat King Cole', points: 7 },
      { text: 'Brenda Lee', points: 6 },
      { text: 'Elvis Presley', points: 4 },
      { text: 'Wham! / George Michael', points: 4 }
    ]
  },
  {
    id: 'cf-018',
    category: 'Christmas Music',
    question: 'Name a traditional Christmas carol people sing by candlelight.',
    answers: [
      { text: 'Silent Night', points: 35 },
      { text: 'O Holy Night', points: 20 },
      { text: 'Joy to the World', points: 13 },
      { text: 'Hark! The Herald Angels Sing', points: 9 },
      { text: 'O Come, All Ye Faithful', points: 8 },
      { text: 'Away in a Manger', points: 6 },
      { text: 'Deck the Halls', points: 5 },
      { text: 'We Wish You a Merry Christmas', points: 4 }
    ]
  },
  {
    id: 'cf-019',
    category: 'Christmas Music',
    question: 'Name a gift mentioned in the song "The Twelve Days of Christmas."',
    answers: [
      { text: 'Five Golden Rings', points: 34 },
      { text: 'Partridge in a Pear Tree', points: 24 },
      { text: 'Two Turtle Doves', points: 12 },
      { text: 'Three French Hens', points: 8 },
      { text: 'Twelve Drummers Drumming', points: 7 },
      { text: 'Seven Swans a-Swimming', points: 6 },
      { text: 'Eight Maids a-Milking', points: 5 },
      { text: 'Ten Lords a-Leaping', points: 4 }
    ]
  },
  {
    id: 'cf-020',
    category: 'Christmas Music',
    question: 'Name a place where you are guaranteed to hear Christmas music nonstop.',
    answers: [
      { text: 'Shopping Malls & Retail Stores', points: 33 },
      { text: 'Grocery Stores', points: 20 },
      { text: 'Holiday Radio Stations in the Car', points: 15 },
      { text: 'Coffee Shops', points: 10 },
      { text: 'Doctor / Dentist Waiting Rooms', points: 7 },
      { text: 'Elevators & Hotel Lobbies', points: 6 },
      { text: 'Ice Skating Rinks', points: 5 },
      { text: 'Christmas Tree Lots', points: 4 }
    ]
  },

  // === CATEGORY 5: CHRISTMAS DECORATIONS (21-25) ===
  {
    id: 'cf-021',
    category: 'Christmas Decorations',
    question: 'Name something people hang on a Christmas tree.',
    answers: [
      { text: 'Glass Ball Ornaments', points: 30 },
      { text: 'String Lights', points: 22 },
      { text: 'Star or Angel Topper', points: 14 },
      { text: 'Tinsel or Garland', points: 10 },
      { text: 'Candy Canes', points: 8 },
      { text: 'Homemade / Photo Ornaments', points: 7 },
      { text: 'Ribbon Bows', points: 5 },
      { text: 'Icicles or Snowflakes', points: 4 }
    ]
  },
  {
    id: 'cf-022',
    category: 'Christmas Decorations',
    question: 'Name an outdoor Christmas decoration people display in their front yard.',
    answers: [
      { text: 'Roofline String Lights / Icicles', points: 29 },
      { text: 'Giant Inflatable Santa or Snowman', points: 21 },
      { text: 'Light-Up Reindeer & Sleigh', points: 15 },
      { text: 'Nativity Scene', points: 11 },
      { text: 'Front Door Wreath', points: 8 },
      { text: 'Lighted Candy Cane Pathway Stakes', points: 7 },
      { text: 'Projector Snowflakes / Lasers', points: 5 },
      { text: 'Wrapped Tree Trunks in Lights', points: 4 }
    ]
  },
  {
    id: 'cf-023',
    category: 'Christmas Decorations',
    question: 'Name something people display along the fireplace mantel at Christmas.',
    answers: [
      { text: 'Christmas Stockings', points: 35 },
      { text: 'Pine Garland with Lights', points: 21 },
      { text: 'Nutcrackers', points: 12 },
      { text: 'Candles or Lanterns', points: 10 },
      { text: 'Mini Christmas Village Houses', points: 8 },
      { text: 'Holiday Family Photos / Cards', points: 6 },
      { text: 'Small Figurines (Santa / Reindeer)', points: 4 },
      { text: 'Festive Wreath Above the Mantel', points: 4 }
    ]
  },
  {
    id: 'cf-024',
    category: 'Christmas Decorations',
    question: 'Name a classic color combination people use to theme their Christmas tree.',
    answers: [
      { text: 'Red & Gold', points: 30 },
      { text: 'Red & Green', points: 23 },
      { text: 'Silver & Blue (Winter Wonderland)', points: 14 },
      { text: 'White & Gold', points: 11 },
      { text: 'Multicolor Retro Rainbow', points: 8 },
      { text: 'Red & White (Candy Cane)', points: 6 },
      { text: 'Champagne Gold & Emerald', points: 4 },
      { text: 'Rose Gold & Blush Pink', points: 4 }
    ]
  },
  {
    id: 'cf-025',
    category: 'Christmas Decorations',
    question: 'Name the most frustrating part of putting up Christmas decorations.',
    answers: [
      { text: 'Untangling Knotted String Lights', points: 36 },
      { text: 'Half a Strand of Lights Burned Out', points: 20 },
      { text: 'Falling Pine Needles Everywhere', points: 14 },
      { text: 'Climbing Ladders in Freezing Weather', points: 10 },
      { text: 'Hauling Heavy Boxes From the Attic', points: 7 },
      { text: 'Getting the Tree Straight in the Stand', points: 5 },
      { text: 'Glitter Shedding on Everything', points: 4 },
      { text: 'Taking Everything Back Down in January', points: 4 }
    ]
  },

  // === CATEGORY 6: SANTA CLAUS AND THE NORTH POLE (26-30) ===
  {
    id: 'cf-026',
    category: 'Santa Claus and the North Pole',
    question: 'Name something instantly recognizable about Santa Claus’s appearance.',
    answers: [
      { text: 'Long Fluffy White Beard', points: 30 },
      { text: 'Red Velvet Suit with White Fur Trim', points: 24 },
      { text: 'Jolly Round Belly', points: 15 },
      { text: 'Red Santa Hat with Pom-Pom', points: 11 },
      { text: 'Black Belt with Big Gold Buckle', points: 7 },
      { text: 'Rosy Red Cheeks', points: 5 },
      { text: 'Shiny Black Boots', points: 4 },
      { text: 'Wire-Rimmed Spectacles', points: 4 }
    ]
  },
  {
    id: 'cf-027',
    category: 'Santa Claus and the North Pole',
    question: 'Name one of Santa’s famous reindeer.',
    answers: [
      { text: 'Rudolph', points: 34 },
      { text: 'Dasher', points: 18 },
      { text: 'Dancer', points: 12 },
      { text: 'Prancer', points: 10 },
      { text: 'Vixen', points: 8 },
      { text: 'Comet', points: 7 },
      { text: 'Cupid', points: 6 },
      { text: 'Donner / Blitzen', points: 5 }
    ]
  },
  {
    id: 'cf-028',
    category: 'Santa Claus and the North Pole',
    question: 'Name something you would expect to see inside Santa’s North Pole Workshop.',
    answers: [
      { text: 'Elves Building & Painting Toys', points: 31 },
      { text: 'Giant Toy Conveyor Belts', points: 19 },
      { text: 'The Naughty and Nice List', points: 15 },
      { text: 'Mountains of Wrapped Presents', points: 11 },
      { text: 'Stacks of Kids’ Letters to Santa', points: 9 },
      { text: 'Mrs. Claus’s Cookie Bakery', points: 6 },
      { text: 'Santa’s Sleigh Being Polished', points: 5 },
      { text: 'Hot Cocoa Machine', points: 4 }
    ]
  },
  {
    id: 'cf-029',
    category: 'Santa Claus and the North Pole',
    question: 'Name something Santa carries inside his sleigh on Christmas Eve.',
    answers: [
      { text: 'Giant Red Sack of Toys', points: 35 },
      { text: 'Naughty and Nice Checklist', points: 19 },
      { text: 'Lumps of Coal', points: 13 },
      { text: 'Carrots / Magic Reindeer Food', points: 10 },
      { text: 'GPS / World Delivery Map', points: 8 },
      { text: 'Thermos of Hot Cocoa', points: 6 },
      { text: 'Sleigh Bells', points: 5 },
      { text: 'Spare Chimney Suit / Magic Key', points: 4 }
    ]
  },
  {
    id: 'cf-030',
    category: 'Santa Claus and the North Pole',
    question: 'Name something that might land someone on Santa’s Naughty List.',
    answers: [
      { text: 'Peeking at Christmas Presents Early', points: 28 },
      { text: 'Fighting with Siblings', points: 21 },
      { text: 'Telling Lies', points: 15 },
      { text: 'Not Doing Chores / Messy Room', points: 11 },
      { text: 'Regifting Someone’s Own Gift Back', points: 8 },
      { text: 'Eating All the Cookies Left for Santa', points: 7 },
      { text: 'Being Rude to Retail Workers', points: 6 },
      { text: 'Refusing to Share Toys', points: 4 }
    ]
  },

  // === CATEGORY 7: CHRISTMAS ACTIVITIES (31-35) ===
  {
    id: 'cf-031',
    category: 'Christmas Activities',
    question: 'Name a fun activity people do in December to get into the Christmas spirit.',
    answers: [
      { text: 'Decorating the Christmas Tree', points: 27 },
      { text: 'Driving Around to See Holiday Lights', points: 20 },
      { text: 'Baking & Decorating Cookies', points: 15 },
      { text: 'Watching Christmas Movie Marathons', points: 12 },
      { text: 'Ice Skating', points: 9 },
      { text: 'Visiting a Christmas Market', points: 7 },
      { text: 'Building a Gingerbread House', points: 6 },
      { text: 'Going Christmas Caroling', points: 4 }
    ]
  },
  {
    id: 'cf-032',
    category: 'Christmas Activities',
    question: 'Name a holiday craft kids love making in school or at home for Christmas.',
    answers: [
      { text: 'Paper Snowflakes', points: 28 },
      { text: 'Homemade Tree Ornaments', points: 22 },
      { text: 'Handmade Christmas Cards', points: 15 },
      { text: 'Popsicle Stick Trees / Reindeer', points: 11 },
      { text: 'Popcorn & Cranberry Garland', points: 8 },
      { text: 'Pinecone Crafts', points: 7 },
      { text: 'Paper Countdown Chains', points: 5 },
      { text: 'Salt Dough Handprints', points: 4 }
    ]
  },
  {
    id: 'cf-033',
    category: 'Christmas Activities',
    question: 'Name a fun game families play together on Christmas afternoon.',
    answers: [
      { text: 'Board Games (Monopoly / Scrabble)', points: 29 },
      { text: 'Christmas Trivia / Christmas FEUD', points: 21 },
      { text: 'Charades or Pictionary', points: 15 },
      { text: 'Card Games (UNO / Poker)', points: 12 },
      { text: 'White Elephant Gift Exchange', points: 9 },
      { text: 'Jigsaw Puzzles', points: 6 },
      { text: 'Video Games', points: 4 },
      { text: 'Saran Wrap Prize Ball Game', points: 4 }
    ]
  },
  {
    id: 'cf-034',
    category: 'Christmas Activities',
    question: 'Name a charitable way people give back during the Christmas season.',
    answers: [
      { text: 'Donating Toys (Toys for Tots / Angel Tree)', points: 32 },
      { text: 'Donating Food to a Food Bank', points: 21 },
      { text: 'Volunteering at a Soup Kitchen', points: 14 },
      { text: 'Dropping Cash in Red Salvation Kettles', points: 11 },
      { text: 'Donating Warm Coats & Blankets', points: 8 },
      { text: 'Baking Treats for Neighbors / Nurses', points: 6 },
      { text: 'Sponsoring a Family’s Wish List', points: 4 },
      { text: 'Caroling at a Senior Care Home', points: 4 }
    ]
  },
  {
    id: 'cf-035',
    category: 'Christmas Activities',
    question: 'Name an outdoor festive event towns host during December.',
    answers: [
      { text: 'Christmas Tree Lighting Ceremony', points: 31 },
      { text: 'Christmas Parade', points: 23 },
      { text: 'Outdoor Holiday Market / Bazaar', points: 15 },
      { text: 'Drive-Through Light Show', points: 11 },
      { text: 'Outdoor Ice Skating Rink', points: 7 },
      { text: 'Photos with Santa in the Square', points: 5 },
      { text: 'Santa 5K Fun Run', points: 4 },
      { text: 'Horse-Drawn Sleigh / Carriage Rides', points: 4 }
    ]
  },

  // === CATEGORY 8: CHRISTMAS FAMILY AND FRIENDS (36-40) ===
  {
    id: 'cf-036',
    category: 'Christmas Family and Friends',
    question: 'Name something relatives always ask you at a Christmas family gathering.',
    answers: [
      { text: '"How is work / school going?"', points: 28 },
      { text: '"Are you dating anyone / getting married?"', points: 23 },
      { text: '"What did Santa bring you?"', points: 14 },
      { text: '"Did you get enough to eat?"', points: 11 },
      { text: '"Have you grown taller?"', points: 9 },
      { text: '"When are you having kids?"', points: 6 },
      { text: '"How was the drive over?"', points: 5 },
      { text: '"Can you fix my phone / Wi-Fi?"', points: 4 }
    ]
  },
  {
    id: 'cf-037',
    category: 'Christmas Family and Friends',
    question: 'Name a classic family photo tradition at Christmas.',
    answers: [
      { text: 'Everyone Posing in Front of the Tree', points: 32 },
      { text: 'Matching Holiday Pajama Photo', points: 22 },
      { text: 'Ugly Christmas Sweater Group Shot', points: 14 },
      { text: 'Sending Printed Holiday Photo Cards', points: 10 },
      { text: 'Kids Sitting on Santa’s Lap', points: 8 },
      { text: 'Family Pet Wearing Reindeer Antlers', points: 6 },
      { text: 'Candid Present-Opening Action Shots', points: 4 },
      { text: 'Recreating an Old Childhood Photo', points: 4 }
    ]
  },
  {
    id: 'cf-038',
    category: 'Christmas Family and Friends',
    question: 'Name a classic role someone in every family plays on Christmas Day.',
    answers: [
      { text: 'The Head Chef Running the Kitchen', points: 27 },
      { text: 'The Trash-Bag Patrol for Wrapping Paper', points: 20 },
      { text: 'The Official Family Photographer', points: 15 },
      { text: 'The Relative Napping on the Couch', points: 12 },
      { text: 'The Gift Distributor Playing Santa', points: 9 },
      { text: 'The Tech Support Fixing New Gadgets', points: 7 },
      { text: 'The Early Bird Awake at 5 AM', points: 6 },
      { text: 'The DJ Controlling Christmas Music', points: 4 }
    ]
  },
  {
    id: 'cf-039',
    category: 'Christmas Family and Friends',
    question: 'Name something friends love doing together for a "Friendsmas" celebration.',
    answers: [
      { text: 'Secret Santa / White Elephant Swap', points: 31 },
      { text: 'Potluck Holiday Feast', points: 22 },
      { text: 'Ugly Sweater Contest', points: 15 },
      { text: 'Holiday Trivia or Party Games', points: 10 },
      { text: 'Festive Cocktails & Hot Cocoa Bar', points: 8 },
      { text: 'Christmas Movie Night', points: 6 },
      { text: 'Cookie Decorating Competition', points: 4 },
      { text: 'Karaoke to Christmas Songs', points: 4 }
    ]
  },
  {
    id: 'cf-040',
    category: 'Christmas Family and Friends',
    question: 'Name something that instantly happens once the last Christmas gift is opened.',
    answers: [
      { text: 'Cleaning Up Mountains of Wrapping Paper', points: 33 },
      { text: 'Hunting for Batteries & Scissors', points: 21 },
      { text: 'Trying On New Clothes & Sweaters', points: 14 },
      { text: 'Eating Christmas Breakfast or Brunch', points: 11 },
      { text: 'Calling / Video-Chatting Distant Relatives', points: 8 },
      { text: 'Assembling Toys or Setting Up Tech', points: 6 },
      { text: 'Comparing Everyone’s Favorite Gifts', points: 4 },
      { text: 'Taking a Mid-Morning Nap', points: 3 }
    ]
  },

  // === CATEGORY 9: WINTER AND SNOW (41-45) ===
  {
    id: 'cf-041',
    category: 'Winter and Snow',
    question: 'Name a classic activity people love doing right after a big snowfall.',
    answers: [
      { text: 'Building a Snowman', points: 31 },
      { text: 'Sledding Down a Hill', points: 22 },
      { text: 'Having a Snowball Fight', points: 17 },
      { text: 'Making Snow Angels', points: 10 },
      { text: 'Skiing or Snowboarding', points: 8 },
      { text: 'Shoveling the Driveway', points: 5 },
      { text: 'Drinking Hot Chocolate Indoors', points: 4 },
      { text: 'Building a Snow Fort / Igloo', points: 3 }
    ]
  },
  {
    id: 'cf-042',
    category: 'Winter and Snow',
    question: 'Name an item people use to dress up a snowman.',
    answers: [
      { text: 'Carrot for the Nose', points: 34 },
      { text: 'Cozy Scarf', points: 21 },
      { text: 'Top Hat or Knit Beanie', points: 15 },
      { text: 'Tree Branches for Arms', points: 11 },
      { text: 'Coal or Pebbles for Eyes & Buttons', points: 9 },
      { text: 'Corncob Pipe', points: 4 },
      { text: 'Mittens or Gloves', points: 3 },
      { text: 'Sunglasses', points: 3 }
    ]
  },
  {
    id: 'cf-043',
    category: 'Winter and Snow',
    question: 'Name a piece of winter clothing you must put on before stepping into the snow.',
    answers: [
      { text: 'Heavy Winter Coat / Parka', points: 30 },
      { text: 'Gloves or Mittens', points: 21 },
      { text: 'Snow Boots', points: 16 },
      { text: 'Knit Hat / Beanie', points: 12 },
      { text: 'Warm Scarf', points: 9 },
      { text: 'Thick Wool Socks', points: 5 },
      { text: 'Snow Pants', points: 4 },
      { text: 'Earmuffs', points: 3 }
    ]
  },
  {
    id: 'cf-044',
    category: 'Winter and Snow',
    question: 'Name something that makes staying indoors on a freezing winter night cozy.',
    answers: [
      { text: 'Crackling Fireplace', points: 32 },
      { text: 'Soft Warm Blanket', points: 22 },
      { text: 'Mug of Hot Cocoa or Tea', points: 16 },
      { text: 'Glowing Christmas Tree Lights', points: 10 },
      { text: 'Fuzzy Socks & Pajamas', points: 8 },
      { text: 'Scented Pine or Cinnamon Candle', points: 5 },
      { text: 'Good Book or Holiday Movie', points: 4 },
      { text: 'Warm Soup or Chili', points: 3 }
    ]
  },
  {
    id: 'cf-045',
    category: 'Winter and Snow',
    question: 'Name a winter weather annoyance people complain about in December.',
    answers: [
      { text: 'Scraping Ice Off the Windshield', points: 29 },
      { text: 'Shoveling Heavy Snow', points: 21 },
      { text: 'Slippery Icy Roads & Sidewalks', points: 16 },
      { text: 'Darkness at 4:30 PM', points: 12 },
      { text: 'Freezing Cold Windchill', points: 9 },
      { text: 'Dry Skin & Static Hair', points: 5 },
      { text: 'Muddy Slush Tracked Inside', points: 4 },
      { text: 'High Heating Bills', points: 4 }
    ]
  },

  // === CATEGORY 10: CHRISTMAS TRAVEL (46-50) ===
  {
    id: 'cf-046',
    category: 'Christmas Travel',
    question: 'Name a dream destination people love visiting for a magical Christmas vacation.',
    answers: [
      { text: 'New York City (Rockefeller Center)', points: 31 },
      { text: 'Cozy Mountain Ski Cabin (Aspen / Alps)', points: 20 },
      { text: 'Germany / Austria Christmas Markets', points: 14 },
      { text: 'London', points: 11 },
      { text: 'Tropical Beach (Hawaii / Caribbean)', points: 9 },
      { text: 'Lapland, Finland (Santa’s Village)', points: 6 },
      { text: 'Disney Parks at Christmas', points: 5 },
      { text: 'Quebec City or Paris', points: 4 }
    ]
  },
  {
    id: 'cf-047',
    category: 'Christmas Travel',
    question: 'Name the biggest headache of flying through an airport during Christmas week.',
    answers: [
      { text: 'Long Security Lines', points: 29 },
      { text: 'Weather Flight Delays & Cancellations', points: 24 },
      { text: 'Crowded Terminals & No Seats', points: 14 },
      { text: 'Overpriced Holiday Airfare', points: 11 },
      { text: 'Lost or Overweight Luggage', points: 8 },
      { text: 'Packing Wrapped Presents Through TSA', points: 6 },
      { text: 'Full Overhead Bins', points: 4 },
      { text: 'Traffic Getting to the Airport', points: 4 }
    ]
  },
  {
    id: 'cf-048',
    category: 'Christmas Travel',
    question: 'Name something you always pack when traveling to stay at relatives’ houses for Christmas.',
    answers: [
      { text: 'Wrapped Presents & Gift Bags', points: 28 },
      { text: 'Warm Pajamas & Slippers', points: 20 },
      { text: 'Phone Chargers & Power Bank', points: 15 },
      { text: 'Ugly Sweater / Holiday Outfit', points: 12 },
      { text: 'Heavy Winter Coat & Boots', points: 9 },
      { text: 'Toiletries & Medications', points: 7 },
      { text: 'Hostess Gift (Wine / Cookies)', points: 5 },
      { text: 'Extra Empty Bag for Gifts Going Home', points: 4 }
    ]
  },
  {
    id: 'cf-049',
    category: 'Christmas Travel',
    question: 'Name something families do to pass the time on a long Christmas road trip.',
    answers: [
      { text: 'Sing Along to Christmas Music', points: 32 },
      { text: 'Play Car Games (I Spy / 20 Questions)', points: 20 },
      { text: 'Eat Road Trip Snacks', points: 15 },
      { text: 'Watch Movies on Tablets', points: 11 },
      { text: 'Take Naps in the Passenger Seat', points: 8 },
      { text: 'Listen to Audiobooks or Podcasts', points: 6 },
      { text: 'Admire Christmas Lights Along the Way', points: 4 },
      { text: 'Stop for Hot Coffee & Restroom Breaks', points: 4 }
    ]
  },
  {
    id: 'cf-050',
    category: 'Christmas Travel',
    question: 'Name something people double-check before leaving home for a Christmas trip.',
    answers: [
      { text: 'All Doors & Windows Are Locked', points: 30 },
      { text: 'Christmas Tree Lights Are Unplugged', points: 23 },
      { text: 'Stove & Appliances Are Turned Off', points: 14 },
      { text: 'Thermostat / Heat Setting', points: 10 },
      { text: 'Passports, IDs & Boarding Passes', points: 8 },
      { text: 'Presents Loaded in the Trunk', points: 6 },
      { text: 'Pet Sitter or Mail Hold Arranged', points: 5 },
      { text: 'Trash Taken Out', points: 4 }
    ]
  },

  // === CATEGORY 11: CHRISTMAS PARTIES (51-54) ===
  {
    id: 'cf-051',
    category: 'Christmas Parties',
    question: 'Name something you are guaranteed to see at an office Christmas party.',
    answers: [
      { text: 'Ugly Christmas Sweaters', points: 29 },
      { text: 'Secret Santa / White Elephant Swap', points: 21 },
      { text: 'Buffet Table & Holiday Cookies', points: 15 },
      { text: 'Festive Photo Booth with Props', points: 11 },
      { text: 'The Boss Giving a Holiday Speech', points: 9 },
      { text: 'Coworker Who Dances Too Enthusiastically', points: 6 },
      { text: 'Raffle Prizes or Holiday Bonuses', points: 5 },
      { text: 'Christmas Playlist on Repeat', points: 4 }
    ]
  },
  {
    id: 'cf-052',
    category: 'Christmas Parties',
    question: 'Name a wildly popular party game played at Christmas gatherings.',
    answers: [
      { text: 'White Elephant / Yankee Swap', points: 32 },
      { text: 'Christmas Trivia / Christmas FEUD', points: 20 },
      { text: 'Saran Wrap Prize Ball Game', points: 14 },
      { text: 'Holiday Charades', points: 11 },
      { text: 'Name That Christmas Tune', points: 9 },
      { text: 'Christmas Bingo', points: 6 },
      { text: 'Oven-Mitt Gift Unwrapping Race', points: 4 },
      { text: 'Ugly Sweater Judging Contest', points: 4 }
    ]
  },
  {
    id: 'cf-053',
    category: 'Christmas Parties',
    question: 'Name a classic feature on an award-winning Ugly Christmas Sweater.',
    answers: [
      { text: 'Flashing Battery-Powered LED Lights', points: 31 },
      { text: '3D Pom-Poms or Jingle Bells', points: 21 },
      { text: 'Giant Sequined Reindeer or Santa', points: 15 },
      { text: 'Tinsel Garland Stitched On', points: 11 },
      { text: 'Cheesy Holiday Pun Slogan', points: 8 },
      { text: 'Attached Mini Stockings or Bows', points: 6 },
      { text: 'Clashing Red, Green & Neon Yarn', points: 4 },
      { text: 'Stuffed Plush Head Sticking Out', points: 4 }
    ]
  },
  {
    id: 'cf-054',
    category: 'Christmas Parties',
    question: 'Name a fun theme people pick for a Christmas house party.',
    answers: [
      { text: 'Ugly Christmas Sweater Party', points: 33 },
      { text: 'Winter Wonderland (White & Silver)', points: 20 },
      { text: 'Cozy Pajama & Hot Cocoa Party', points: 15 },
      { text: 'Cookie Exchange Party', points: 11 },
      { text: 'Christmas Movie Marathon Night', points: 8 },
      { text: 'Santa’s Workshop / North Pole', points: 5 },
      { text: 'Gingerbread House Showdown', points: 4 },
      { text: 'Retro Vintage Christmas Cocktail Night', points: 4 }
    ]
  },

  // === CATEGORY 12: CHRISTMAS FOOD AND DRINKS (55-58) ===
  {
    id: 'cf-055',
    category: 'Christmas Food and Drinks',
    question: 'Name a centerpiece food people serve at Christmas dinner.',
    answers: [
      { text: 'Roast Turkey', points: 29 },
      { text: 'Honey-Glazed Ham', points: 23 },
      { text: 'Prime Rib / Roast Beef', points: 15 },
      { text: 'Stuffing & Gravy', points: 10 },
      { text: 'Mashed Potatoes', points: 8 },
      { text: 'Cranberry Sauce', points: 6 },
      { text: 'Roast Duck or Goose', points: 5 },
      { text: 'Tamales or Lasagna', points: 4 }
    ]
  },
  {
    id: 'cf-056',
    category: 'Christmas Food and Drinks',
    question: 'Name a favorite festive drink people sip during the Christmas holidays.',
    answers: [
      { text: 'Hot Chocolate with Marshmallows', points: 31 },
      { text: 'Eggnog', points: 22 },
      { text: 'Warm Mulled Apple Cider', points: 15 },
      { text: 'Mulled Wine (Glühwein)', points: 10 },
      { text: 'Peppermint Mocha', points: 8 },
      { text: 'Sparkling Cranberry Punch', points: 6 },
      { text: 'Champagne / Mimosa', points: 4 },
      { text: 'Spiced Holiday Tea', points: 4 }
    ]
  },
  {
    id: 'cf-057',
    category: 'Christmas Food and Drinks',
    question: 'Name a classic Christmas cookie or holiday dessert.',
    answers: [
      { text: 'Gingerbread Men', points: 27 },
      { text: 'Frosted Sugar Cookies', points: 22 },
      { text: 'Apple or Pecan Pie', points: 15 },
      { text: 'Yule Log Cake (Bûche de Noël)', points: 11 },
      { text: 'Christmas Pudding', points: 8 },
      { text: 'Peppermint Bark', points: 7 },
      { text: 'Shortbread Cookies', points: 6 },
      { text: 'Panettone or Fruitcake', points: 4 }
    ]
  },
  {
    id: 'cf-058',
    category: 'Christmas Food and Drinks',
    question: 'Name a sweet treat people love finding inside their Christmas stocking.',
    answers: [
      { text: 'Candy Canes', points: 32 },
      { text: 'Chocolate Coins', points: 20 },
      { text: 'Chocolate Santa', points: 14 },
      { text: 'Terry’s Chocolate Orange', points: 10 },
      { text: 'Peppermint Bark', points: 8 },
      { text: 'Homemade Fudge', points: 7 },
      { text: 'Tangerine / Clementine', points: 5 },
      { text: 'Peanut Brittle or Caramels', points: 4 }
    ]
  },

  // === CATEGORY 13: CHRISTMAS SHOPPING (59-62) ===
  {
    id: 'cf-059',
    category: 'Christmas Shopping',
    question: 'Name something people buy in a panic on Christmas Eve.',
    answers: [
      { text: 'Gift Cards', points: 35 },
      { text: 'Wrapping Paper & Tape', points: 19 },
      { text: 'Batteries (AA / AAA)', points: 14 },
      { text: 'Scented Candles or Chocolates', points: 10 },
      { text: 'Wine or Holiday Drinks', points: 8 },
      { text: 'Stocking Stuffers', points: 6 },
      { text: 'Missing Groceries (Butter / Rolls)', points: 4 },
      { text: 'Greeting Cards', points: 4 }
    ]
  },
  {
    id: 'cf-060',
    category: 'Christmas Shopping',
    question: 'Name the biggest stress of shopping at the mall right before Christmas.',
    answers: [
      { text: 'Impossible Parking Lots', points: 30 },
      { text: 'Huge Checkout Lines', points: 23 },
      { text: 'Sold-Out Popular Items & Sizes', points: 16 },
      { text: 'Crowded Walkways & Bumping Elbows', points: 11 },
      { text: 'Blowing Your Holiday Budget', points: 8 },
      { text: 'Carrying Too Many Heavy Bags', points: 5 },
      { text: 'Overheated Stores in a Winter Coat', points: 4 },
      { text: 'Waiting in Line for Mall Santa', points: 3 }
    ]
  },
  {
    id: 'cf-061',
    category: 'Christmas Shopping',
    question: 'Name a major holiday shopping event where people hunt for Christmas deals.',
    answers: [
      { text: 'Black Friday', points: 37 },
      { text: 'Cyber Monday', points: 24 },
      { text: 'Boxing Day / After-Christmas Sales', points: 13 },
      { text: 'Small Business Saturday', points: 9 },
      { text: 'Super Saturday (Last Weekend)', points: 6 },
      { text: 'Early November Flash Sales', points: 5 },
      { text: 'Free Shipping Day', points: 3 },
      { text: 'Holiday Clearance Markdowns', points: 3 }
    ]
  },
  {
    id: 'cf-062',
    category: 'Christmas Shopping',
    question: 'Name a sneaky hiding spot parents use to stash Christmas gifts before December 25.',
    answers: [
      { text: 'Top Shelf of the Master Closet', points: 33 },
      { text: 'Car Trunk', points: 21 },
      { text: 'Attic or Basement', points: 14 },
      { text: 'Under the Bed', points: 11 },
      { text: 'Inside Suitcases or Storage Bins', points: 8 },
      { text: 'Garage Cabinets', points: 5 },
      { text: 'At a Neighbor’s or Grandparent’s House', points: 4 },
      { text: 'Behind Laundry / Linen Closet', points: 4 }
    ]
  },

  // === CATEGORY 14: CHRISTMAS CHARACTERS AND STORIES (63-66) ===
  {
    id: 'cf-063',
    category: 'Christmas Characters and Stories',
    question: 'Name a famous Christmas character besides Santa Claus.',
    answers: [
      { text: 'Rudolph the Red-Nosed Reindeer', points: 28 },
      { text: 'The Grinch', points: 23 },
      { text: 'Frosty the Snowman', points: 16 },
      { text: 'Mrs. Claus', points: 11 },
      { text: 'Ebenezer Scrooge', points: 8 },
      { text: 'Buddy the Elf', points: 6 },
      { text: 'The Nutcracker', points: 4 },
      { text: 'Tiny Tim', points: 4 }
    ]
  },
  {
    id: 'cf-064',
    category: 'Christmas Characters and Stories',
    question: 'Name a classic Christmas book or story read aloud to children.',
    answers: [
      { text: 'Twas the Night Before Christmas', points: 31 },
      { text: 'How the Grinch Stole Christmas!', points: 22 },
      { text: 'A Christmas Carol', points: 16 },
      { text: 'The Polar Express', points: 12 },
      { text: 'The Nutcracker', points: 7 },
      { text: 'The Nativity Story', points: 5 },
      { text: 'The Gift of the Magi', points: 4 },
      { text: 'Rudolph the Red-Nosed Reindeer', points: 3 }
    ]
  },
  {
    id: 'cf-065',
    category: 'Christmas Characters and Stories',
    question: 'Name something famously associated with the Grinch.',
    answers: [
      { text: 'His Bright Green Fur', points: 30 },
      { text: 'His Loyal Dog Max', points: 22 },
      { text: 'Heart Two Sizes Too Small', points: 16 },
      { text: 'Mount Crumpit & Whoville', points: 11 },
      { text: 'Stealing Trees & Presents', points: 8 },
      { text: 'Cindy Lou Who', points: 6 },
      { text: 'Roast Beast', points: 4 },
      { text: 'Mischievous Wicked Grin', points: 3 }
    ]
  },
  {
    id: 'cf-066',
    category: 'Christmas Characters and Stories',
    question: 'Name one of the spirits who visits Ebenezer Scrooge in "A Christmas Carol."',
    answers: [
      { text: 'Ghost of Christmas Past', points: 31 },
      { text: 'Ghost of Christmas Present', points: 29 },
      { text: 'Ghost of Christmas Yet to Come', points: 25 },
      { text: 'Jacob Marley’s Ghost', points: 11 },
      { text: 'Rattling Chains & Cashboxes (Marley)', points: 1 },
      { text: 'Ignorance and Want', points: 1 },
      { text: 'Phantom Hooded Reaper', points: 1 },
      { text: 'Wandering Restless Spirits Outside', points: 1 }
    ]
  },

  // === CATEGORY 15: FUNNY CHRISTMAS SITUATIONS (67-70) ===
  {
    id: 'cf-067',
    category: 'Funny Christmas Situations',
    question: 'Name a classic polite reaction when you open a Christmas gift you secretly hate.',
    answers: [
      { text: '"Oh wow, you shouldn’t have!"', points: 32 },
      { text: '"It’s just what I needed!"', points: 21 },
      { text: 'Forced Big Smile & Quick Hug', points: 15 },
      { text: '"How thoughtful / unique!"', points: 11 },
      { text: 'Secretly Checking for a Gift Receipt', points: 8 },
      { text: '"I’ve never seen one like this!"', points: 6 },
      { text: '"Can’t wait to try it!"', points: 4 },
      { text: 'Planning Who to Regift It To', points: 3 }
    ]
  },
  {
    id: 'cf-068',
    category: 'Funny Christmas Situations',
    question: 'Name a hilarious disaster involving a family pet and Christmas decorations.',
    answers: [
      { text: 'Cat Climbing & Toppling the Tree', points: 35 },
      { text: 'Dog Chewing Up Wrapped Presents', points: 20 },
      { text: 'Pet Drinking the Tree Stand Water', points: 14 },
      { text: 'Battting Breakable Ornaments Off Branches', points: 10 },
      { text: 'Tangled Up in Tinsel or Ribbon', points: 8 },
      { text: 'Stealing Cookies Left Out for Santa', points: 6 },
      { text: 'Chewing Through Tree Light Wires', points: 4 },
      { text: 'Refusing to Wear Reindeer Antlers', points: 3 }
    ]
  },
  {
    id: 'cf-069',
    category: 'Funny Christmas Situations',
    question: 'Name a funny mistake people make when wrapping Christmas gifts.',
    answers: [
      { text: 'Cutting Paper Slightly Too Short', points: 33 },
      { text: 'Forgetting to Remove the Price Tag', points: 22 },
      { text: 'Putting the Wrong Name Tag on a Box', points: 15 },
      { text: 'Losing the End of the Clear Tape', points: 10 },
      { text: 'Forgetting What Is Inside Before Labeling', points: 7 },
      { text: 'Using Half a Roll of Tape on One Gift', points: 6 },
      { text: 'Accidentally Wrapping the Scissors Inside', points: 4 },
      { text: 'Giving Up and Using a Gift Bag', points: 3 }
    ]
  },
  {
    id: 'cf-070',
    category: 'Funny Christmas Situations',
    question: 'Name an awkward moment that happens during a White Elephant gift exchange.',
    answers: [
      { text: 'Everyone Stealing the Same One Good Gift', points: 31 },
      { text: 'Getting Stuck with a Weird Gag Gift', points: 23 },
      { text: 'Someone Accidentally Opens Their Own Gift', points: 14 },
      { text: 'Stealing From a Friend Who Gets Mock-Mad', points: 10 },
      { text: 'Recognizing a Regifted Item From Last Year', points: 8 },
      { text: 'Forgetting the Exact Steal Limit Rules', points: 6 },
      { text: 'Someone Clearly Overspent the Dollar Limit', points: 4 },
      { text: 'Nobody Wanting to Steal Your Gift', points: 4 }
    ]
  }
];

module.exports = STANDARD_CLASSIC_ROUNDS;

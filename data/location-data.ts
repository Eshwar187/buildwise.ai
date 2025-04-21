// Location data for countries, states, and cities

export interface Country {
  code: string;
  name: string;
}

export interface State {
  code: string;
  name: string;
  countryCode: string;
}

export interface City {
  name: string;
  stateCode: string;
}

export const countries: Country[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "ZA", name: "South Africa" },
  { code: "RU", name: "Russia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
  { code: "NZ", name: "New Zealand" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "IE", name: "Ireland" },
  { code: "PL", name: "Poland" },
];

export const states: State[] = [
  // United States
  { code: "AL", name: "Alabama", countryCode: "US" },
  { code: "AK", name: "Alaska", countryCode: "US" },
  { code: "AZ", name: "Arizona", countryCode: "US" },
  { code: "AR", name: "Arkansas", countryCode: "US" },
  { code: "CA", name: "California", countryCode: "US" },
  { code: "CO", name: "Colorado", countryCode: "US" },
  { code: "CT", name: "Connecticut", countryCode: "US" },
  { code: "DE", name: "Delaware", countryCode: "US" },
  { code: "FL", name: "Florida", countryCode: "US" },
  { code: "GA", name: "Georgia", countryCode: "US" },
  { code: "HI", name: "Hawaii", countryCode: "US" },
  { code: "ID", name: "Idaho", countryCode: "US" },
  { code: "IL", name: "Illinois", countryCode: "US" },
  { code: "IN", name: "Indiana", countryCode: "US" },
  { code: "IA", name: "Iowa", countryCode: "US" },
  { code: "KS", name: "Kansas", countryCode: "US" },
  { code: "KY", name: "Kentucky", countryCode: "US" },
  { code: "LA", name: "Louisiana", countryCode: "US" },
  { code: "ME", name: "Maine", countryCode: "US" },
  { code: "MD", name: "Maryland", countryCode: "US" },
  { code: "MA", name: "Massachusetts", countryCode: "US" },
  { code: "MI", name: "Michigan", countryCode: "US" },
  { code: "MN", name: "Minnesota", countryCode: "US" },
  { code: "MS", name: "Mississippi", countryCode: "US" },
  { code: "MO", name: "Missouri", countryCode: "US" },
  { code: "MT", name: "Montana", countryCode: "US" },
  { code: "NE", name: "Nebraska", countryCode: "US" },
  { code: "NV", name: "Nevada", countryCode: "US" },
  { code: "NH", name: "New Hampshire", countryCode: "US" },
  { code: "NJ", name: "New Jersey", countryCode: "US" },
  { code: "NM", name: "New Mexico", countryCode: "US" },
  { code: "NY", name: "New York", countryCode: "US" },
  { code: "NC", name: "North Carolina", countryCode: "US" },
  { code: "ND", name: "North Dakota", countryCode: "US" },
  { code: "OH", name: "Ohio", countryCode: "US" },
  { code: "OK", name: "Oklahoma", countryCode: "US" },
  { code: "OR", name: "Oregon", countryCode: "US" },
  { code: "PA", name: "Pennsylvania", countryCode: "US" },
  { code: "RI", name: "Rhode Island", countryCode: "US" },
  { code: "SC", name: "South Carolina", countryCode: "US" },
  { code: "SD", name: "South Dakota", countryCode: "US" },
  { code: "TN", name: "Tennessee", countryCode: "US" },
  { code: "TX", name: "Texas", countryCode: "US" },
  { code: "UT", name: "Utah", countryCode: "US" },
  { code: "VT", name: "Vermont", countryCode: "US" },
  { code: "VA", name: "Virginia", countryCode: "US" },
  { code: "WA", name: "Washington", countryCode: "US" },
  { code: "WV", name: "West Virginia", countryCode: "US" },
  { code: "WI", name: "Wisconsin", countryCode: "US" },
  { code: "WY", name: "Wyoming", countryCode: "US" },
  { code: "DC", name: "District of Columbia", countryCode: "US" },

  // Canada
  { code: "AB", name: "Alberta", countryCode: "CA" },
  { code: "BC", name: "British Columbia", countryCode: "CA" },
  { code: "MB", name: "Manitoba", countryCode: "CA" },
  { code: "NB", name: "New Brunswick", countryCode: "CA" },
  { code: "NL", name: "Newfoundland and Labrador", countryCode: "CA" },
  { code: "NS", name: "Nova Scotia", countryCode: "CA" },
  { code: "NT", name: "Northwest Territories", countryCode: "CA" },
  { code: "NU", name: "Nunavut", countryCode: "CA" },
  { code: "ON", name: "Ontario", countryCode: "CA" },
  { code: "PE", name: "Prince Edward Island", countryCode: "CA" },
  { code: "QC", name: "Quebec", countryCode: "CA" },
  { code: "SK", name: "Saskatchewan", countryCode: "CA" },
  { code: "YT", name: "Yukon", countryCode: "CA" },

  // United Kingdom
  { code: "ENG", name: "England", countryCode: "GB" },
  { code: "SCT", name: "Scotland", countryCode: "GB" },
  { code: "WLS", name: "Wales", countryCode: "GB" },
  { code: "NIR", name: "Northern Ireland", countryCode: "GB" },

  // Australia
  { code: "NSW", name: "New South Wales", countryCode: "AU" },
  { code: "QLD", name: "Queensland", countryCode: "AU" },
  { code: "SA", name: "South Australia", countryCode: "AU" },
  { code: "TAS", name: "Tasmania", countryCode: "AU" },
  { code: "VIC", name: "Victoria", countryCode: "AU" },
  { code: "WA", name: "Western Australia", countryCode: "AU" },
  { code: "ACT", name: "Australian Capital Territory", countryCode: "AU" },
  { code: "NT", name: "Northern Territory", countryCode: "AU" },

  // India
  { code: "AP", name: "Andhra Pradesh", countryCode: "IN" },
  { code: "AR", name: "Arunachal Pradesh", countryCode: "IN" },
  { code: "AS", name: "Assam", countryCode: "IN" },
  { code: "BR", name: "Bihar", countryCode: "IN" },
  { code: "CT", name: "Chhattisgarh", countryCode: "IN" },
  { code: "GA", name: "Goa", countryCode: "IN" },
  { code: "GJ", name: "Gujarat", countryCode: "IN" },
  { code: "HR", name: "Haryana", countryCode: "IN" },
  { code: "HP", name: "Himachal Pradesh", countryCode: "IN" },
  { code: "JH", name: "Jharkhand", countryCode: "IN" },
  { code: "KA", name: "Karnataka", countryCode: "IN" },
  { code: "KL", name: "Kerala", countryCode: "IN" },
  { code: "MP", name: "Madhya Pradesh", countryCode: "IN" },
  { code: "MH", name: "Maharashtra", countryCode: "IN" },
  { code: "MN", name: "Manipur", countryCode: "IN" },
  { code: "ML", name: "Meghalaya", countryCode: "IN" },
  { code: "MZ", name: "Mizoram", countryCode: "IN" },
  { code: "NL", name: "Nagaland", countryCode: "IN" },
  { code: "OR", name: "Odisha", countryCode: "IN" },
  { code: "PB", name: "Punjab", countryCode: "IN" },
  { code: "RJ", name: "Rajasthan", countryCode: "IN" },
  { code: "SK", name: "Sikkim", countryCode: "IN" },
  { code: "TN", name: "Tamil Nadu", countryCode: "IN" },
  { code: "TG", name: "Telangana", countryCode: "IN" },
  { code: "TR", name: "Tripura", countryCode: "IN" },
  { code: "UP", name: "Uttar Pradesh", countryCode: "IN" },
  { code: "UK", name: "Uttarakhand", countryCode: "IN" },
  { code: "WB", name: "West Bengal", countryCode: "IN" },
  { code: "AN", name: "Andaman and Nicobar Islands", countryCode: "IN" },
  { code: "CH", name: "Chandigarh", countryCode: "IN" },
  { code: "DN", name: "Dadra and Nagar Haveli", countryCode: "IN" },
  { code: "DD", name: "Daman and Diu", countryCode: "IN" },
  { code: "DL", name: "Delhi", countryCode: "IN" },
  { code: "JK", name: "Jammu and Kashmir", countryCode: "IN" },
  { code: "LA", name: "Ladakh", countryCode: "IN" },
  { code: "LD", name: "Lakshadweep", countryCode: "IN" },
  { code: "PY", name: "Puducherry", countryCode: "IN" },

  // Germany
  { code: "BW", name: "Baden-Württemberg", countryCode: "DE" },
  { code: "BY", name: "Bavaria", countryCode: "DE" },
  { code: "BE", name: "Berlin", countryCode: "DE" },
  { code: "BB", name: "Brandenburg", countryCode: "DE" },
  { code: "HB", name: "Bremen", countryCode: "DE" },
  { code: "HH", name: "Hamburg", countryCode: "DE" },
  { code: "HE", name: "Hesse", countryCode: "DE" },
  { code: "MV", name: "Mecklenburg-Vorpommern", countryCode: "DE" },
  { code: "NI", name: "Lower Saxony", countryCode: "DE" },
  { code: "NW", name: "North Rhine-Westphalia", countryCode: "DE" },
  { code: "RP", name: "Rhineland-Palatinate", countryCode: "DE" },
  { code: "SL", name: "Saarland", countryCode: "DE" },
  { code: "SN", name: "Saxony", countryCode: "DE" },
  { code: "ST", name: "Saxony-Anhalt", countryCode: "DE" },
  { code: "SH", name: "Schleswig-Holstein", countryCode: "DE" },
  { code: "TH", name: "Thuringia", countryCode: "DE" },
];

export const cities: { [stateCode: string]: string[] } = {
  // US States
  "AL": ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa", "Hoover", "Dothan", "Auburn", "Decatur", "Madison"],
  "AK": ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan", "Wasilla", "Kenai", "Kodiak", "Bethel", "Palmer"],
  "AZ": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Glendale", "Gilbert", "Tempe", "Peoria", "Surprise"],
  "AR": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro", "North Little Rock", "Conway", "Rogers", "Pine Bluff", "Bentonville"],
  "CA": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Fresno", "Oakland", "Long Beach", "Bakersfield", "Anaheim"],
  "CO": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Thornton", "Arvada", "Westminster", "Pueblo", "Centennial"],
  "CT": ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury", "Norwalk", "Danbury", "New Britain", "Bristol", "Meriden"],
  "DE": ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna", "Milford", "Seaford", "Georgetown", "Elsmere", "New Castle"],
  "FL": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Cape Coral"],
  "GA": ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah", "Athens", "Sandy Springs", "Roswell", "Albany", "Johns Creek"],
  "HI": ["Honolulu", "East Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu", "Kaneohe", "Mililani Town", "Kahului", "Ewa Gentry"],
  "ID": ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello", "Caldwell", "Coeur d'Alene", "Twin Falls", "Lewiston", "Post Falls"],
  "IL": ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville", "Springfield", "Peoria", "Elgin", "Waukegan", "Cicero"],
  "IN": ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel", "Fishers", "Bloomington", "Hammond", "Gary", "Lafayette"],
  "IA": ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City", "Waterloo", "Council Bluffs", "Ames", "West Des Moines", "Ankeny"],
  "KS": ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka", "Lawrence", "Shawnee", "Manhattan", "Lenexa", "Salina"],
  "KY": ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington", "Richmond", "Georgetown", "Florence", "Hopkinsville", "Nicholasville"],
  "LA": ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles", "Kenner", "Bossier City", "Monroe", "Alexandria", "Houma"],
  "ME": ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn", "Biddeford", "Sanford", "Augusta", "Saco", "Westbrook"],
  "MD": ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie", "Hagerstown", "Annapolis", "College Park", "Salisbury", "Laurel"],
  "MA": ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge", "New Bedford", "Brockton", "Quincy", "Lynn", "Fall River"],
  "MI": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing", "Flint", "Dearborn", "Livonia", "Troy"],
  "MN": ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington", "Brooklyn Park", "Plymouth", "St. Cloud", "Eagan", "Woodbury"],
  "MS": ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi", "Meridian", "Tupelo", "Greenville", "Olive Branch", "Horn Lake"],
  "MO": ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence", "Lee's Summit", "O'Fallon", "St. Joseph", "St. Charles", "Blue Springs"],
  "MT": ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte", "Helena", "Kalispell", "Havre", "Anaconda", "Miles City"],
  "NE": ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney", "Fremont", "Hastings", "Norfolk", "Columbus", "North Platte"],
  "NV": ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks", "Carson City", "Fernley", "Elko", "Mesquite", "Boulder City"],
  "NH": ["Manchester", "Nashua", "Concord", "Derry", "Dover", "Rochester", "Salem", "Merrimack", "Londonderry", "Hudson"],
  "NJ": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Trenton", "Clifton", "Camden", "Passaic", "Union City", "Bayonne"],
  "NM": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell", "Farmington", "Clovis", "Hobbs", "Alamogordo", "Carlsbad"],
  "NY": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica"],
  "NC": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville", "Cary", "Wilmington", "High Point", "Concord"],
  "ND": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo", "Williston", "Dickinson", "Mandan", "Jamestown", "Wahpeton"],
  "OH": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma", "Canton", "Youngstown", "Lorain"],
  "OK": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Lawton", "Edmond", "Moore", "Midwest City", "Enid", "Stillwater"],
  "OR": ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro", "Beaverton", "Bend", "Medford", "Springfield", "Corvallis"],
  "PA": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton", "Bethlehem", "Lancaster", "Harrisburg", "Altoona"],
  "RI": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence", "Woonsocket", "Coventry", "Cumberland", "North Providence", "South Kingstown"],
  "SC": ["Columbia", "Charleston", "North Charleston", "Mount Pleasant", "Rock Hill", "Greenville", "Summerville", "Sumter", "Goose Creek", "Hilton Head Island"],
  "SD": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown", "Mitchell", "Yankton", "Pierre", "Huron", "Vermillion"],
  "TN": ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville", "Murfreesboro", "Franklin", "Jackson", "Johnson City", "Bartlett"],
  "TX": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Lubbock"],
  "UT": ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem", "Sandy", "Ogden", "St. George", "Layton", "South Jordan"],
  "VT": ["Burlington", "South Burlington", "Rutland", "Barre", "Montpelier", "Winooski", "St. Albans", "Newport", "Vergennes", "Brattleboro"],
  "VA": ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria", "Hampton", "Roanoke", "Portsmouth", "Suffolk"],
  "WA": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent", "Everett", "Renton", "Yakima", "Federal Way"],
  "WV": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling", "Weirton", "Fairmont", "Beckley", "Clarksburg", "Martinsburg"],
  "WI": ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine", "Appleton", "Waukesha", "Eau Claire", "Oshkosh", "Janesville"],
  "WY": ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs", "Sheridan", "Green River", "Evanston", "Riverton", "Jackson"],
  "DC": ["Washington"],

  // Canada
  "ON": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Vaughan", "Kitchener", "Windsor"],
  "QC": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay", "Lévis", "Trois-Rivières", "Terrebonne"],
  "BC": ["Vancouver", "Surrey", "Burnaby", "Richmond", "Abbotsford", "Coquitlam", "Kelowna", "Victoria", "Nanaimo", "Kamloops"],
  "AB": ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert", "Medicine Hat", "Grande Prairie", "Airdrie", "Spruce Grove", "Leduc"],
  "MB": ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie", "Selkirk", "Winkler", "Dauphin", "Morden", "The Pas"],
  "SK": ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current", "Yorkton", "North Battleford", "Estevan", "Weyburn", "Warman"],
  "NS": ["Halifax", "Sydney", "Truro", "New Glasgow", "Glace Bay", "Dartmouth", "Kentville", "Amherst", "Bridgewater", "Yarmouth"],
  "NB": ["Moncton", "Saint John", "Fredericton", "Dieppe", "Miramichi", "Edmundston", "Bathurst", "Campbellton", "Oromocto", "Grand Falls"],
  "NL": ["St. John's", "Mount Pearl", "Corner Brook", "Conception Bay South", "Grand Falls-Windsor", "Paradise", "Gander", "Carbonear", "Stephenville", "Torbay"],
  "PE": ["Charlottetown", "Summerside", "Stratford", "Cornwall", "Montague", "Kensington", "Souris", "Alberton", "Georgetown", "Tignish"],
  "YT": ["Whitehorse", "Dawson City", "Watson Lake", "Haines Junction", "Mayo", "Faro", "Carmacks", "Teslin", "Ross River", "Carcross"],
  "NT": ["Yellowknife", "Hay River", "Inuvik", "Fort Smith", "Norman Wells", "Fort Simpson", "Behchoko", "Fort Liard", "Tuktoyaktuk", "Fort Providence"],
  "NU": ["Iqaluit", "Rankin Inlet", "Arviat", "Baker Lake", "Cambridge Bay", "Igloolik", "Pond Inlet", "Pangnirtung", "Kugluktuk", "Gjoa Haven"],

  // UK
  "ENG": ["London", "Birmingham", "Manchester", "Leeds", "Liverpool", "Newcastle", "Sheffield", "Bristol", "Nottingham", "Southampton"],
  "SCT": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness", "Stirling", "Perth", "Paisley", "Livingston", "East Kilbride"],
  "WLS": ["Cardiff", "Swansea", "Newport", "Bangor", "St Davids", "Wrexham", "St Asaph", "Aberystwyth", "Llandaff", "Brecon"],
  "NIR": ["Belfast", "Londonderry", "Lisburn", "Newry", "Bangor", "Craigavon", "Newtownabbey", "Coleraine", "Antrim", "Omagh"],

  // Australia
  "NSW": ["Sydney", "Newcastle", "Wollongong", "Central Coast", "Maitland", "Coffs Harbour", "Wagga Wagga", "Port Macquarie", "Tamworth", "Orange"],
  "VIC": ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton", "Melton", "Mildura", "Warrnambool", "Wodonga", "Traralgon"],
  "QLD": ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns", "Toowoomba", "Mackay", "Rockhampton", "Bundaberg", "Hervey Bay"],
  "SA": ["Adelaide", "Mount Gambier", "Whyalla", "Port Augusta", "Port Lincoln", "Victor Harbor", "Port Pirie", "Murray Bridge", "Gawler", "Mount Barker"],
  "WA": ["Perth", "Bunbury", "Geraldton", "Kalgoorlie", "Albany", "Broome", "Karratha", "Port Hedland", "Esperance", "Mandurah"],
  "TAS": ["Hobart", "Launceston", "Devonport", "Burnie", "Ulverstone", "Kingston", "Sorell", "New Norfolk", "Wynyard", "George Town"],
  "NT": ["Darwin", "Alice Springs", "Palmerston", "Katherine", "Tennant Creek", "Nhulunbuy", "Jabiru", "Yulara", "Alyangula", "Elliott"],
  "ACT": ["Canberra", "Queanbeyan", "Belconnen", "Tuggeranong", "Woden Valley", "Gungahlin", "Weston Creek", "Molonglo Valley", "Hall", "Tharwa"],

  // India
  "MH": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Sangli"],
  "DL": ["New Delhi", "Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad", "Greater Noida", "Rohini", "Dwarka", "Janakpuri"],
  "KA": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga"],
  "TN": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukudi"],
  "WB": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur"],

  // Germany
  "BE": ["Berlin"],
  "BY": ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Ingolstadt", "Würzburg", "Fürth", "Erlangen", "Bamberg", "Bayreuth"],
  "NW": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg", "Bochum", "Wuppertal", "Bonn", "Münster", "Mönchengladbach"],
  "BW": ["Stuttgart", "Karlsruhe", "Mannheim", "Freiburg", "Heidelberg", "Ulm", "Heilbronn", "Pforzheim", "Reutlingen", "Tübingen"],
  "HE": ["Frankfurt", "Wiesbaden", "Kassel", "Darmstadt", "Offenbach", "Hanau", "Gießen", "Marburg", "Fulda", "Bad Homburg"],

  // Default cities for any state not explicitly listed
  "DEFAULT": ["Capital City", "Major City", "Central City", "Riverside", "Lakeside", "Mountainview", "Coastal Town", "Valley City", "Harbor City", "Metro City"]
};

// Function to get states by country code
export function getStatesByCountry(countryCode: string): State[] {
  return states.filter(state => state.countryCode === countryCode);
}

// Function to get cities by state code
export function getCitiesByState(stateCode: string): string[] {
  // Return cities for the state if available, otherwise return default cities
  return cities[stateCode] || cities["DEFAULT"] || [];
}

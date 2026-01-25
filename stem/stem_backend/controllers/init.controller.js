import Topic from "../models/Topic.js";
import Problem from "../models/Problem.js";
import Experiment from "../models/Experiment.js";

export const initData = async (req, res) => {
  await Topic.deleteMany({});
  await Problem.deleteMany({});
  await Experiment.deleteMany({});

  /* ---------------- MATH TOPICS ---------------- */
  const topics = await Topic.insertMany([
    {
      subject: "math",
      title: "Addition & Subtraction",
      difficulty: "easy",
      category: "arithmetic",
      description: "Learn to add and subtract numbers",
    },
    {
      subject: "math",
      title: "Multiplication Tables",
      difficulty: "easy",
      category: "arithmetic",
      description: "Master multiplication from 1 to 12",
    },
    {
      subject: "math",
      title: "Division Basics",
      difficulty: "medium",
      category: "arithmetic",
      description: "Understanding division and remainders",
    },
    {
      subject: "math",
      title: "Fractions",
      difficulty: "medium",
      category: "arithmetic",
      description: "Working with fractions and decimals",
    },
    {
      subject: "math",
      title: "Basic Algebra",
      difficulty: "hard",
      category: "algebra",
      description: "Introduction to variables and equations",
    },
    {
      subject: "math",
      title: "Geometry Shapes",
      difficulty: "easy",
      category: "geometry",
      description: "Learn about shapes and their properties",
    },
    {
      subject: "math",
      title: "Angles & Lines",
      difficulty: "medium",
      category: "geometry",
      description: "Understanding angles, lines, and measurements",
    },
    {
      subject: "math",
      title: "Measurement",
      difficulty: "easy",
      category: "measurement",
      description: "Length, weight, volume, and time",
    },
  ]);

  /* ---------------- SCIENCE TOPICS ---------------- */
  const scienceTopics = await Topic.insertMany([
    {
      subject: "science",
      title: "Living & Non-Living Things",
      difficulty: "easy",
      category: "biology",
      description: "Understanding living and non-living things",
    },
    {
      subject: "science",
      title: "Plants & Animals",
      difficulty: "easy",
      category: "biology",
      description: "Learn about plants and animals",
    },
    {
      subject: "science",
      title: "Human Body",
      difficulty: "medium",
      category: "biology",
      description: "Basic parts and functions of the human body",
    },
    {
      subject: "science",
      title: "Matter & Materials",
      difficulty: "easy",
      category: "chemistry",
      description: "Solids, liquids, and gases",
    },
    {
      subject: "science",
      title: "Force & Motion",
      difficulty: "medium",
      category: "physics",
      description: "Understanding movement and forces",
    },
    {
      subject: "science",
      title: "Energy & Electricity",
      difficulty: "medium",
      category: "physics",
      description: "Basics of energy and electricity",
    },
    {
      subject: "science",
      title: "Earth & Space",
      difficulty: "easy",
      category: "earth-science",
      description: "Earth, moon, and solar system",
    },
    {
      subject: "science",
      title: "Environment & Pollution",
      difficulty: "hard",
      category: "environment",
      description: "Protecting the environment",
    },
  ]);

  /* ---------------- COMPUTER TOPICS ---------------- */
  const computerTopics = await Topic.insertMany([
    {
      subject: "computer",
      title: "Computer Basics",
      difficulty: "easy",
      category: "fundamentals",
      description: "Introduction to computers and their uses",
    },
    {
      subject: "computer",
      title: "Parts of a Computer",
      difficulty: "easy",
      category: "hardware",
      description: "Learn about input, output, and processing devices",
    },
    {
      subject: "computer",
      title: "Operating System",
      difficulty: "medium",
      category: "software",
      description: "Understanding operating systems",
    },
    {
      subject: "computer",
      title: "Input & Output Devices",
      difficulty: "easy",
      category: "hardware",
      description: "Devices used to input and output data",
    },
    {
      subject: "computer",
      title: "Introduction to Programming",
      difficulty: "medium",
      category: "programming",
      description: "Basics of coding and logic",
    },
    {
      subject: "computer",
      title: "Internet Basics",
      difficulty: "easy",
      category: "networking",
      description: "Understanding the internet and email",
    },
    {
      subject: "computer",
      title: "Cyber Safety",
      difficulty: "medium",
      category: "security",
      description: "Staying safe online",
    },
    {
      subject: "computer",
      title: "Data & Storage",
      difficulty: "hard",
      category: "storage",
      description: "How data is stored and managed",
    },
  ]);

  /* ---------------- MATH PROBLEMS ---------------- */
  await Problem.insertMany([
    // Addition & Subtraction
    {
      subject: "math",
      topic_id: topics[0]._id,
      question: "What is 15 + 23?",
      answer: "38",
      difficulty: "easy",
      explanation: "Add ones then tens",
    },
    {
      subject: "math",
      topic_id: topics[0]._id,
      question: "What is 50 - 17?",
      answer: "33",
      difficulty: "easy",
      explanation: "Subtract step by step",
    },
    {
      subject: "math",
      topic_id: topics[0]._id,
      question: "What is 120 + 45?",
      answer: "165",
      difficulty: "easy",
      explanation: "Add hundreds and tens",
    },
    {
      subject: "math",
      topic_id: topics[0]._id,
      question: "What is 200 - 89?",
      answer: "111",
      difficulty: "easy",
      explanation: "Borrow and subtract",
    },

    // Multiplication
    {
      subject: "math",
      topic_id: topics[1]._id,
      question: "What is 7 × 8?",
      answer: "56",
      difficulty: "easy",
      explanation: "7 times 8",
    },
    {
      subject: "math",
      topic_id: topics[1]._id,
      question: "What is 12 × 6?",
      answer: "72",
      difficulty: "easy",
      explanation: "Multiply 12 by 6",
    },
    {
      subject: "math",
      topic_id: topics[1]._id,
      question: "What is 9 × 9?",
      answer: "81",
      difficulty: "easy",
      explanation: "Square of 9",
    },
    {
      subject: "math",
      topic_id: topics[1]._id,
      question: "What is 15 × 4?",
      answer: "60",
      difficulty: "easy",
      explanation: "Multiply tens",
    },

    // Division
    {
      subject: "math",
      topic_id: topics[2]._id,
      question: "What is 24 ÷ 6?",
      answer: "4",
      difficulty: "medium",
      explanation: "Division by grouping",
    },
    {
      subject: "math",
      topic_id: topics[2]._id,
      question: "What is 81 ÷ 9?",
      answer: "9",
      difficulty: "medium",
      explanation: "Division facts",
    },

    // Fractions
    {
      subject: "math",
      topic_id: topics[3]._id,
      question: "What is 1/2 + 1/4?",
      answer: "3/4",
      difficulty: "medium",
      explanation: "Common denominator",
    },
    {
      subject: "math",
      topic_id: topics[3]._id,
      question: "What is 3/4 - 1/4?",
      answer: "1/2",
      difficulty: "medium",
      explanation: "Subtract fractions",
    },
  ]);

  /* ---------------- SCIENCE PROBLEMS ---------------- */
  await Problem.insertMany([
    // Living & Non-Living Things
    {
      subject: "science",
      topic_id: scienceTopics[0]._id,
      question: "Which of these is a living thing: rock, tree, chair?",
      answer: "Tree",
      difficulty: "easy",
      explanation: "Living things grow and reproduce",
    },
    {
      subject: "science",
      topic_id: scienceTopics[0]._id,
      question: "Do living things need food to survive?",
      answer: "Yes",
      difficulty: "easy",
      explanation: "Food provides energy",
    },

    // Plants & Animals
    {
      subject: "science",
      topic_id: scienceTopics[1]._id,
      question: "Which part of a plant makes food?",
      answer: "Leaves",
      difficulty: "easy",
      explanation: "Leaves perform photosynthesis",
    },
    {
      subject: "science",
      topic_id: scienceTopics[1]._id,
      question: "Which animal is a herbivore: lion or cow?",
      answer: "Cow",
      difficulty: "easy",
      explanation: "Herbivores eat plants",
    },

    // Human Body
    {
      subject: "science",
      topic_id: scienceTopics[2]._id,
      question: "Which organ pumps blood in the human body?",
      answer: "Heart",
      difficulty: "medium",
      explanation: "The heart pumps blood",
    },
    {
      subject: "science",
      topic_id: scienceTopics[2]._id,
      question: "Which organ helps us breathe?",
      answer: "Lungs",
      difficulty: "medium",
      explanation: "Lungs help in respiration",
    },

    // Matter & Materials
    {
      subject: "science",
      topic_id: scienceTopics[3]._id,
      question: "Which state of matter has a fixed shape?",
      answer: "Solid",
      difficulty: "easy",
      explanation: "Solids keep their shape",
    },
    {
      subject: "science",
      topic_id: scienceTopics[3]._id,
      question: "Water changes into which state when heated?",
      answer: "Gas",
      difficulty: "easy",
      explanation: "Heating causes evaporation",
    },

    // Force & Motion
    {
      subject: "science",
      topic_id: scienceTopics[4]._id,
      question: "What force pulls objects toward the Earth?",
      answer: "Gravity",
      difficulty: "medium",
      explanation: "Gravity attracts objects",
    },
    {
      subject: "science",
      topic_id: scienceTopics[4]._id,
      question: "What happens when you push a stationary object?",
      answer: "It moves",
      difficulty: "medium",
      explanation: "Force can change motion",
    },

    // Energy & Electricity
    {
      subject: "science",
      topic_id: scienceTopics[5]._id,
      question: "Which form of energy gives us light?",
      answer: "Electrical energy",
      difficulty: "medium",
      explanation: "Electricity produces light",
    },
    {
      subject: "science",
      topic_id: scienceTopics[5]._id,
      question: "Which device is used to turn electricity on and off?",
      answer: "Switch",
      difficulty: "medium",
      explanation: "Switch controls current",
    },

    // Earth & Space
    {
      subject: "science",
      topic_id: scienceTopics[6]._id,
      question: "Which planet do we live on?",
      answer: "Earth",
      difficulty: "easy",
      explanation: "Earth supports life",
    },
    {
      subject: "science",
      topic_id: scienceTopics[6]._id,
      question: "What do we call the natural satellite of Earth?",
      answer: "Moon",
      difficulty: "easy",
      explanation: "Moon orbits Earth",
    },

    // Environment & Pollution
    {
      subject: "science",
      topic_id: scienceTopics[7]._id,
      question: "What causes air pollution?",
      answer: "Smoke from vehicles and factories",
      difficulty: "hard",
      explanation: "Burning fuels releases pollutants",
    },
    {
      subject: "science",
      topic_id: scienceTopics[7]._id,
      question: "Name one way to protect the environment.",
      answer: "Plant trees",
      difficulty: "hard",
      explanation: "Trees clean air",
    },
  ]);

  /* ---------------- COMPUTER PROBLEMS ---------------- */
  await Problem.insertMany([
    // Computer Basics
    {
      subject: "computer",
      topic_id: computerTopics[0]._id,
      question: "What is a computer?",
      answer: "An electronic machine that processes data",
      difficulty: "easy",
      explanation: "Computers take input, process it, and give output",
    },
    {
      subject: "computer",
      topic_id: computerTopics[0]._id,
      question: "Name one use of a computer.",
      answer: "Typing documents",
      difficulty: "easy",
      explanation: "Computers help in many tasks",
    },

    // Parts of a Computer
    {
      subject: "computer",
      topic_id: computerTopics[1]._id,
      question: "Which part of a computer is called the brain?",
      answer: "CPU",
      difficulty: "easy",
      explanation: "CPU controls all operations",
    },
    {
      subject: "computer",
      topic_id: computerTopics[1]._id,
      question: "Which device is used to display output?",
      answer: "Monitor",
      difficulty: "easy",
      explanation: "Monitor shows results",
    },

    // Operating System
    {
      subject: "computer",
      topic_id: computerTopics[2]._id,
      question: "Name one operating system.",
      answer: "Windows",
      difficulty: "medium",
      explanation: "OS manages hardware and software",
    },
    {
      subject: "computer",
      topic_id: computerTopics[2]._id,
      question: "What is the function of an operating system?",
      answer: "Controls computer operations",
      difficulty: "medium",
      explanation: "OS manages resources",
    },

    // Input & Output Devices
    {
      subject: "computer",
      topic_id: computerTopics[3]._id,
      question: "Which device is used to input text?",
      answer: "Keyboard",
      difficulty: "easy",
      explanation: "Keyboard inputs characters",
    },
    {
      subject: "computer",
      topic_id: computerTopics[3]._id,
      question: "Which device gives sound output?",
      answer: "Speaker",
      difficulty: "easy",
      explanation: "Speakers produce sound",
    },

    // Introduction to Programming
    {
      subject: "computer",
      topic_id: computerTopics[4]._id,
      question: "What is a program?",
      answer: "A set of instructions",
      difficulty: "medium",
      explanation: "Programs tell computers what to do",
    },
    {
      subject: "computer",
      topic_id: computerTopics[4]._id,
      question: "Which language is used for web development?",
      answer: "JavaScript",
      difficulty: "medium",
      explanation: "JavaScript runs in browsers",
    },

    // Internet Basics
    {
      subject: "computer",
      topic_id: computerTopics[5]._id,
      question: "What is the Internet?",
      answer: "A global network of computers",
      difficulty: "easy",
      explanation: "Internet connects computers worldwide",
    },
    {
      subject: "computer",
      topic_id: computerTopics[5]._id,
      question: "Which service is used to send messages online?",
      answer: "Email",
      difficulty: "easy",
      explanation: "Email sends digital messages",
    },

    // Cyber Safety
    {
      subject: "computer",
      topic_id: computerTopics[6]._id,
      question: "Should you share your password with others?",
      answer: "No",
      difficulty: "medium",
      explanation: "Passwords must be private",
    },
    {
      subject: "computer",
      topic_id: computerTopics[6]._id,
      question: "What should you do if a website looks unsafe?",
      answer: "Avoid it",
      difficulty: "medium",
      explanation: "Unsafe sites can harm data",
    },

    // Data & Storage
    {
      subject: "computer",
      topic_id: computerTopics[7]._id,
      question: "Which device is used to store data permanently?",
      answer: "Hard disk",
      difficulty: "hard",
      explanation: "Hard disk stores data",
    },
    {
      subject: "computer",
      topic_id: computerTopics[7]._id,
      question: "What unit is used to measure storage?",
      answer: "Gigabyte",
      difficulty: "hard",
      explanation: "Storage is measured in bytes",
    },
  ]);

  /* ---------------- EXPERIMENTS ---------------- */
  await Experiment.insertMany([
    {
      title: "Color Changing Cabbage",
      subject: "chemistry",
      difficulty: "easy",
      description: "Test acids and bases using red cabbage juice",
      materials: ["Red cabbage", "Water", "Vinegar", "Baking soda"],
      steps: ["Boil cabbage", "Collect juice", "Add liquids"],
      safety_notes: ["Adult supervision"],
      learning_objectives: ["Understand pH"],
    },
    {
      title: "Volcano Reaction",
      subject: "chemistry",
      difficulty: "easy",
      description: "Baking soda and vinegar eruption",
      materials: ["Baking soda", "Vinegar", "Bottle"],
      steps: ["Add soda", "Pour vinegar"],
      safety_notes: ["Do outdoors"],
      learning_objectives: ["Chemical reactions"],
    },
    {
      title: "Paper Airplanes",
      subject: "physics",
      difficulty: "easy",
      description: "Test aerodynamics",
      materials: ["Paper"],
      steps: ["Fold plane", "Throw"],
      safety_notes: ["Clear area"],
      learning_objectives: ["Lift"],
    },
  ]);

  /* ---------------- EXPERIMENTS ---------------- */
  await Experiment.insertMany([
    /* ---------- PHYSICS ---------- */
    {
      title: "Balloon Rocket",
      subject: "physics",
      difficulty: "easy",
      description: "Demonstrate Newton’s third law of motion",
      materials: ["Balloon", "String", "Straw", "Tape"],
      steps: ["Thread string", "Attach balloon", "Release balloon"],
      safety_notes: ["Do not aim at face"],
      learning_objectives: ["Action and reaction"],
    },
    {
      title: "Pendulum Motion",
      subject: "physics",
      difficulty: "medium",
      description: "Study oscillatory motion using a pendulum",
      materials: ["String", "Weight", "Stopwatch"],
      steps: ["Tie weight", "Swing pendulum", "Measure time"],
      safety_notes: ["Secure knot properly"],
      learning_objectives: ["Periodic motion"],
    },
    {
      title: "Magnet and Iron Filings",
      subject: "physics",
      difficulty: "easy",
      description: "Visualize magnetic field lines",
      materials: ["Magnet", "Iron filings", "Paper"],
      steps: ["Place magnet", "Sprinkle filings", "Observe pattern"],
      safety_notes: ["Avoid inhaling filings"],
      learning_objectives: ["Magnetic fields"],
    },

    /* ---------- COMPUTER ---------- */
    {
      title: "Binary Counting",
      subject: "computer",
      difficulty: "easy",
      description: "Learn how computers count using binary numbers",
      materials: ["Paper", "Pen"],
      steps: ["Write binary numbers", "Convert to decimal"],
      safety_notes: [],
      learning_objectives: ["Binary system"],
    },
    {
      title: "Algorithm Writing",
      subject: "computer",
      difficulty: "medium",
      description: "Create step-by-step instructions for a task",
      materials: ["Notebook", "Pen"],
      steps: ["Choose task", "Write steps", "Review logic"],
      safety_notes: [],
      learning_objectives: ["Logical thinking"],
    },
    {
      title: "Flowchart Design",
      subject: "computer",
      difficulty: "medium",
      description: "Represent program logic using flowcharts",
      materials: ["Paper", "Pencil"],
      steps: ["Identify steps", "Draw symbols", "Connect flow"],
      safety_notes: [],
      learning_objectives: ["Program structure"],
    },

    /* ---------- MATH ---------- */
    {
      title: "Measuring Perimeter",
      subject: "math",
      difficulty: "easy",
      description: "Calculate perimeter using real objects",
      materials: ["Ruler", "Notebook"],
      steps: ["Measure sides", "Add lengths"],
      safety_notes: [],
      learning_objectives: ["Perimeter calculation"],
    },
    {
      title: "Probability with Coins",
      subject: "math",
      difficulty: "medium",
      description: "Understand probability using coin tosses",
      materials: ["Coin", "Notebook"],
      steps: ["Toss coin", "Record outcomes", "Calculate probability"],
      safety_notes: [],
      learning_objectives: ["Basic probability"],
    },
    {
      title: "Graphing Data",
      subject: "math",
      difficulty: "medium",
      description: "Plot data on a graph",
      materials: ["Graph paper", "Pencil"],
      steps: ["Collect data", "Plot points", "Analyze graph"],
      safety_notes: [],
      learning_objectives: ["Data representation"],
    },

    /* ---------- CHEMISTRY ---------- */
    {
      title: "Lava Lamp Reaction",
      subject: "chemistry",
      difficulty: "easy",
      description: "Observe density differences using oil and water",
      materials: ["Oil", "Water", "Food coloring", "Bottle"],
      steps: ["Pour water", "Add oil", "Add coloring"],
      safety_notes: ["Do not ingest"],
      learning_objectives: ["Density"],
    },
    {
      title: "Rusting of Iron",
      subject: "chemistry",
      difficulty: "medium",
      description: "Study oxidation and rust formation",
      materials: ["Iron nails", "Water", "Jar"],
      steps: ["Place nails", "Add water", "Observe over days"],
      safety_notes: ["Wash hands after"],
      learning_objectives: ["Oxidation"],
    },
    {
      title: "Paper Chromatography",
      subject: "chemistry",
      difficulty: "medium",
      description: "Separate colors using chromatography",
      materials: ["Filter paper", "Ink pen", "Water"],
      steps: ["Draw line", "Dip paper", "Observe separation"],
      safety_notes: ["Use non-toxic ink"],
      learning_objectives: ["Mixture separation"],
    },
  ]);

  res.json({ message: "Unified sample data initialized successfully 🚀" });
};

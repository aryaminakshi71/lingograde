// Mock data for the EdTech platform

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  longestStreak: number
  coursesCompleted: number
  lessonsCompleted: number
  totalLearningMinutes: number
  joinedDate: string
  badges: Badge[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedDate: string
}

export interface Language {
  id: string
  name: string
  flag: string
  progress: number
  lessonsCompleted: number
  totalLessons: number
  currentUnit: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  thumbnail: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  lessonsCount: number
  studentsCount: number
  rating: number
  reviewsCount: number
  price: number
  isFree: boolean
  tags: string[]
  progress?: number
}

export interface Tutor {
  id: string
  name: string
  avatar: string
  specialty: string[]
  languages: string[]
  rating: number
  reviewsCount: number
  hourlyRate: number
  currency: string
  availability: string[]
  bio: string
  lessonsCompleted: number
  responseTime: string
}

export interface Lesson {
  id: string
  title: string
  type: "vocabulary" | "grammar" | "listening" | "speaking" | "reading"
  duration: number
  xpReward: number
  isCompleted: boolean
  isLocked: boolean
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  questionsCount: number
  timeLimit: number
  xpReward: number
  questions: QuizQuestion[]
}

// Mock User
export const currentUser: User = {
  id: "1",
  name: "Alex Chen",
  email: "alex@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  level: 12,
  xp: 2450,
  xpToNextLevel: 3000,
  streak: 7,
  longestStreak: 14,
  coursesCompleted: 4,
  lessonsCompleted: 89,
  totalLearningMinutes: 1847,
  joinedDate: "2025-06-15",
  badges: [
    { id: "1", name: "First Steps", description: "Complete your first lesson", icon: "star", earnedDate: "2025-06-15" },
    { id: "2", name: "Week Warrior", description: "Maintain a 7-day streak", icon: "flame", earnedDate: "2025-06-22" },
    { id: "3", name: "Quick Learner", description: "Complete 50 lessons", icon: "zap", earnedDate: "2025-08-10" },
    { id: "4", name: "Polyglot", description: "Study 3 different languages", icon: "globe", earnedDate: "2025-09-01" },
  ]
}

// Mock Languages
export const languages: Language[] = [
  { id: "1", name: "Spanish", flag: "ES", progress: 68, lessonsCompleted: 34, totalLessons: 50, currentUnit: "Unit 7: Travel & Directions" },
  { id: "2", name: "French", flag: "FR", progress: 42, lessonsCompleted: 21, totalLessons: 50, currentUnit: "Unit 5: Food & Dining" },
  { id: "3", name: "Japanese", flag: "JP", progress: 15, lessonsCompleted: 8, totalLessons: 55, currentUnit: "Unit 2: Basic Greetings" },
  { id: "4", name: "German", flag: "DE", progress: 0, lessonsCompleted: 0, totalLessons: 50, currentUnit: "Unit 1: Introduction" },
]

// Mock Courses
export const courses: Course[] = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer.",
    instructor: "Sarah Johnson",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
    category: "Development",
    level: "Beginner",
    duration: "52 hours",
    lessonsCount: 156,
    studentsCount: 45280,
    rating: 4.8,
    reviewsCount: 12450,
    price: 89.99,
    isFree: false,
    tags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    progress: 35
  },
  {
    id: "2",
    title: "UI/UX Design Fundamentals",
    description: "Master the principles of user interface and user experience design. Learn Figma, prototyping, and design thinking.",
    instructor: "Michael Park",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
    category: "Design",
    level: "Beginner",
    duration: "28 hours",
    lessonsCount: 84,
    studentsCount: 23150,
    rating: 4.9,
    reviewsCount: 5820,
    price: 0,
    isFree: true,
    tags: ["Figma", "UI Design", "UX Design", "Prototyping"],
    progress: 72
  },
  {
    id: "3",
    title: "Data Science with Python",
    description: "Learn data analysis, visualization, machine learning, and AI using Python, Pandas, NumPy, and TensorFlow.",
    instructor: "Dr. Emily Zhang",
    instructorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    category: "Data Science",
    level: "Intermediate",
    duration: "64 hours",
    lessonsCount: 192,
    studentsCount: 31450,
    rating: 4.7,
    reviewsCount: 8920,
    price: 129.99,
    isFree: false,
    tags: ["Python", "Machine Learning", "Data Analysis", "TensorFlow"]
  },
  {
    id: "4",
    title: "Digital Marketing Masterclass",
    description: "Learn SEO, social media marketing, content marketing, and paid advertising to grow any business online.",
    instructor: "James Wilson",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    category: "Marketing",
    level: "Beginner",
    duration: "36 hours",
    lessonsCount: 108,
    studentsCount: 18920,
    rating: 4.6,
    reviewsCount: 4210,
    price: 69.99,
    isFree: false,
    tags: ["SEO", "Social Media", "Content Marketing", "Analytics"]
  },
  {
    id: "5",
    title: "Advanced React Patterns",
    description: "Deep dive into advanced React concepts including hooks, context, performance optimization, and testing.",
    instructor: "Sarah Johnson",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    category: "Development",
    level: "Advanced",
    duration: "24 hours",
    lessonsCount: 72,
    studentsCount: 8450,
    rating: 4.9,
    reviewsCount: 2180,
    price: 79.99,
    isFree: false,
    tags: ["React", "TypeScript", "Testing", "Performance"]
  },
  {
    id: "6",
    title: "Introduction to Cybersecurity",
    description: "Learn the fundamentals of cybersecurity, ethical hacking, network security, and how to protect systems.",
    instructor: "Robert Chen",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop",
    category: "IT & Security",
    level: "Beginner",
    duration: "40 hours",
    lessonsCount: 120,
    studentsCount: 14280,
    rating: 4.7,
    reviewsCount: 3560,
    price: 0,
    isFree: true,
    tags: ["Security", "Ethical Hacking", "Network Security"]
  }
]

// Mock Tutors
export const tutors: Tutor[] = [
  {
    id: "1",
    name: "Maria Garcia",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    specialty: ["Spanish", "Portuguese"],
    languages: ["Spanish", "English", "Portuguese"],
    rating: 4.9,
    reviewsCount: 342,
    hourlyRate: 25,
    currency: "USD",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    bio: "Native Spanish speaker with 8 years of teaching experience. Specialized in conversational Spanish and business communication.",
    lessonsCompleted: 1847,
    responseTime: "< 1 hour"
  },
  {
    id: "2",
    name: "Kenji Tanaka",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    specialty: ["Japanese", "JLPT Prep"],
    languages: ["Japanese", "English"],
    rating: 4.8,
    reviewsCount: 256,
    hourlyRate: 35,
    currency: "USD",
    availability: ["Mon", "Wed", "Fri", "Sat"],
    bio: "Certified Japanese language instructor with expertise in JLPT preparation. Patient and encouraging teaching style.",
    lessonsCompleted: 1245,
    responseTime: "< 2 hours"
  },
  {
    id: "3",
    name: "Sophie Martin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    specialty: ["French", "French Culture"],
    languages: ["French", "English", "German"],
    rating: 5.0,
    reviewsCount: 189,
    hourlyRate: 30,
    currency: "USD",
    availability: ["Tue", "Thu", "Sat", "Sun"],
    bio: "Parisian native teaching authentic French with cultural insights. Specializing in accent improvement and fluency building.",
    lessonsCompleted: 982,
    responseTime: "< 30 mins"
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    specialty: ["Python", "Web Development", "Data Science"],
    languages: ["English", "Korean"],
    rating: 4.9,
    reviewsCount: 428,
    hourlyRate: 45,
    currency: "USD",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Senior software engineer with 10+ years of experience. Passionate about teaching coding to beginners and advanced learners.",
    lessonsCompleted: 2156,
    responseTime: "< 1 hour"
  },
  {
    id: "5",
    name: "Anna Muller",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    specialty: ["German", "Business German"],
    languages: ["German", "English", "Dutch"],
    rating: 4.7,
    reviewsCount: 167,
    hourlyRate: 28,
    currency: "USD",
    availability: ["Mon", "Wed", "Fri"],
    bio: "Business German specialist helping professionals communicate effectively in German-speaking markets.",
    lessonsCompleted: 756,
    responseTime: "< 3 hours"
  },
  {
    id: "6",
    name: "Lisa Thompson",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    specialty: ["UI/UX Design", "Figma", "Product Design"],
    languages: ["English"],
    rating: 4.8,
    reviewsCount: 298,
    hourlyRate: 50,
    currency: "USD",
    availability: ["Tue", "Thu", "Sat"],
    bio: "Product designer at a Fortune 500 company. Teaching practical design skills and portfolio development.",
    lessonsCompleted: 1423,
    responseTime: "< 2 hours"
  }
]

// Mock Lessons for Language Learning
export const spanishLessons: Lesson[] = [
  { id: "1", title: "Basic Greetings", type: "vocabulary", duration: 5, xpReward: 10, isCompleted: true, isLocked: false },
  { id: "2", title: "Numbers 1-20", type: "vocabulary", duration: 8, xpReward: 15, isCompleted: true, isLocked: false },
  { id: "3", title: "Present Tense Basics", type: "grammar", duration: 12, xpReward: 20, isCompleted: true, isLocked: false },
  { id: "4", title: "Listening: Introductions", type: "listening", duration: 10, xpReward: 15, isCompleted: false, isLocked: false },
  { id: "5", title: "Speaking Practice", type: "speaking", duration: 15, xpReward: 25, isCompleted: false, isLocked: false },
  { id: "6", title: "Reading: Short Story", type: "reading", duration: 20, xpReward: 30, isCompleted: false, isLocked: true },
]

// Mock Quizzes
export const quizzes: Quiz[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics including variables, functions, and loops.",
    category: "Development",
    difficulty: "Easy",
    questionsCount: 10,
    timeLimit: 10,
    xpReward: 50,
    questions: [
      {
        id: "q1",
        question: "Which keyword is used to declare a constant in JavaScript?",
        options: ["var", "let", "const", "constant"],
        correctAnswer: 2,
        explanation: "The 'const' keyword is used to declare constants in JavaScript that cannot be reassigned."
      },
      {
        id: "q2",
        question: "What will console.log(typeof []) output?",
        options: ["array", "object", "undefined", "list"],
        correctAnswer: 1,
        explanation: "In JavaScript, arrays are technically objects, so typeof [] returns 'object'."
      },
      {
        id: "q3",
        question: "Which method adds an element to the end of an array?",
        options: ["unshift()", "push()", "pop()", "shift()"],
        correctAnswer: 1,
        explanation: "The push() method adds one or more elements to the end of an array."
      },
      {
        id: "q4",
        question: "What does '===' compare in JavaScript?",
        options: ["Only value", "Only type", "Value and type", "Reference"],
        correctAnswer: 2,
        explanation: "The strict equality operator (===) compares both value and type without type coercion."
      },
      {
        id: "q5",
        question: "Which is NOT a JavaScript data type?",
        options: ["undefined", "boolean", "float", "symbol"],
        correctAnswer: 2,
        explanation: "JavaScript has 'number' type for all numeric values, not a separate 'float' type."
      }
    ]
  },
  {
    id: "2",
    title: "Spanish Vocabulary Challenge",
    description: "Test your Spanish vocabulary with common words and phrases.",
    category: "Language",
    difficulty: "Medium",
    questionsCount: 10,
    timeLimit: 8,
    xpReward: 75,
    questions: [
      {
        id: "q1",
        question: "What does 'biblioteca' mean in English?",
        options: ["Bookstore", "Library", "School", "Office"],
        correctAnswer: 1,
        explanation: "'Biblioteca' means 'library' in Spanish."
      },
      {
        id: "q2",
        question: "How do you say 'Good morning' in Spanish?",
        options: ["Buenas noches", "Buenas tardes", "Buenos dias", "Hola"],
        correctAnswer: 2,
        explanation: "'Buenos dias' is the Spanish greeting for 'Good morning'."
      },
      {
        id: "q3",
        question: "What is 'mariposa' in English?",
        options: ["Bird", "Bee", "Butterfly", "Flower"],
        correctAnswer: 2,
        explanation: "'Mariposa' means 'butterfly' in Spanish."
      }
    ]
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description: "Challenge your understanding of core design principles and best practices.",
    category: "Design",
    difficulty: "Medium",
    questionsCount: 10,
    timeLimit: 12,
    xpReward: 60,
    questions: [
      {
        id: "q1",
        question: "What does the 'F-pattern' refer to in web design?",
        options: ["Font selection", "Eye tracking pattern", "Form layout", "Footer design"],
        correctAnswer: 1,
        explanation: "The F-pattern describes how users typically scan web content in an F-shaped pattern."
      },
      {
        id: "q2",
        question: "What is the primary purpose of white space in design?",
        options: ["Fill empty areas", "Improve readability", "Reduce page size", "Add decoration"],
        correctAnswer: 1,
        explanation: "White space improves readability and helps users focus on important content."
      }
    ]
  },
  {
    id: "4",
    title: "Data Science Basics",
    description: "Test your knowledge of fundamental data science concepts.",
    category: "Data Science",
    difficulty: "Hard",
    questionsCount: 15,
    timeLimit: 20,
    xpReward: 100,
    questions: [
      {
        id: "q1",
        question: "Which of these is a supervised learning algorithm?",
        options: ["K-means clustering", "Linear regression", "PCA", "Apriori"],
        correctAnswer: 1,
        explanation: "Linear regression is a supervised learning algorithm used for predicting continuous values."
      }
    ]
  }
]

// Categories for filtering
export const categories = ["All", "Development", "Design", "Data Science", "Marketing", "IT & Security", "Language"]
export const levels = ["All", "Beginner", "Intermediate", "Advanced"]

export const mockTravelers = [
  {
    id: "1",
    name: "Emma Johnson",
    age: 28,
    profileImage:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    purpose: "Token2049 Conference",
    dates: "Mar 15-20, 2024",
    interests: ["Web3", "DeFi", "Networking", "Tech", "Food", "Culture"],
    bio: "Software engineer and Web3 enthusiast attending Token2049. Love exploring local food scenes and meeting fellow developers. Building the future of decentralized finance.",
    location: "Dubai, UAE",
    verified: {
      lens: true,
      wallet: "0x1234...5678",
    },
    languages: ["English", "Spanish"],
    travelStyle: "solo",
    socialLinks: {
      lens: "@emma.web3",
      telegram: "@emma_web3",
      discord: "emma#1234",
    },
    sharedInterests: 4,
    dateOverlap: true,
    requestStatus: null, // 'pending', 'accepted', 'rejected'
    requestMessage: "",
  },
  {
    id: "2",
    name: "Alex Chen",
    age: 32,
    profileImage:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
    purpose: "Token2049 Conference",
    dates: "Mar 18-22, 2024",
    interests: ["Web3", "NFTs", "Gaming", "Business", "Networking", "Art"],
    bio: "Marketing director and NFT collector traveling for Token2049. Always up for good conversations about Web3 and city exploration. Building communities in the metaverse.",
    location: "Dubai, UAE",
    verified: {
      lens: true,
      wallet: "0x8765...4321",
    },
    languages: ["English", "Mandarin"],
    travelStyle: "co-living",
    socialLinks: {
      lens: "@alex.nft",
      telegram: "@alex_web3",
      discord: "alex#5678",
    },
    sharedInterests: 3,
    dateOverlap: true,
    requestStatus: null,
    requestMessage: "",
  },
  {
    id: "3",
    name: "Sofia Rodriguez",
    age: 26,
    profileImage:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400",
    purpose: "Backpacking through Europe",
    dates: "Apr 1-30, 2024",
    interests: ["Adventure", "Photography", "Music", "Culture", "Food"],
    bio: "Digital nomad and content creator on a month-long European adventure. Looking for travel buddies and local insights. Sharing stories from the road.",
    location: "Europe",
    verified: {
      lens: false,
      wallet: "",
    },
    languages: ["English", "Spanish", "French"],
    travelStyle: "solo",
    socialLinks: {
      lens: null,
      telegram: "@sofia_travels",
      discord: null,
    },
    sharedInterests: 2,
    dateOverlap: false,
    requestStatus: null,
    requestMessage: "",
  },
  {
    id: "4",
    name: "Marcus Williams",
    age: 35,
    profileImage:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    purpose: "Token2049 Conference",
    dates: "Mar 25-30, 2024",
    interests: ["Web3", "Photography", "Beach", "Culture", "Networking"],
    bio: "Photographer and Web3 enthusiast attending Token2049. Excited to explore Dubai and connect with other creatives in the blockchain space.",
    location: "Dubai, UAE",
    verified: {
      lens: true,
      wallet: "0x9876...5432",
    },
    languages: ["English"],
    travelStyle: "solo",
    socialLinks: {
      lens: "@marcus.photo",
      telegram: "@marcus_web3",
      discord: "marcus#9012",
    },
    sharedInterests: 3,
    dateOverlap: true,
    requestStatus: null,
    requestMessage: "",
  },
  {
    id: "5",
    name: "Sarah Kim",
    age: 29,
    profileImage:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    purpose: "Token2049 Conference",
    dates: "Mar 15-20, 2024",
    interests: ["Web3", "DeFi", "Tech", "Networking", "Food"],
    bio: "Product manager in the Web3 space. Attending Token2049 to network and learn about the latest DeFi innovations. Love trying new restaurants!",
    location: "Dubai, UAE",
    verified: {
      lens: true,
      wallet: "0x5555...6666",
    },
    languages: ["English", "Korean"],
    travelStyle: "co-living",
    socialLinks: {
      lens: "@sarah.defi",
      telegram: "@sarah_web3",
      discord: "sarah#3456",
    },
    sharedInterests: 4,
    dateOverlap: true,
    requestStatus: "pending",
    requestMessage: "Hey! I'm also attending Token2049 – want to connect?",
  },
  {
    id: "6",
    name: "David Wilson",
    age: 31,
    profileImage:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    purpose: "Business Trip",
    dates: "Mar 18-25, 2024",
    interests: ["Business", "Networking", "Tech", "Sports"],
    bio: "Business consultant traveling for client meetings. Always up for networking and exploring new cities. Big sports fan!",
    location: "Dubai, UAE",
    verified: {
      lens: false,
      wallet: "",
    },
    languages: ["English", "German"],
    travelStyle: "solo",
    socialLinks: {
      lens: null,
      telegram: "@david_business",
      discord: null,
    },
    sharedInterests: 1,
    dateOverlap: true,
    requestStatus: null,
    requestMessage: "",
  },
];

export const mockTrips = [
  {
    id: "1",
    destination: "Tokyo, Japan",
    dates: "Mar 15-20, 2024",
    purpose: "Conference",
    image:
      "https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "upcoming",
  },
  {
    id: "2",
    destination: "Paris, France",
    dates: "Feb 10-15, 2024",
    purpose: "Leisure",
    image:
      "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "completed",
  },
];

export const mockRequests = [
  {
    id: "1",
    name: "Sarah Kim",
    profileImage:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    message: "Would love to connect for the Tokyo conference!",
    time: "2h ago",
  },
  {
    id: "2",
    name: "David Wilson",
    profileImage:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    message: "Hey! I'll be in Tokyo the same dates. Want to explore together?",
    time: "4h ago",
  },
];

export const mockFeed = [
  {
    id: "1",
    title: "Top 10 Food Spots in Tokyo",
    author: "Emma Johnson",
    authorImage:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    excerpt:
      "Just discovered these amazing local spots during my Tokyo trip...",
    time: "6h ago",
    likes: 24,
  },
  {
    id: "2",
    title: "Networking Events in Singapore",
    author: "Alex Chen",
    authorImage:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
    image:
      "https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg?auto=compress&cs=tinysrgb&w=400",
    excerpt: "Great business networking opportunities coming up this month...",
    time: "1d ago",
    likes: 18,
  },
];

export const mockChats = [
  {
    id: "1",
    name: "Emma Johnson",
    profileImage:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    lastMessage: "Looking forward to meeting in Tokyo!",
    time: "10:30 AM",
    unread: 2,
  },
  {
    id: "2",
    name: "Alex Chen",
    profileImage:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
    lastMessage: "That restaurant recommendation was perfect 👌",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "3",
    name: "Sofia Rodriguez",
    profileImage:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400",
    lastMessage: "Have you been to Barcelona?",
    time: "Monday",
    unread: 1,
  },
];

export const mockMessages = [
  {
    _id: "1",
    text: "Hey! I saw you're going to Tokyo too. Would love to connect!",
    createdAt: new Date("2024-03-10T10:00:00"),
    user: {
      _id: "2",
      name: "Emma Johnson",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    type: "text" as const,
    isRead: true,
    isEncrypted: true,
  },
  {
    _id: "2",
    text: "That sounds great! I'll be there for the conference. Are you attending too?",
    createdAt: new Date("2024-03-10T10:05:00"),
    user: {
      _id: "1",
      name: "You",
    },
    type: "text" as const,
    isRead: true,
    isEncrypted: true,
  },
  {
    _id: "3",
    text: "Yes! I'm really excited. Do you know any good places to eat around the conference center?",
    createdAt: new Date("2024-03-10T10:10:00"),
    user: {
      _id: "2",
      name: "Emma Johnson",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    type: "text" as const,
    isRead: true,
    isEncrypted: true,
  },
  {
    _id: "4",
    text: "I have a few recommendations! There's this amazing ramen place just 5 minutes walk from the venue.",
    createdAt: new Date("2024-03-10T10:15:00"),
    user: {
      _id: "1",
      name: "You",
    },
    type: "text" as const,
    isRead: false,
    isEncrypted: true,
  },
];

export const mockProfile = {
  id: "1",
  name: "John Doe",
  age: 30,
  email: "john.doe@example.com",
  profileImage:
    "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
  bio: "Digital nomad and travel enthusiast. Love connecting with fellow travelers and exploring new cultures.",
  location: "New York, USA",
  socialLinks: {
    twitter: "@johndoe",
    instagram: "@john.travels",
  },
  joinDate: "January 2023",
  completedTrips: 12,
  upcomingTrips: 2,
  rating: 4.8,
  reviews: [
    {
      id: "1",
      author: "Emma Johnson",
      authorImage:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      text: "John was an amazing travel buddy! Super organized and fun to hang out with.",
      date: "Feb 2024",
    },
    {
      id: "2",
      author: "Alex Chen",
      authorImage:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      text: "Great networking companion. Really helped make business connections in Singapore.",
      date: "Jan 2024",
    },
  ],
};

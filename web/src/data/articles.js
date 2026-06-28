export const ARTICLES = [
  {
    id: 1,
    date: 'June 12, 2025',
    title: 'Top 5 Tips for First-Time Car Renters',
    excerpt: 'Renting a car for the first time? Learn what to check before signing, how to avoid hidden fees, and the best way to inspect your vehicle.',
    image: '/articles/first-time.jpg',
    tags: ['Car Rental', 'Tips', 'Beginner'],
    author: {
      name: 'Priya Sharma',
      bio: 'Priya is a travel writer and road trip enthusiast with over 10 years of experience renting cars across India and Southeast Asia. She believes every journey starts with the right set of wheels.',
      avatar: '/authors/priya.jpg',
    },
    content: [
      {
        type: 'text',
        body: 'Renting a car for the first time can feel overwhelming. From understanding rental agreements to inspecting the vehicle, there\'s a lot to navigate. But with the right knowledge, you can avoid common pitfalls and enjoy a seamless driving experience.',
      },
      {
        type: 'text',
        body: 'Before you even sign the agreement, take time to read every clause carefully. Pay attention to mileage limits, fuel policies, and cancellation terms. Many first-time renters are surprised by hidden charges that could have been avoided with a simple read-through.',
      },
      {
        type: 'image',
        src: '/articles/first-time.jpg',
        caption: 'Always inspect the car carefully before accepting the keys.',
      },
      {
        type: 'text',
        body: 'One of the most important steps is the pre-rental inspection. Walk around the vehicle and document any existing scratches, dents, or damage with photos or video. Make sure these are noted on the rental agreement — this protects you from being charged for pre-existing damage when you return the car.',
      },
      {
        type: 'text',
        body: 'Understanding the fuel policy is also critical. Most rental companies offer either "full-to-full" (you return the car with a full tank) or "pre-purchase" (you pay for a tank upfront). The full-to-full option is usually cheaper if you plan to drive a decent distance.',
      },
      {
        type: 'quote',
        body: 'The best road trips start with the right car. Knowing what to look for before you drive off the lot can save you money and stress down the road.',
      },
      {
        type: 'text',
        body: 'Finally, consider whether you need additional insurance coverage. Check if your personal auto insurance or credit card already covers rental cars — you may be paying for duplicate coverage without realizing it. CDW (Collision Damage Waiver) is the most common add-on, but it\'s not always necessary.',
      },
      {
        type: 'text',
        body: 'By keeping these five tips in mind, you\'ll be well prepared for a smooth and enjoyable first-time rental experience. Happy driving!',
      },
    ],
    relatedIds: [2, 3],
  },
  {
    id: 2,
    date: 'June 10, 2025',
    title: 'How to Choose the Right Car for Your Road Trip',
    excerpt: 'From fuel efficiency to luggage space and comfort, we break down everything you need to consider when picking the perfect road trip companion.',
    image: '/articles/road-trip.jpg',
    tags: ['Road Trip', 'Car Rental', 'Travel'],
    author: {
      name: 'Arjun Mehta',
      bio: 'Arjun is an automotive journalist and avid road tripper who has driven across more than 20 states in India. He is passionate about helping people make the most of every driving adventure.',
      avatar: '/authors/arjun.jpg',
    },
    content: [
      {
        type: 'text',
        body: 'Choosing the right car for your road trip can make all the difference between an adventure and a headache. With so many options available, it pays to think through your specific needs before you book.',
      },
      {
        type: 'text',
        body: 'Start by considering the number of passengers and how much luggage you\'ll be carrying. A couple traveling light can be comfortable in a compact hatchback, while a family of five with camping gear will need an SUV or a spacious MPV.',
      },
      {
        type: 'image',
        src: '/articles/road-trip.jpg',
        caption: 'The right car makes every road trip memorable.',
      },
      {
        type: 'text',
        body: 'Fuel efficiency is another major factor, especially for long drives. Diesel vehicles typically offer better mileage on highways, while modern petrol and hybrid cars are great for mixed driving. If your route passes through cities with good EV infrastructure, an electric vehicle might even save you money.',
      },
      {
        type: 'quote',
        body: 'Comfort and reliability should never be compromised on a long road trip. The journey is as important as the destination.',
      },
      {
        type: 'text',
        body: 'Don\'t underestimate the importance of features like cruise control, lane-keeping assist, and a good infotainment system. Long stretches of highway driving are far more enjoyable with these modern conveniences, and adaptive cruise control can significantly reduce driver fatigue.',
      },
      {
        type: 'text',
        body: 'Finally, think about the terrain. Mountain roads, coastal highways, and city driving each have different demands. If you\'re heading into the hills, a car with good ground clearance and all-wheel drive is a smart choice. For city-heavy itineraries, a smaller, more maneuverable vehicle will be your best friend.',
      },
    ],
    relatedIds: [1, 3],
  },
  {
    id: 3,
    date: 'June 9, 2025',
    title: 'Car Rental Insurance: What You Actually Need',
    excerpt: 'Insurance can be confusing. We explain the difference between CDW, third-party liability, and your personal auto policy so you only pay for what matters.',
    image: '/articles/insurance.jpg',
    tags: ['Insurance', 'Car Rental', 'Tips'],
    author: {
      name: 'Sneha Kapoor',
      bio: 'Sneha is a financial writer specializing in travel insurance and personal finance. She has helped thousands of travelers avoid overpaying on coverage they never actually needed.',
      avatar: '/authors/sneha.jpg',
    },
    content: [
      {
        type: 'text',
        body: 'When you rent a car, the rental agent will almost always offer you additional insurance coverage. Understanding what you actually need — versus what you\'re being upsold — can save you a significant amount of money.',
      },
      {
        type: 'text',
        body: 'The most common type of rental coverage is the Collision Damage Waiver (CDW), sometimes called Loss Damage Waiver (LDW). This is a waiver that means the rental company agrees not to hold you financially responsible if the car is damaged or stolen.',
      },
      {
        type: 'image',
        src: '/articles/insurance.jpg',
        caption: 'Understanding your coverage options before you rent can save you hundreds.',
      },
      {
        type: 'text',
        body: 'Third-party liability coverage protects you if you cause damage to another person\'s property or injure someone in an accident. Most rental companies include a basic level of this coverage, but it\'s worth checking the limits before you decline any additional add-ons.',
      },
      {
        type: 'quote',
        body: 'Never pay for coverage you already have. Check your personal auto policy and credit card benefits before accepting any rental insurance add-ons.',
      },
      {
        type: 'text',
        body: 'Many premium credit cards offer complimentary CDW coverage when you pay for the rental with that card. Check with your card issuer before your trip to confirm the exact terms — this alone could save you ₹500–1,500 per day on a rental.',
      },
      {
        type: 'text',
        body: 'Your personal auto insurance policy may also extend coverage to rental vehicles. Call your insurer and ask specifically about rental car coverage — most comprehensive and collision policies do transfer. This way, you can confidently decline the CDW at the counter and keep that money for the road.',
      },
    ],
    relatedIds: [1, 2],
  },
]

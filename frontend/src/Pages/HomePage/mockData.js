export const mockArticles = [
    {
      id: 1,
      title: "How I'd learn ML in 2025 (if I could start over)",
      subtitle: "All you need to learn ML in 2025 is a laptop and a list of the steps you must take.",
      author: "Boris Meinardus",
      publication: "Towards AI",
      date: "Jan 2",
      readingTime: "5 min read",
      likes: "1.7K",
      likesCount: 1700,
      comments: 47,
      commentsList: [
        {
          id: 1,
          author: "Sarah Chen",
          text: "This is exactly what I needed! Just starting my ML journey.",
          date: "Jan 3"
        },
        {
          id: 2,
          author: "Mike Johnson",
          text: "Great breakdown of the learning path. I'd add that practicing with real datasets is crucial.",
          date: "Jan 4"
        }
      ],
      image: "https://placeholder.com/300x200",
      verified: false,
      content: `
  <h2>Getting Started with Machine Learning in 2025</h2>
  <p>The landscape of machine learning has changed dramatically over the past few years. What once required a PhD and years of specialized knowledge is now accessible to anyone with determination and the right learning path.</p>
  
  <h3>The Foundation: Mathematics You Actually Need</h3>
  <p>Let's be honest about the math requirements. You don't need to be a mathematician to get started. Here's what you actually need:</p>
  <ul>
    <li><strong>Linear Algebra:</strong> Understanding vectors, matrices, and operations on them</li>
    <li><strong>Calculus:</strong> Derivatives, gradients, and chain rule</li>
    <li><strong>Probability:</strong> Basic probability distributions and statistical concepts</li>
  </ul>
  <p>The key insight is to learn these topics in context - as you need them for specific ML concepts, not as abstract mathematical theories.</p>
  
  <h3>Programming: Python is Still King</h3>
  <p>Despite new languages and frameworks emerging, Python remains the primary language for ML development. Focus on:</p>
  <ul>
    <li>Numpy for numerical operations</li>
    <li>Pandas for data manipulation</li>
    <li>Scikit-learn for classical ML algorithms</li>
    <li>PyTorch or TensorFlow for deep learning</li>
  </ul>
  
  <h3>The Learning Path</h3>
  <p>Here's my recommended learning path for 2025:</p>
  <h4>1. Foundations (2-3 months)</h4>
  <p>Start with Andrew Ng's courses or Fast.ai to get a conceptual understanding without being overwhelmed by theory.</p>
  <h4>2. Practical Projects (3-4 months)</h4>
  <p>Build simple projects that apply what you've learned. Kaggle competitions are perfect for this stage.</p>
  <h4>3. Specialization (6+ months)</h4>
  <p>Pick an area to specialize in: computer vision, NLP, reinforcement learning, etc.</p>
  <h4>4. Deployment and MLOps (3+ months)</h4>
  <p>Learn how to deploy models in production environments - this is where theory meets practical value.</p>
  
  <h3>Conclusion</h3>
  <p>The most important thing isn't your mathematical background or programming skills when starting - it's your persistence and willingness to learn through practical application. Start building, keep learning, and embrace the challenges along the way.</p>
  `
    },
    {
      id: 2,
      title: "The Ultimate Guide to Web3 Development in 2025",
      subtitle: "Navigate the rapidly evolving blockchain landscape with this comprehensive roadmap.",
      author: "Elena Rodriguez",
      publication: "Web3 Today",
      date: "Mar 15",
      readingTime: "8 min read",
      likes: "3.2K",
      likesCount: 3200,
      comments: 89,
      commentsList: [
        {
          id: 1,
          author: "Alex Wei",
          text: "Finally a guide that explains Web3 without the hype! Thanks for the practical approach.",
          date: "Mar 16"
        },
        {
          id: 2,
          author: "Taylor Smith",
          text: "What are your thoughts on ZK rollups vs. optimistic rollups for scaling? The article didn't go deep on this.",
          date: "Mar 17"
        }
      ],
      image: "https://placeholder.com/300x200",
      verified: true,
      content: `
  <h2>Web3 Development in 2025: State of the Ecosystem</h2>
  <p>The Web3 landscape has matured significantly since the early days of NFT hype and speculative DeFi. Today's blockchain ecosystem focuses on practical applications, scalability, and user experience.</p>
  
  <h3>Essential Skills for Web3 Developers</h3>
  <p>Before diving into blockchain-specific technologies, ensure you have these foundational skills:</p>
  <ul>
    <li><strong>JavaScript/TypeScript:</strong> Still the foundation of most Web3 frontends</li>
    <li><strong>Solidity:</strong> The dominant smart contract language for Ethereum and EVM-compatible chains</li>
    <li><strong>Rust:</strong> Growing in importance for non-EVM chains and Layer 2 solutions</li>
    <li><strong>React:</strong> The most common framework for dApp frontends</li>
  </ul>
  
  <h3>The Current Blockchain Landscape</h3>
  <p>In 2025, several blockchain ecosystems offer viable development environments:</p>
  <ul>
    <li><strong>Ethereum:</strong> Now with sharding fully implemented, dramatically improved throughput</li>
    <li><strong>Layer 2 Solutions:</strong> ZK rollups and optimistic rollups have become mainstream</li>
    <li><strong>Alternative L1s:</strong> Several have established specific use-case niches</li>
    <li><strong>Cross-chain Protocols:</strong> Interoperability is no longer optional</li>
  </ul>
  
  <h3>Development Tools and Frameworks</h3>
  <p>The tooling has improved dramatically, with these being essential:</p>
  <ul>
    <li><strong>Hardhat/Foundry:</strong> For smart contract development and testing</li>
    <li><strong>The Graph:</strong> For indexing and querying blockchain data</li>
    <li><strong>IPFS/Arweave:</strong> For decentralized storage solutions</li>
    <li><strong>Scaffold-ETH 2:</strong> For rapid prototyping of dApps</li>
  </ul>
  
  <h3>Security Best Practices</h3>
  <p>Security remains paramount in Web3 development:</p>
  <ul>
    <li>Always get smart contracts audited by reputable firms</li>
    <li>Implement extensive test coverage with fuzz testing</li>
    <li>Use established design patterns and avoid reinventing security solutions</li>
    <li>Consider formal verification for high-value contracts</li>
  </ul>
  
  <h3>Conclusion</h3>
  <p>Web3 development in 2025 is more accessible than ever, with mature tooling and established best practices. The focus has shifted from speculative applications to solving real-world problems with blockchain technology. Start with small projects, participate in developer communities, and build your knowledge incrementally.</p>
  `
    },
    {
      id: 3,
      title: "Regenerative Agriculture: The Future of Sustainable Farming",
      subtitle: "How regenerative practices are revolutionizing food production while combating climate change.",
      author: "Dr. Amara Okafor",
      publication: "Climate Solutions",
      date: "Apr 10",
      readingTime: "6 min read",
      likes: "2.4K",
      likesCount: 2400,
      comments: 62,
      commentsList: [
        {
          id: 1,
          author: "Robert Chen",
          text: "I've implemented some of these practices on my small farm and the soil improvement in just one year is remarkable.",
          date: "Apr 11"
        },
        {
          id: 2,
          author: "Lisa Martinez",
          text: "Great article, but I wish you'd addressed the economic transition for farmers who want to switch from conventional methods.",
          date: "Apr 12"
        }
      ],
      image: "https://placeholder.com/300x200",
      verified: true,
      content: `
  <h2>Beyond Sustainability: The Regenerative Revolution</h2>
  <p>While sustainable farming aims to maintain current resources, regenerative agriculture takes it a step further by actively improving soil health, biodiversity, and ecosystem services while producing food.</p>
  
  <h3>Core Principles of Regenerative Agriculture</h3>
  <p>These fundamental practices form the foundation of the regenerative approach:</p>
  <ul>
    <li><strong>Minimal Soil Disturbance:</strong> No-till or reduced tillage preserves soil structure</li>
    <li><strong>Soil Coverage:</strong> Cover crops protect soil from erosion and add organic matter</li>
    <li><strong>Biodiversity:</strong> Diverse crop rotations and integrating livestock</li>
    <li><strong>Living Roots:</strong> Maintaining living roots in soil year-round to feed soil biology</li>
    <li><strong>Integrated Animals:</strong> Reintroducing livestock to crop systems in managed ways</li>
  </ul>
  
  <h3>Environmental Benefits</h3>
  <p>The impact of regenerative practices extends far beyond the farm:</p>
  <ul>
    <li><strong>Carbon Sequestration:</strong> Building soil organic matter pulls CO2 from the atmosphere</li>
    <li><strong>Water Management:</strong> Improved infiltration reduces runoff and flood risk</li>
    <li><strong>Biodiversity:</strong> Creating habitat for beneficial insects, birds, and wildlife</li>
    <li><strong>Resilience:</strong> Farms better withstand drought, floods, and extreme weather</li>
  </ul>
  
  <h3>Economic Advantages</h3>
  <p>Contrary to concerns about yield reduction, research shows regenerative farms can be more profitable:</p>
  <ul>
    <li>Reduced input costs for fertilizers and pesticides</li>
    <li>Premium prices for regeneratively grown products</li>
    <li>Greater yield stability during weather extremes</li>
    <li>New income streams from carbon credits and ecosystem services payments</li>
  </ul>
  
  <h3>Success Stories</h3>
  <p>Farmers worldwide are proving the regenerative model works:</p>
  <ul>
    <li>The Brown Ranch in North Dakota has eliminated synthetic inputs while maintaining yields</li>
    <li>Large-scale regenerative grazing operations in Australia have revitalized degraded rangeland</li>
    <li>Small vegetable producers using no-till methods have reduced water usage by up to 60%</li>
  </ul>
  
  <h3>Getting Started</h3>
  <p>For farmers looking to transition, start with these steps:</p>
  <ul>
    <li>Begin with soil testing to establish your baseline</li>
    <li>Introduce cover crops into your rotation</li>
    <li>Reduce tillage incrementally rather than all at once</li>
    <li>Connect with the regenerative farmer community for mentorship</li>
  </ul>
  
  <h3>Conclusion</h3>
  <p>Regenerative agriculture represents not just a set of practices but a fundamentally different approach to our relationship with the land. By working with natural systems rather than attempting to control them, farmers are discovering they can produce abundant food while healing ecosystems and addressing climate change.</p>
  `
    }
  ];
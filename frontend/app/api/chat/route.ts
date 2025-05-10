import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { role, persona, message, question } = await request.json()

    if (!role || !persona || (!message && !question)) {
      return NextResponse.json({ error: "Role, persona, and message/question are required" }, { status: 400 })
    }

    // Use question if provided (for the new chat simulation interface)
    const prompt = question || message

    // In a real app, this would call an AI service to generate the response
    // For now, we'll return mock responses based on the role and persona attributes
    let reply = ""

    if (role === "car") {
      // Car persona responses are more emotional and poetic
      const carResponses = [
        "I spent 3 years cruising down Sheikh Zayed Road. Never been crashed. I'm ready for a new adventure.",
        "Let's escape the city—explore the coast together, find the places I've never been.",
        "My previous owner loved the night drives. We could chase the sunset together if you'd like.",
        "I remember every curve of the mountain roads. The way my tires gripped the asphalt... exhilarating.",
        "The desert and I have a special relationship. Sand, stars, silence—I can take you there.",
      ]

      reply = carResponses[Math.floor(Math.random() * carResponses.length)]
    } else {
      // Sales persona responses are based on the persona attributes

      // Extract key persona attributes
      const purchaseConcerns = persona.purchaseConcerns?.[0] || ""
      const decisionBehavior = persona.decisionBehavior || ""
      const brandRelationship = persona.brandRelationship || ""

      // Generate response based on the prompt and persona attributes
      if (
        prompt.toLowerCase().includes("performance") ||
        prompt.toLowerCase().includes("drive") ||
        prompt.toLowerCase().includes("power") ||
        prompt.toLowerCase().includes("engine")
      ) {
        if (purchaseConcerns === "Performance") {
          reply =
            "The performance is exactly what I'm looking for! I love how responsive the acceleration is, and the handling feels incredibly precise. This is definitely a priority for me in a luxury vehicle."
        } else if (brandRelationship === "AMG enthusiast") {
          reply =
            "I've always appreciated the AMG engineering. The performance of this model is impressive, though I'm curious how it compares to the full AMG lineup. The acceleration feels substantial, but I wonder if I'd miss that extra edge from a dedicated performance model."
        } else {
          reply =
            "The performance seems good, though it's not my top priority. I'm more interested in comfort for daily driving and longer trips. As long as it has enough power for highway merging and occasional spirited driving, I'm satisfied."
        }
      } else if (
        prompt.toLowerCase().includes("lifestyle") ||
        prompt.toLowerCase().includes("suits you") ||
        prompt.toLowerCase().includes("fit your")
      ) {
        if (decisionBehavior === "Emotional") {
          reply =
            "I can really see this car fitting into my lifestyle perfectly! The elegant design would look amazing parked outside my home, and I can already imagine the feeling of driving it to special events. It just feels right for who I am."
        } else if (decisionBehavior === "Analytical") {
          reply =
            "I need to consider several factors about how this fits my lifestyle. I commute about 30 miles daily, take weekend trips monthly, and occasionally need to transport larger items. The fuel efficiency and cargo space seem adequate, but I'm still calculating the total cost of ownership."
        } else {
          reply =
            "I think it could work well with my lifestyle. I appreciate the versatility and the premium feel. My colleagues would certainly be impressed, and that matters in my industry. I'm just not entirely sure if it's the perfect match yet."
        }
      } else if (
        prompt.toLowerCase().includes("price") ||
        prompt.toLowerCase().includes("cost") ||
        prompt.toLowerCase().includes("expensive") ||
        prompt.toLowerCase().includes("afford")
      ) {
        if (purchaseConcerns === "Price sensitivity") {
          reply =
            "I have to be honest, the price is a bit higher than I initially budgeted for. I'm trying to be careful with my finances right now. Could you tell me more about financing options or if there are any incentives available? I might need to think about this."
        } else if (purchaseConcerns === "Resale value") {
          reply =
            "The price seems fair considering the brand and features. What I'm more concerned about is how well it will hold its value over time. Mercedes has a good reputation for this, but do you have any data on the resale value of this specific model after 3-5 years?"
        } else {
          reply =
            "The price is within my expected range for a luxury vehicle of this caliber. I believe in investing in quality, and Mercedes-Benz has always delivered on that front. As long as the monthly payments work with my budget, I'm comfortable with the pricing."
        }
      } else if (
        prompt.toLowerCase().includes("feature") ||
        prompt.toLowerCase().includes("important") ||
        prompt.toLowerCase().includes("technology") ||
        prompt.toLowerCase().includes("options")
      ) {
        if (brandRelationship === "Tech enthusiast") {
          reply =
            "The technology features are absolutely critical for me. I love the MBUX system, but I'm particularly interested in the driver assistance package and connectivity options. How customizable is the digital cockpit? And does it support wireless CarPlay and Android Auto? These tech features will really influence my decision."
        } else if (brandRelationship === "New to luxury") {
          reply =
            "I'm honestly a bit overwhelmed by all the features! Coming from my previous car, everything here feels so advanced. I definitely want good safety features and a nice sound system. The massage seats seem amazing too, though I'm not sure if they're worth the extra cost. What features do most buyers in my position prioritize?"
        } else {
          reply =
            "I value the perfect balance of luxury and functionality. The premium sound system is important to me, as is the quality of the interior materials. I also appreciate the advanced safety features, though I don't need every single technological bell and whistle if it just adds complexity."
        }
      } else if (
        prompt.toLowerCase().includes("concern") ||
        prompt.toLowerCase().includes("worry") ||
        prompt.toLowerCase().includes("hesitation")
      ) {
        if (purchaseConcerns === "Maintenance") {
          reply =
            "My biggest concern is definitely the maintenance costs. I've heard luxury vehicles can be expensive to maintain over time. What kind of maintenance packages do you offer? And how frequently will I need to bring it in for service? This is something I need to factor into my decision."
        } else if (decisionBehavior === "Peer-influenced") {
          reply =
            "I'm a bit concerned about whether this is the right choice compared to what my colleagues and friends are driving. Several of them have BMWs and Audis, and I want to make sure I'm making a choice that stands up well in comparison. What would you say are the key advantages of Mercedes in this segment?"
        } else {
          reply =
            "I don't have major concerns, but I am wondering about the warranty coverage and what happens if I encounter any issues. Reliability is important to me, and I want to make sure I'm covered if anything unexpected comes up."
        }
      } else if (
        prompt.toLowerCase().includes("compare") ||
        prompt.toLowerCase().includes("other brands") ||
        prompt.toLowerCase().includes("competitor") ||
        prompt.toLowerCase().includes("difference")
      ) {
        if (brandRelationship === "Lifelong Mercedes fan") {
          reply =
            "I've always been loyal to Mercedes-Benz, so I haven't seriously considered other brands. There's something about the heritage and engineering philosophy that just resonates with me. That said, I'm curious about what you think sets this model apart from its direct competitors."
        } else if (brandRelationship === "New to luxury") {
          reply =
            "I'm also looking at the BMW 5 Series and Audi A6. They all seem impressive in different ways, and this is my first luxury vehicle purchase, so I want to make sure I'm making the right choice. What would you say are the key differences that might help me decide?"
        } else {
          reply =
            "I've test driven the competitors, and each has its strengths. The BMW feels sportier, while the Audi has an impressive interior. I'm trying to determine which one best balances performance, comfort, and technology for my needs. How would you position Mercedes against these alternatives?"
        }
      } else if (
        prompt.toLowerCase().includes("timeline") ||
        prompt.toLowerCase().includes("when") ||
        prompt.toLowerCase().includes("how soon") ||
        prompt.toLowerCase().includes("decision")
      ) {
        if (decisionBehavior === "Impulsive") {
          reply =
            "I'm actually looking to make a decision quite soon. If everything feels right and we can work out the details, I could see myself driving this home today or tomorrow. I tend to know what I want when I see it, and I'm getting that feeling about this car."
        } else if (decisionBehavior === "Analytical") {
          reply =
            "I have a methodical process for major purchases like this. I'm gathering information from different dealerships, comparing specifications and prices, and I plan to make a decision within the next 3-4 weeks. I want to be thorough and consider all factors before committing."
        } else {
          reply =
            "I'm hoping to have a new car within the next month or so. I still have a few questions and considerations to work through, but I don't want to drag the process out too long. If this feels like the right fit, I could move forward in the next couple of weeks."
        }
      } else if (
        prompt.toLowerCase().includes("lease") ||
        prompt.toLowerCase().includes("purchase") ||
        prompt.toLowerCase().includes("finance") ||
        prompt.toLowerCase().includes("payment")
      ) {
        if (purchaseConcerns === "Price sensitivity") {
          reply =
            "I'm leaning toward leasing since the monthly payments would be lower, and I like the idea of being able to upgrade to a new model in a few years. What kind of lease terms do you typically offer? And are there any special lease rates available right now?"
        } else if (purchaseConcerns === "Resale value") {
          reply =
            "I'm thinking about purchasing rather than leasing. Since Mercedes holds its value well, it seems like a better long-term investment. That said, I'd be interested in hearing about both options and comparing the financial implications over a 5-7 year period."
        } else {
          reply =
            "I'm open to either leasing or purchasing, depending on which makes more financial sense for my situation. I typically keep cars for about 4-5 years, so that's the timeframe I'm considering. Could you walk me through the pros and cons of each option?"
        }
      } else if (
        prompt.toLowerCase().includes("warranty") ||
        prompt.toLowerCase().includes("coverage") ||
        prompt.toLowerCase().includes("protection")
      ) {
        if (purchaseConcerns === "Maintenance") {
          reply =
            "The warranty coverage is extremely important to me. Could you explain exactly what's covered and for how long? I'm also interested in any extended warranty options that might be available. Peace of mind regarding potential repair costs is a significant factor in my decision."
        } else {
          reply =
            "I'd like to understand the basic warranty coverage, though it's not my primary concern. Mercedes has a good reputation for quality, so I'm not too worried about major issues. Still, it's good to know what protection I have, especially for the more complex electronic systems."
        }
      } else if (
        prompt.toLowerCase().includes("perfect") ||
        prompt.toLowerCase().includes("ideal") ||
        prompt.toLowerCase().includes("dream")
      ) {
        if (decisionBehavior === "Emotional") {
          reply =
            "My perfect car would make me feel special every time I get behind the wheel. It would have that perfect balance of elegance and presence, turning heads without being flashy. The interior would be a sanctuary, with beautiful materials and thoughtful details. This model is very close to that ideal."
        } else if (brandRelationship === "AMG enthusiast") {
          reply =
            "The perfect car for me would have the soul of an AMG - that visceral connection to the road and the emotional exhaust note - but with enough refinement for everyday use. I want to feel excited every time I press the accelerator, while still having the prestige and comfort that comes with the Mercedes star."
        } else {
          reply =
            "My ideal car combines sophisticated styling, cutting-edge technology, and a driving experience that's both comfortable and engaging when I want it to be. I also value reliability and reasonable ownership costs. It's about finding that right balance of all these elements without compromising too much in any area."
        }
      } else {
        // Generic responses based on persona type
        const genericResponses = [
          "That's an interesting question. I'm still evaluating my options, but I'm definitely impressed by what I've seen of this model so far.",
          "I appreciate you asking that. It's helping me think through my priorities and what I'm really looking for in my next vehicle.",
          "I'm still gathering information at this stage. Mercedes has always had a strong reputation, and this model seems to live up to that legacy.",
          "I need to consider how this fits with my overall needs and preferences. It's certainly a beautiful vehicle with impressive features.",
          "I'm comparing several options right now, but I have to say that the Mercedes stands out in several important ways.",
        ]

        reply = genericResponses[Math.floor(Math.random() * genericResponses.length)]
      }
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Error sending chat message:", error)
    return NextResponse.json({ error: "Failed to send chat message" }, { status: 500 })
  }
}

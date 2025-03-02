import { Level } from '../types/game';

// Riddle collections - each level will randomly select one
const textRiddles = [
  {
    question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    answer: 'echo',
    hints: ['Think about sound...', 'I repeat what others say', 'You might hear me in mountains or caves']
  },
  {
    question: 'The more you take, the more you leave behind. What am I?',
    answer: 'footsteps',
    hints: ['Think about moving forward', 'You create these as you walk', 'They mark your path']
  },
  {
    question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
    answer: 'map',
    hints: ['I help you navigate', 'I represent the world in miniature', 'Explorers rely on me']
  },
  {
    question: 'What can travel around the world while staying in a corner?',
    answer: 'stamp',
    hints: ['I help messages reach their destination', 'I\'m small but valuable', 'You find me on envelopes']
  },
  {
    question: 'I\'m light as a feather, but the strongest person can\'t hold me for more than a few minutes. What am I?',
    answer: 'breath',
    hints: ['You do this constantly', 'You can\'t see it, but you can feel it', 'You need it to live']
  }
];

const imageRiddleCodes = [
  {
    answer: 'FREEDOM',
    hints: ['The badge is old but the QR code is still readable', 'Security clearance words are often inspirational', 'The word represents what all prisoners desire']
  },
  {
    answer: 'ACCESS',
    hints: ['The code represents permission', 'Think about what you need to enter a secure area', 'It grants you entry to restricted zones']
  },
  {
    answer: 'STARLIGHT',
    hints: ['Look beyond this world', 'The ship gets its energy from celestial bodies', 'It shines in the darkness of space']
  },
  {
    answer: 'OXYGEN',
    hints: ['Essential for human survival', 'Without it, you can\'t breathe', 'The ship needs to maintain its supply']
  }
];

const binaryPuzzles = [
  {
    question: 'A terminal displays binary code with instructions: "Decode and verbally answer: 01010111 01001000 01000001 01010100 00100000 01001001 01010011 00100000 01010100 01001000 01000101 00100000 01000110 01001001 01010010 01010011 01010100 00100000 01001100 01000101 01010100 01010100 01000101 01010010 00100000 01001111 01000110 00100000 01000001 01001100 01010000 01001000 01000001 01000010 01000101 01010100"',
    answer: 'A',
    hints: [
      'Use the binary chart to convert each group to a letter',
      'The message is asking a question about the alphabet',
      'The answer is a single letter'
    ]
  },
  {
    question: 'A terminal displays binary code with instructions: "Decode and verbally answer: 01001000 01001111 01010111 00100000 01001101 01000001 01001110 01011001 00100000 01010011 01010100 01000001 01010010 01010011 00100000 01001111 01001110 00100000 01010100 01001000 01000101 00100000 01000001 01001101 01000101 01010010 01001001 01000011 01000001 01001110 00100000 01000110 01001100 01000001 01000111"',
    answer: '50',
    hints: [
      'Use the binary chart to convert each group to a letter',
      'The message is asking about a national symbol',
      'Count the objects in the Stars and Stripes'
    ]
  },
  {
    question: 'A terminal displays binary code with instructions: "Decode and verbally answer: 01010111 01001000 01000001 01010100 00100000 01000011 01001111 01001100 01001111 01010010 00100000 01001001 01010011 00100000 01010100 01001000 01000101 00100000 01010011 01001011 01011001"',
    answer: 'blue',
    hints: [
      'Use the binary chart to convert each group to a letter',
      'The message is asking about something you see above you',
      'It\'s the color of Earth\'s atmosphere from the ground'
    ]
  }
];

const sequencePuzzles = [
  {
    question: 'The escape pod\'s AI asks: "To confirm human identity, complete this sequence: Earth, Mars, Jupiter, ___"',
    answer: 'Saturn',
    hints: [
      'These are celestial bodies in our solar system',
      'They are list`ed in order of distance from the Sun',
      'The next planet after Jupiter moving outward'
    ]
  },
  {
    question: 'The escape pod\'s AI asks: "To confirm human identity, complete this sequence: 1, 1, 2, 3, 5, ___"',
    answer: '8',
    hints: [
      'This is a famous mathematical sequence',
      'Each number is the sum of the two before it',
      'The sequence continues: 1, 1, 2, 3, 5, 8, 13, 21, ...'
    ]
  },
  {
    question: 'The escape pod\'s AI asks: "To confirm human identity, complete this sequence: Sunday, Monday, Tuesday, ___"',
    answer: 'Wednesday',
    hints: [
      'These are time divisions',
      'They repeat every week',
      'It\'s the middle of the work week'
    ]
  },
  {
    question: 'The escape pod\'s AI asks: "To confirm human identity, complete this sequence: Mercury, Venus, Earth, ___"',
    answer: 'Mars',
    hints: [
      'These are objects in space',
      'They orbit our sun',
      'The 4th planet from the sun'
    ]
  }
];

// Helper function to randomly select an item from an array
function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Create the levels with randomly selected puzzles
export const levels: Level[] = [
  {
    id: 'spaceship-escape-1',
    name: 'Spaceship Control Room',
    description: 'Josh is trapped in the abandoned spacecraft\'s control room. The main console is locked and needs a passcode.',
    storyIntro: 'Josh awakens with a dull pain in his head. The last thing he remembers is docking with the derelict spacecraft that had been drifting on the edge of the Kepler system. Now, he\'s alone in what appears to be the control room, with emergency lights casting eerie red shadows across the walls. The main door is sealed shut, and his communication device isn\'t working. The only way out is to access the main console.',
    storyOutro: 'The console lights up with a satisfying hum. "Access granted," announces an automated voice. Josh quickly scans the ship\'s systems and discovers that life support is failing. He needs to make his way to the engineering deck to restore power before the oxygen runs out.',
    puzzles: [
      {
        id: 'puzzle-1',
        type: 'text',
        ...getRandomItem(textRiddles),
        validateWith: 'ai',
        aiConfig: {
          provider: 'gemini',
          model: 'gemini-2.0-flash',
          temperature: 0.3
        }
      }
    ]
  },
  
  // Our new second level - power coupling alignment with timing puzzle
  {
    id: 'spaceship-escape-repair',
    name: 'Power System Repair',
    description: 'The ship\'s power coupling is misaligned. Josh needs to realign it to restore full power.',
    storyIntro: 'As Josh makes his way toward the engineering sector, he notices the ship\'s lights flickering erratically. "The main power coupling must be malfunctioning," he mutters to himself. On a nearby terminal, flashing red warnings indicate that the power coupling is misaligned. Without proper alignment, the ship\'s critical systems—including life support and the door mechanisms—will continue to fail. Josh locates the manual alignment control panel, but the coupling is unstable and moving unpredictably. He\'ll need precise timing to lock it back into position.',
    storyOutro: 'The moment Josh hits the alignment sweet spot, the coupling locks in place with a satisfying mechanical clunk. The ship\'s lights stabilize, changing from emergency red to standard illumination. "Power coupling aligned. Main power restored," announces the ship\'s computer. Josh breathes a sigh of relief as the environmental systems begin to function properly again. With power restored, he can now proceed deeper into the ship to find his way to the escape pods.',
    puzzles: [
      {
        id: 'puzzle-repair',
        type: 'timing',
        question: 'Align the power coupling by clicking the button when the moving block reaches the center green zone.',
        answer: 'aligned', // The actual solution is determined by timing, not text input
        hints: [
          'Watch the pattern of movement before attempting to click',
          'The block moves at a consistent speed until you miss',
          'Try to anticipate when it will reach the center rather than reacting'
        ]
      }
    ]
  },
  
  // Original second level - now becomes third level
  {
    id: 'spaceship-escape-2',
    name: 'Engineering Sector',
    description: 'Josh needs to restore power to the ship\'s life support systems in the engineering sector.',
    storyIntro: 'With the power coupling aligned, Josh continues to the engineering sector. The areas are better lit now, but occasional sparks from damaged circuitry still create an unsettling atmosphere. According to the ship\'s schematics, he needs to restore the primary power routing to life support, but a security lockdown has been initiated. The engineering terminal requires visual authentication from a security officer.',
    storyOutro: 'The power systems come back online with a deep, resonating hum that vibrates through the hull. "Life support restored," announces the ship\'s computer. Josh breathes a sigh of relief as fresh oxygen begins to circulate. A holographic map activates, showing that the path to the escape pods is through the science lab. But the map also reveals something disturbing - the ship\'s AI has flagged the presence of an unknown entity aboard.',
    puzzles: [
      {
        id: 'puzzle-2',
        type: 'image',
        question: 'The terminal displays a message: "Scan security officer ID badge to proceed." Josh finds a damaged badge on the floor with a QR code still visible.',
        ...getRandomItem(imageRiddleCodes)
      }
    ]
  },
  {
    id: 'spaceship-escape-3',
    name: 'Science Laboratory',
    description: 'Josh must navigate through the science lab to reach the escape pods, but a cryptic message blocks his path.',
    storyIntro: 'The science lab is eerily quiet, with specimen containers and research equipment scattered about as if the crew left in a hurry. The lights here are brighter, powered by the newly restored systems, but that only makes the strange, viscous substance on the walls more visible. Josh approaches the exit that leads to the escape pod bay, only to find it locked with a unique security system - a binary code sequence and voice recognition.',
    storyOutro: 'The door slides open with a hydraulic hiss. Josh steps through, relieved, but freezes when he hears a chittering sound behind him. He catches a glimpse of something moving in the shadows - something that definitely isn\'t human. Heart pounding, he races toward the escape pod bay, the creature\'s footsteps echoing behind him.',
    puzzles: [
      {
        id: 'puzzle-3',
        type: 'voice',
        ...getRandomItem(binaryPuzzles)
      }
    ]
  },
  {
    id: 'spaceship-escape-final',
    name: 'Escape Pod Bay',
    description: 'Josh has reached the escape pod bay and must launch the last remaining pod before the creature catches up to him.',
    storyIntro: 'Josh bursts into the escape pod bay, the door slamming shut behind him. He quickly engages the emergency lock, but the metal dents inward as something powerful slams against it from the other side. There\'s only one escape pod left, its systems already in pre-launch sequence. To complete the launch, Josh needs to solve one final security measure - clearly designed to prevent the ship\'s non-human inhabitants from escaping.',
    storyOutro: 'The escape pod detaches from the derelict ship with a violent jolt, just as the bay door gives way. Josh catches a final glimpse of a nightmarish form lunging toward the viewport before the thrusters engage, propelling him safely into space. As the abandoned ship recedes in the distance, Josh activates the emergency beacon. He\'s survived, but the questions remain: What happened to the crew? What were those creatures? And why was he sent to investigate without being told the true nature of his mission?',
    puzzles: [
      {
        id: 'puzzle-penultimate',
        type: 'text',
        ...getRandomItem(sequencePuzzles),
        validateWith: 'ai',
        aiConfig: {
          provider: 'gemini',
          model: 'gemini-2.0-flash',
          temperature: 0.3
        }
      }
    ]
  },
  {
    id: 'spaceship-escape-launch',
    name: 'Launch Sequence Activation',
    description: 'Josh needs to activate the escape pod\'s launch sequence by solving a complex pattern recognition puzzle.',
    storyIntro: 'The escape pod is ready, but the launch systems are locked behind a sophisticated pattern recognition system. "This must be another security measure," Josh mutters, studying the interface. The screen displays a complex arrangement of geometric shapes and colors. A message blinks: "Complete pattern sequence to initiate launch." Josh knows he needs to figure out the pattern logic quickly - the sounds of the creature trying to break through the door are getting louder.',
    storyOutro: 'As Josh completes the pattern, the escape pod\'s engines roar to life. "Launch sequence initiated," announces the ship\'s computer in a calm voice that contrasts sharply with Josh\'s racing heartbeat. The pod\'s hatch seals with a pneumatic hiss, and countdown numbers flash on screen. Through the viewport, Josh can see the creature finally break through the door, its alien form more terrifying than anything he could have imagined. But it\'s too late for the creature - the pod blasts free from the derelict ship, thrusters propelling Josh to safety as the abandoned vessel grows smaller in the distance.',
    puzzles: [
      {
        id: 'pattern-puzzle',
        type: 'pattern',
        question: 'Complete the security pattern to bypass the firewall.',
        answer: 'pattern', // Placeholder answer, actual evaluation will be done in the mini-game
        hints: ['Follow the sequence of symbols carefully.']
      },
      {
        id: 'puzzle-penultimate',
        type: 'text',
        ...getRandomItem(sequencePuzzles),
        validateWith: 'ai',
        aiConfig: {
          provider: 'gemini',
          model: 'gemini-2.0-flash',
          temperature: 0.3
        }
      }
    ]
  },
  
  // Add our horror final confrontation level
  {
    id: 'spaceship-escape-confrontation',
    name: 'Final Confrontation',
    description: 'The creature has caught up with Josh. He must fight for his life using whatever he can find.',
    
    storyOutro: 'Josh collapses against the wall, breathing heavily, his hands still trembling. The creature lies motionless on the floor, dark fluid pooling beneath its twisted form. The improvised strategy worked. Josh cautiously steps over the creature\'s body, making his way toward the escape pod\'s entry hatch. He can\'t help but glance back at the thing that nearly killed him. In death, its face looks almost... human. Josh shudders and turns away, activating the escape pod\'s launch sequence. As the hatch seals and the engines ignite, he allows himself to believe, for the first time, that he might actually survive this nightmare.',
    puzzles: [
      {
        id: 'puzzle-confrontation',
        type: 'creative',
        question: 'The creature is breaking through the door. Help Josh formulate a survival strategy using the items available in the maintenance alcove.',
        answer: 'survival', // This is just a placeholder, actual evaluation will be done by AI
        hints: [
          'Consider combining multiple items for maximum effect',
          'The creature seems sensitive to light and sound',
          'Think about creating a distraction to buy escape time'
        ],
        validateWith: 'ai',
        aiConfig: {
          provider: 'gemini',
          model: 'gemini-2.0-flash',
          temperature: 0.7
        },
        creativeConfig: {
          availableItems: [
            'Broken pipe wrench',
            'Flickering emergency light',
            'Pressurized oxygen tank',
            'Frayed electrical cables',
            'Chemical coolant canister',
            'Hydraulic door piston',
            'Maintenance terminal (powered down)',
            'Fire suppression system (partially functional)',
            'Rusty metal shelf',
            'Duct tape',
            'Medical kit with sedatives'
          ],
          scenario: 'The maintenance alcove is small and cramped. The creature—a grotesque hybrid of insectoid and humanoid features—is tearing through the reinforced door. Its multiple limbs work with terrible efficiency, and you can hear its raspy, hungry breathing. Each impact causes the lights to flicker, casting twisted shadows across the walls. Josh feels his pulse racing and a cold sweat forming on his brow. There\'s no way out except through that door, and the creature will be through in less than a minute.',
          healthPoints: 100
        }
      },
      {
        id: 'creative-puzzle',
        type: 'creative',
        question: 'Help Josh formulate a survival strategy using the items available in the maintenance alcove.',
        answer: 'survival', // Placeholder answer
        hints: [
          'Think about how to distract the creature',
          'Combine items for maximum effect'
        ],
        validateWith: 'ai',
        aiConfig: {
          provider: 'gemini',
          model: 'gemini-2.0-flash',
          temperature: 0.7
        },
        creativeConfig: {
          availableItems: [
            'Broken pipe wrench',
            'Flickering emergency light',
            'Pressurized oxygen tank',
            'Frayed electrical cables',
            'Chemical coolant canister',
            'Hydraulic door piston',
            'Maintenance terminal (powered down)',
            'Fire suppression system (partially functional)',
            'Rusty metal shelf',
            'Duct tape',
            'Medical kit with sedatives'
          ],
          scenario: 'The maintenance alcove is small and cramped. The creature is tearing through the reinforced door. Josh must think fast as the creature begins tearing through the door. He has seconds to act.',
          healthPoints: 100
        }
      }
    ]
  }
];

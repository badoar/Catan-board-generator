import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

type ResourceType = 'wood' | 'brick' | 'wheat' | 'sheep' | 'ore' | 'desert'
type PortType = 'wood' | 'brick' | 'wheat' | 'sheep' | 'ore' | '3:1'

interface Hex {
  q: number
  r: number
  resource: ResourceType
  number: number | null
}

interface Port {
  q: number
  r: number
  vertex: number
  type: PortType
}

interface GenerationOptions {
  adjacent_6_8: boolean           // Allow 6 & 8 to touch
  adjacent_2_12: boolean          // Allow 2 & 12 to touch
  adjacent_same_numbers: boolean  // Allow same numbers to touch
  adjacent_same_resource: boolean // Allow same resource to touch
  resource_multiple_6_8: boolean  // Allow resource to have 2+ of 6/8
  desert_in_center: boolean       // Allow desert in center
}

// Standard Catan resource distribution
const RESOURCES: ResourceType[] = [
  'wood', 'wood', 'wood', 'wood',
  'brick', 'brick', 'brick',
  'wheat', 'wheat', 'wheat', 'wheat',
  'sheep', 'sheep', 'sheep', 'sheep',
  'ore', 'ore', 'ore',
  'desert'
]

// Standard number tokens (excluding desert)
const NUMBERS = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]

// Axial coordinates for standard Catan board layout
const HEX_POSITIONS = [
  // Center
  { q: 0, r: 0 },
  // Ring 1
  { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
  { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 },
  // Ring 2
  { q: 2, r: 0 }, { q: 2, r: -1 }, { q: 2, r: -2 },
  { q: 1, r: -2 }, { q: 0, r: -2 }, { q: -1, r: -1 },
  { q: -2, r: 0 }, { q: -2, r: 1 }, { q: -2, r: 2 },
  { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 },
]

// Port placements with vertex positions (q, r, vertex)
const PORT_CONFIGS: { q: number; r: number; vertex: number; type: PortType }[] = [
  { q: 2, r: -2, vertex: 1, type: '3:1' },
  { q: 2, r: -2, vertex: 2, type: 'wood' },
  { q: 0, r: -2, vertex: 2, type: '3:1' },
  { q: -1, r: -1, vertex: 2, type: 'brick' },
  { q: -2, r: 0, vertex: 3, type: '3:1' },
  { q: -2, r: 2, vertex: 4, type: 'wheat' },
  { q: 0, r: 2, vertex: 4, type: '3:1' },
  { q: 1, r: 1, vertex: 5, type: 'sheep' },
  { q: 2, r: 0, vertex: 0, type: 'ore' },
]

// Seeded random number generator (Linear Congruential Generator)
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed % 233280
  }

  next(): number {
    this.seed = (9301 * this.seed + 49297) % 233280
    return this.seed / 233280
  }

  shuffle<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }
}

// Get all 6 neighbors of a hex in axial coordinates
function getNeighbors(q: number, r: number): { q: number; r: number }[] {
  return [
    { q: q + 1, r: r },     // East
    { q: q + 1, r: r - 1 }, // Northeast
    { q: q, r: r - 1 },     // Northwest
    { q: q - 1, r: r },     // West
    { q: q - 1, r: r + 1 }, // Southwest
    { q: q, r: r + 1 },     // Southeast
  ]
}

// Check if a board configuration violates any constraints
function isValidBoard(hexes: Hex[], options: GenerationOptions): boolean {
  // Check desert in center
  if (!options.desert_in_center) {
    const centerHex = hexes[0] // First hex is always center (0, 0)
    if (centerHex.resource === 'desert') {
      return false
    }
  }

  // Build adjacency map for faster lookups
  const hexMap = new Map<string, Hex>()
  for (const hex of hexes) {
    hexMap.set(`${hex.q},${hex.r}`, hex)
  }

  // Check adjacency constraints
  for (const hex of hexes) {
    const neighbors = getNeighbors(hex.q, hex.r)

    for (const neighborPos of neighbors) {
      const neighbor = hexMap.get(`${neighborPos.q},${neighborPos.r}`)
      if (!neighbor) continue

      // Only check each pair once (avoid duplicate checks)
      if (hex.q < neighbor.q || (hex.q === neighbor.q && hex.r < neighbor.r)) {
        continue
      }

      // Skip number comparisons if either hex is desert
      const bothHaveNumbers = hex.resource !== 'desert' && neighbor.resource !== 'desert'

      // Constraint: 6 & 8 cannot touch (unless allowed)
      if (bothHaveNumbers && !options.adjacent_6_8) {
        const isHex68 = hex.number === 6 || hex.number === 8
        const isNeighbor68 = neighbor.number === 6 || neighbor.number === 8
        if (isHex68 && isNeighbor68) {
          return false
        }
      }

      // Constraint: 2 & 12 cannot touch (unless allowed)
      if (bothHaveNumbers && !options.adjacent_2_12) {
        const isHex212 = hex.number === 2 || hex.number === 12
        const isNeighbor212 = neighbor.number === 2 || neighbor.number === 12
        if (isHex212 && isNeighbor212) {
          return false
        }
      }

      // Constraint: Same numbers cannot touch (unless allowed)
      if (bothHaveNumbers && !options.adjacent_same_numbers) {
        if (hex.number === neighbor.number) {
          return false
        }
      }

      // Constraint: Same resources cannot touch (unless allowed)
      if (!options.adjacent_same_resource) {
        if (hex.resource !== 'desert' && neighbor.resource !== 'desert') {
          if (hex.resource === neighbor.resource) {
            return false
          }
        }
      }
    }
  }

  // Constraint: No resource can have more than one 6 or more than one 8 (unless allowed)
  if (!options.resource_multiple_6_8) {
    const resourceNumbers: Map<ResourceType, number[]> = new Map()

    for (const hex of hexes) {
      if (hex.resource === 'desert' || hex.number === null) continue

      if (!resourceNumbers.has(hex.resource)) {
        resourceNumbers.set(hex.resource, [])
      }
      resourceNumbers.get(hex.resource)!.push(hex.number)
    }

    // Check each resource type
    for (const [resource, numbers] of resourceNumbers.entries()) {
      const sixCount = numbers.filter(n => n === 6).length
      const eightCount = numbers.filter(n => n === 8).length

      if (sixCount > 1 || eightCount > 1) {
        return false
      }
    }
  }

  return true
}

// Generate a valid board with the given constraints and seed
function generateBoard(options: GenerationOptions, seed: number): Hex[] {
  const maxAttempts = 10000

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const rng = new SeededRandom(seed + attempt)

    // Shuffle resources and numbers
    const shuffledResources = rng.shuffle([...RESOURCES])
    const shuffledNumbers = rng.shuffle([...NUMBERS])

    // Create hexes with shuffled resources
    const hexes: Hex[] = HEX_POSITIONS.map((pos, index) => ({
      q: pos.q,
      r: pos.r,
      resource: shuffledResources[index],
      number: null,
    }))

    // Assign numbers to non-desert hexes
    let numberIndex = 0
    for (const hex of hexes) {
      if (hex.resource !== 'desert') {
        hex.number = shuffledNumbers[numberIndex]
        numberIndex++
      }
    }

    // Check if this configuration is valid
    if (isValidBoard(hexes, options)) {
      console.log(`Valid board found after ${attempt + 1} attempts with seed ${seed}`)
      return hexes
    }
  }

  // If no valid board found, return the last attempt
  console.warn(`No valid board found after ${maxAttempts} attempts. Returning unconstrained board.`)

  const rng = new SeededRandom(seed)
  const shuffledResources = rng.shuffle([...RESOURCES])
  const shuffledNumbers = rng.shuffle([...NUMBERS])

  const hexes: Hex[] = HEX_POSITIONS.map((pos, index) => ({
    q: pos.q,
    r: pos.r,
    resource: shuffledResources[index],
    number: null,
  }))

  let numberIndex = 0
  for (const hex of hexes) {
    if (hex.resource !== 'desert') {
      hex.number = shuffledNumbers[numberIndex]
      numberIndex++
    }
  }

  return hexes
}

const RESOURCE_COLORS = {
  wood: '#228B22',
  brick: '#B8733C',
  wheat: '#F4C430',
  sheep: '#90EE90',
  ore: '#708090',
  desert: '#EDC9AF',
}

const RESOURCE_NAMES = {
  wood: 'Forest',
  brick: 'Hills',
  wheat: 'Fields',
  sheep: 'Pasture',
  ore: 'Mountains',
  desert: 'Desert',
}

function Hexagon({ hex, size }: { hex: Hex; size: number }) {
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    points.push(`${size * Math.cos(angle)},${size * Math.sin(angle)}`)
  }

  const isHighNumber = hex.number === 6 || hex.number === 8
  const numberColor = isHighNumber ? '#DC2626' : '#1F2937'

  return (
    <g>
      <polygon
        points={points.join(' ')}
        fill={RESOURCE_COLORS[hex.resource]}
        stroke="#8B4513"
        strokeWidth="2"
      />
      {hex.number && (
        <>
          <circle r={size * 0.35} fill="#F5E6D3" />
          <text
            textAnchor="middle"
            dy="0.35em"
            fontSize={size * 0.4}
            fontWeight="bold"
            fill={numberColor}
          >
            {hex.number}
          </text>
          <text
            textAnchor="middle"
            dy={size * 0.15}
            fontSize={size * 0.15}
            fill="#666"
          >
            {'•'.repeat(Math.abs(7 - hex.number))}
          </text>
        </>
      )}
    </g>
  )
}

function Index() {
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1000000))
  const [seedInput, setSeedInput] = useState<string>(String(seed))

  const [options, setOptions] = useState<GenerationOptions>({
    adjacent_6_8: false,
    adjacent_2_12: false,
    adjacent_same_numbers: false,
    adjacent_same_resource: false,
    resource_multiple_6_8: false,
    desert_in_center: true,
  })

  const [board, setBoard] = useState<Hex[]>(() => generateBoard(options, seed))
  const [ports] = useState<Port[]>(() => {
    const rng = new SeededRandom(seed)
    return rng.shuffle([...PORT_CONFIGS])
  })

  const regenerateBoard = useCallback(() => {
    const newSeed = Math.floor(Math.random() * 1000000)
    setSeed(newSeed)
    setSeedInput(String(newSeed))
    console.log('Generating new board with seed:', newSeed, 'and options:', options)
    setBoard(generateBoard(options, newSeed))
  }, [options])

  const applyOptions = useCallback(() => {
    const parsedSeed = parseInt(seedInput) || seed
    setSeed(parsedSeed)
    console.log('Applying seed:', parsedSeed, 'with options:', options)
    setBoard(generateBoard(options, parsedSeed))
  }, [options, seedInput, seed])

  const toggleOption = useCallback((key: keyof GenerationOptions) => {
    setOptions(prev => {
      const newOptions = { ...prev, [key]: !prev[key] }
      console.log('Options changed:', newOptions)
      // Regenerate board immediately with new options
      setTimeout(() => {
        console.log('Regenerating board with new options and seed:', seed)
        setBoard(generateBoard(newOptions, seed))
      }, 0)
      return newOptions
    })
  }, [seed])

  const hexSize = 50

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold text-neutral-900 mb-4">
            Catan Board Generator
          </h1>
          <p className="text-xl text-neutral-600 mb-4">
            Generate balanced, randomized boards for Settlers of Catan
          </p>
          <p className="text-sm text-neutral-500">
            Inspired by catan.bunge.io • Enhanced with modern features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
                Settings
              </h2>

              {/* Seed Input */}
              <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Board Seed
                </label>
                <input
                  type="number"
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  className="input w-full mb-2"
                  placeholder="Enter seed number"
                />
                <p className="text-xs text-neutral-600 mb-3">
                  Use the same seed to recreate a board
                </p>
                <button
                  onClick={applyOptions}
                  className="btn-secondary w-full text-sm"
                >
                  Apply Seed
                </button>
              </div>

              {/* Constraints */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-neutral-900 mb-3">Constraints</h3>

                <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.adjacent_6_8}
                    onChange={() => toggleOption('adjacent_6_8')}
                    className="mt-1 w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">6 & 8 Can Touch</div>
                    <div className="text-xs text-neutral-600">Allow high-probability numbers adjacent</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.adjacent_2_12}
                    onChange={() => toggleOption('adjacent_2_12')}
                    className="mt-1 w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">2 & 12 Can Touch</div>
                    <div className="text-xs text-neutral-600">Allow low-probability numbers adjacent</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.adjacent_same_numbers}
                    onChange={() => toggleOption('adjacent_same_numbers')}
                    className="mt-1 w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">Same Numbers Can Touch</div>
                    <div className="text-xs text-neutral-600">Allow identical numbers adjacent</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.adjacent_same_resource}
                    onChange={() => toggleOption('adjacent_same_resource')}
                    className="mt-1 w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">Same Resource Can Touch</div>
                    <div className="text-xs text-neutral-600">Allow identical resources adjacent</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.resource_multiple_6_8}
                    onChange={() => toggleOption('resource_multiple_6_8')}
                    className="mt-1 w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">Resource Can Have 2+ of 6/8</div>
                    <div className="text-xs text-neutral-600">Allow resources multiple high numbers</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.desert_in_center}
                    onChange={() => toggleOption('desert_in_center')}
                    className="mt-1 w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">Desert Can Be in Center</div>
                    <div className="text-xs text-neutral-600">Allow desert in center position</div>
                  </div>
                </label>
              </div>

              <button
                onClick={regenerateBoard}
                className="btn-primary w-full text-lg"
              >
                🎲 Generate New Board
              </button>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Current Seed:</strong> {seed}
                </p>
              </div>
            </div>
          </div>

          {/* Board Display */}
          <div className="lg:col-span-2">
            <div className="card p-8 bg-gradient-to-br from-blue-100 to-cyan-100">
              <svg
                viewBox="-200 -200 400 400"
                className="w-full h-auto"
                style={{ maxHeight: '800px' }}
              >
                {board.map((hex, index) => {
                  const x = hexSize * Math.sqrt(3) * (hex.q + hex.r / 2)
                  const y = hexSize * 1.5 * hex.r

                  return (
                    <g key={index} transform={`translate(${x}, ${y})`}>
                      <Hexagon hex={hex} size={hexSize} />
                    </g>
                  )
                })}

                {/* Port indicators */}
                {ports.map((port, index) => {
                  // Calculate hex center position
                  const hexX = hexSize * Math.sqrt(3) * (port.q + port.r / 2)
                  const hexY = hexSize * 1.5 * port.r

                  // Calculate vertex position - must match hexagon vertex angles
                  const vertexAngle = (Math.PI / 3) * port.vertex - Math.PI / 6
                  const vertexX = hexX + hexSize * Math.cos(vertexAngle)
                  const vertexY = hexY + hexSize * Math.sin(vertexAngle)

                  return (
                    <g key={`port-${index}`} transform={`translate(${vertexX}, ${vertexY})`}>
                      <circle
                        r={12}
                        fill={port.type === '3:1' ? '#8B4513' : RESOURCE_COLORS[port.type as ResourceType]}
                        stroke="#000"
                        strokeWidth="2"
                      />
                      <text
                        textAnchor="middle"
                        dy="0.35em"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#FFF"
                      >
                        {port.type === '3:1' ? '3:1' : '2:1'}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="card p-6 mt-6">
              <h3 className="font-semibold text-neutral-900 mb-4 text-center">Resource Legend</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {Object.entries(RESOURCE_NAMES).map(([key, name]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded border-2 border-neutral-700"
                      style={{ backgroundColor: RESOURCE_COLORS[key as ResourceType] }}
                    />
                    <span className="text-sm text-neutral-700">{name}</span>
                  </div>
                ))}
              </div>

              {/* Probability Dots Info */}
              <div className="mt-6 pt-4 border-t border-neutral-200">
                <h4 className="font-semibold text-neutral-900 text-sm mb-2 text-center">Number Probability</h4>
                <p className="text-xs text-neutral-600 text-center">
                  Dots indicate dice roll probability: More dots = higher chance
                </p>
                <div className="flex justify-center gap-4 mt-3 text-xs text-neutral-700">
                  <span>6,8: •••••</span>
                  <span>5,9: ••••</span>
                  <span>4,10: •••</span>
                  <span>3,11: ••</span>
                  <span>2,12: •</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

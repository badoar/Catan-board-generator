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
  edge: number
  type: PortType
}

interface GenerationOptions {
  highNumbersCanTouch: boolean // 6 & 8 can touch
  lowNumbersCanTouch: boolean  // 2 & 12 can touch
  sameNumbersCanTouch: boolean
  sameResourceCanTouch: boolean
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

// Port placements (edge indices around the board)
const PORT_CONFIGS: { edge: number; type: PortType }[] = [
  { edge: 0, type: '3:1' },
  { edge: 1, type: 'wood' },
  { edge: 2, type: '3:1' },
  { edge: 3, type: 'brick' },
  { edge: 4, type: '3:1' },
  { edge: 5, type: 'wheat' },
  { edge: 6, type: '3:1' },
  { edge: 7, type: 'sheep' },
  { edge: 8, type: 'ore' },
]

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function getNeighbors(q: number, r: number): { q: number; r: number }[] {
  return [
    { q: q + 1, r: r },
    { q: q + 1, r: r - 1 },
    { q: q, r: r - 1 },
    { q: q - 1, r: r },
    { q: q - 1, r: r + 1 },
    { q: q, r: r + 1 },
  ]
}

function checkConstraints(hexes: Hex[], options: GenerationOptions): boolean {
  for (const hex of hexes) {
    const neighbors = getNeighbors(hex.q, hex.r)

    for (const neighborPos of neighbors) {
      const neighbor = hexes.find(h => h.q === neighborPos.q && h.r === neighborPos.r)
      if (!neighbor) continue

      // Check high numbers (6 & 8)
      if (!options.highNumbersCanTouch) {
        if ((hex.number === 6 || hex.number === 8) &&
            (neighbor.number === 6 || neighbor.number === 8)) {
          return false
        }
      }

      // Check low numbers (2 & 12)
      if (!options.lowNumbersCanTouch) {
        if ((hex.number === 2 || hex.number === 12) &&
            (neighbor.number === 2 || neighbor.number === 12)) {
          return false
        }
      }

      // Check same numbers
      if (!options.sameNumbersCanTouch) {
        if (hex.number !== null && hex.number === neighbor.number) {
          return false
        }
      }

      // Check same resource
      if (!options.sameResourceCanTouch) {
        if (hex.resource !== 'desert' && hex.resource === neighbor.resource) {
          return false
        }
      }
    }
  }
  return true
}

function generateBoard(options: GenerationOptions): Hex[] {
  let attempts = 0
  const maxAttempts = 1000

  while (attempts < maxAttempts) {
    const shuffledResources = shuffle(RESOURCES)
    const shuffledNumbers = shuffle(NUMBERS)

    const hexes: Hex[] = HEX_POSITIONS.map((pos, index) => {
      const resource = shuffledResources[index]
      const number = resource === 'desert' ? null : shuffledNumbers[shuffledNumbers.length - RESOURCES.filter(r => r !== 'desert').length + RESOURCES.slice(0, index).filter(r => r !== 'desert').length]

      return {
        ...pos,
        resource,
        number,
      }
    })

    // Assign numbers to non-desert hexes
    let numberIndex = 0
    for (const hex of hexes) {
      if (hex.resource !== 'desert') {
        hex.number = shuffledNumbers[numberIndex]
        numberIndex++
      }
    }

    if (checkConstraints(hexes, options)) {
      return hexes
    }

    attempts++
  }

  // If we couldn't generate a valid board, return anyway (user constraints might be impossible)
  return HEX_POSITIONS.map((pos, index) => ({
    ...pos,
    resource: shuffle(RESOURCES)[index],
    number: shuffle(RESOURCES)[index] === 'desert' ? null : shuffle(NUMBERS)[index % NUMBERS.length],
  }))
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
  const [options, setOptions] = useState<GenerationOptions>({
    highNumbersCanTouch: false,
    lowNumbersCanTouch: false,
    sameNumbersCanTouch: false,
    sameResourceCanTouch: false,
  })

  const [board, setBoard] = useState<Hex[]>(() => generateBoard(options))
  const [ports] = useState<Port[]>(() => shuffle(PORT_CONFIGS))

  const regenerateBoard = useCallback(() => {
    setBoard(generateBoard(options))
  }, [options])

  const hexSize = 50
  const hexWidth = hexSize * 2
  const hexHeight = hexSize * Math.sqrt(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold text-neutral-900 mb-4">
            Catan Board Generator
          </h1>
          <p className="text-xl text-neutral-600">
            Generate random, balanced boards for Settlers of Catan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
                Generation Options
              </h2>

              <div className="space-y-4 mb-6">
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.highNumbersCanTouch}
                    onChange={(e) => setOptions({ ...options, highNumbersCanTouch: e.target.checked })}
                    className="w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900">6 & 8 Can Touch</div>
                    <div className="text-sm text-neutral-600">Allow high-value numbers adjacent</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.lowNumbersCanTouch}
                    onChange={(e) => setOptions({ ...options, lowNumbersCanTouch: e.target.checked })}
                    className="w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900">2 & 12 Can Touch</div>
                    <div className="text-sm text-neutral-600">Allow low-value numbers adjacent</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.sameNumbersCanTouch}
                    onChange={(e) => setOptions({ ...options, sameNumbersCanTouch: e.target.checked })}
                    className="w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900">Same Numbers Can Touch</div>
                    <div className="text-sm text-neutral-600">Allow identical numbers adjacent</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.sameResourceCanTouch}
                    onChange={(e) => setOptions({ ...options, sameResourceCanTouch: e.target.checked })}
                    className="w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900">Same Resource Can Touch</div>
                    <div className="text-sm text-neutral-600">Allow identical resources adjacent</div>
                  </div>
                </label>
              </div>

              <button
                onClick={regenerateBoard}
                className="btn-primary w-full text-lg"
              >
                🎲 Generate New Board
              </button>
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
                  const angle = (index / ports.length) * Math.PI * 2
                  const distance = 180
                  const x = Math.cos(angle) * distance
                  const y = Math.sin(angle) * distance

                  return (
                    <g key={`port-${index}`} transform={`translate(${x}, ${y})`}>
                      <rect
                        x={-15}
                        y={-10}
                        width={30}
                        height={20}
                        fill={port.type === '3:1' ? '#8B4513' : RESOURCE_COLORS[port.type as ResourceType]}
                        stroke="#000"
                        strokeWidth="1"
                        rx={3}
                      />
                      <text
                        textAnchor="middle"
                        dy="0.35em"
                        fontSize="10"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import type { Note } from './types'

const DAY = 1000 * 60 * 60 * 24
const now = Date.now()
const daysAgo = (n: number, hoursAgo = 0) => now - n * DAY - hoursAgo * 1000 * 60 * 60

const travelImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e8b979"/>
      <stop offset="55%" stop-color="#d98c6b"/>
      <stop offset="100%" stop-color="#9a6a86"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3d4f6b"/>
      <stop offset="100%" stop-color="#232a3d"/>
    </linearGradient>
  </defs>
  <rect width="800" height="320" fill="url(#sky)"/>
  <circle cx="400" cy="230" r="70" fill="#f5e0b3" opacity="0.9"/>
  <rect y="300" width="800" height="200" fill="url(#sea)"/>
  <path d="M0 300 Q200 280 400 300 T800 300 V500 H0 Z" fill="#1b2230" opacity="0.6"/>
</svg>`)

interface Seed {
  title: string
  content: string
  image?: string | null
  createdDaysAgo: number
  modifiedHoursAgo?: number
  status?: 'active' | 'archived' | 'trashed'
}

const seeds: Seed[] = [
  {
    title: 'UX Research Ideas',
    content:
      '<p>Explore how AI can reduce repetitive UX research tasks — synthesis, tagging, and highlight reels from usability sessions.</p><p>Worth prototyping a workflow that turns raw session recordings into theme clusters automatically.</p>',
    createdDaysAgo: 1,
    modifiedHoursAgo: 2,
  },
  {
    title: 'Design System',
    content:
      '<p>Review typography tokens and spacing scale before the next release.</p><ul><li>Audit heading line-heights on dense screens</li><li>Confirm 8pt spacing scale is used consistently</li><li>Document elevation levels for dark mode</li></ul>',
    createdDaysAgo: 3,
    modifiedHoursAgo: 5,
  },
  {
    title: 'Weekend Plans',
    content:
      '<div class="motion-checklist"><div class="motion-check-item" data-checked="true"><input type="checkbox" checked /><span>Book hotel</span></div><div class="motion-check-item" data-checked="true"><input type="checkbox" checked /><span>Plan route</span></div><div class="motion-check-item" data-checked="false"><input type="checkbox" /><span>Check weather</span></div><div class="motion-check-item" data-checked="false"><input type="checkbox" /><span>Pack camera</span></div></div>',
    createdDaysAgo: 2,
    modifiedHoursAgo: 20,
  },
  {
    title: 'Product Ideas',
    content:
      '<p>Quick capture widget for the browser toolbar — save a link with one click and auto-title it.</p><p>See what similar tools do well: <a href="https://www.notion.so" target="_blank" rel="noopener noreferrer">notion.so</a></p><p>Also worth a look: keyboard-first command palette for power users.</p>',
    createdDaysAgo: 6,
    modifiedHoursAgo: 30,
  },
  {
    title: 'Meeting Notes — Q3 Planning',
    content:
      '<p><strong>Attendees:</strong> Design, Product, Eng leads</p><p><em>Decisions:</em></p><ol><li>Ship dark mode before the September review</li><li>Defer collaborative editing to Q4</li><li>Prioritize performance on the notes grid</li></ol>',
    createdDaysAgo: 4,
    modifiedHoursAgo: 3,
  },
  {
    title: 'AI Tools Worth Trying',
    content:
      '<ul><li>Transcription with automatic speaker labels</li><li>Summarization for long research docs</li><li>Local-first embeddings for search</li></ul><p>Follow up with the team on which ones fit our stack.</p>',
    createdDaysAgo: 8,
    modifiedHoursAgo: 60,
  },
  {
    title: 'Reading List',
    content:
      '<p>Articles queued for this week:</p><ul><li><a href="https://www.nngroup.com" target="_blank" rel="noopener noreferrer">nngroup.com</a> — usability heuristics refresher</li><li><a href="https://www.laws-of-ux.com" target="_blank" rel="noopener noreferrer">laws-of-ux.com</a></li><li><a href="https://increment.com" target="_blank" rel="noopener noreferrer">increment.com</a> — engineering culture issue</li></ul>',
    createdDaysAgo: 10,
    modifiedHoursAgo: 96,
  },
  {
    title: 'Travel — Coastal Trip',
    content:
      '<p>Photos and notes from the coast trip. Revisit for the travel journal draft.</p><p>Best light was right at sunset near the old pier.</p>',
    image: travelImage,
    createdDaysAgo: 14,
    modifiedHoursAgo: 200,
  },
  {
    title: 'Gift Ideas',
    content:
      '<div class="motion-checklist"><div class="motion-check-item" data-checked="false"><input type="checkbox" /><span>Notebook + pen set for Dad</span></div><div class="motion-check-item" data-checked="true"><input type="checkbox" checked /><span>Tea sampler for Priya</span></div><div class="motion-check-item" data-checked="false"><input type="checkbox" /><span>Board game for game night</span></div></div>',
    createdDaysAgo: 5,
    modifiedHoursAgo: 40,
  },
  {
    title: 'Book Recommendations',
    content:
      '<p>From the team book club thread — <strong>Thinking in Systems</strong> and <em>The Design of Everyday Things</em> both came up twice.</p>',
    createdDaysAgo: 20,
    modifiedHoursAgo: 300,
  },
  {
    title: 'Old Onboarding Draft',
    content:
      '<p>Early draft of the onboarding flow copy — superseded by the new activation project.</p>',
    createdDaysAgo: 40,
    modifiedHoursAgo: 900,
    status: 'archived',
  },
  {
    title: 'Duplicate Scratch Note',
    content: '<p>Accidental duplicate — safe to remove.</p>',
    createdDaysAgo: 12,
    modifiedHoursAgo: 250,
    status: 'trashed',
  },
]

export function buildSampleNotes(): Note[] {
  return seeds.map((seed, index) => {
    const createdAt = daysAgo(seed.createdDaysAgo)
    const updatedAt = seed.modifiedHoursAgo
      ? daysAgo(0, seed.modifiedHoursAgo)
      : createdAt
    return {
      id: `seed-${index}-${Math.random().toString(36).slice(2, 8)}`,
      title: seed.title,
      content: seed.content,
      image: seed.image ?? null,
      status: seed.status ?? 'active',
      order: index,
      createdAt,
      updatedAt: Math.max(updatedAt, createdAt),
    }
  })
}

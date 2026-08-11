import { AlertTriangle } from 'lucide-react'
import { Disclaimer } from '@/components/disclaimer'

const abcde = [
  { letter: 'A', term: 'Asymmetry', text: 'One half of the mole does not match the other half.' },
  { letter: 'B', term: 'Border', text: 'Edges are irregular, ragged, notched or blurred.' },
  { letter: 'C', term: 'Color', text: 'Color is uneven and may include shades of brown, black, or patches of pink, red, white or blue.' },
  { letter: 'D', term: 'Diameter', text: 'The spot is larger than about 6 mm (the size of a pencil eraser), though melanomas can be smaller.' },
  { letter: 'E', term: 'Evolution', text: 'The mole is changing in size, shape, color or elevation, or a new symptom such as bleeding or itching appears.' },
]

export default function AboutMelanomaPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">About Melanoma</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">
          Understanding melanoma and its warning signs can support earlier attention. This
          information is educational and is not medical advice.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">What is melanoma?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Melanoma is a type of skin cancer that develops in melanocytes — the cells that produce
            pigment. Although it is less common than some other skin cancers, it is more likely to
            spread to other parts of the body if it is not found and treated early.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Why early detection matters</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            When melanoma is identified at an early stage, it is often highly treatable. As it
            progresses and spreads, treatment becomes more complex. Regular skin checks and prompt
            professional evaluation of suspicious or changing lesions are key to early detection.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Common warning signs</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              'A new spot on the skin, or one that looks different from others',
              'A mole that changes in size, shape or color',
              'A sore that does not heal',
              'Itching, tenderness or pain in a lesion',
              'Spread of pigment beyond the border of a spot',
              'Bleeding, oozing or a raised, scaly surface',
            ].map((item) => (
              <li key={item} className="flex gap-2 rounded-lg bg-muted/60 px-3 py-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">The ABCDE rule</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A simple guide many clinicians use to remember common melanoma warning signs.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {abcde.map((item) => (
              <div key={item.letter} className="flex gap-3 rounded-xl border border-border p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary font-mono text-lg font-semibold text-primary-foreground">
                  {item.letter}
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{item.term}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-5">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
          <p className="text-sm font-medium leading-relaxed">
            Changes in a skin lesion should be evaluated by a qualified healthcare professional.
            MelanoScan is not a diagnostic authority.
          </p>
        </div>

        <Disclaimer />
      </div>
    </main>
  )
}

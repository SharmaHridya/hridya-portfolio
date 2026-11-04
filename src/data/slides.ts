// The pocket lecture in Beyond Code → The speaker: gradient descent in four slides.
// Each click draws in the next point, and the slide's diagram advances with it.

export type SlideDiagramKind = 'valley' | 'slope' | 'stepsize' | 'repeat'

export type Slide = {
  kicker: string
  title: string
  accent: string
  diagram: SlideDiagramKind
  items: { text: string; note?: string; action?: 'playground' }[]
}

export const slides: Slide[] = [
  {
    kicker: 'The problem',
    title: 'Finding the lowest point',
    accent: '#3657D6',
    diagram: 'valley',
    items: [
      { text: 'A model makes guesses', note: 'ŷ = θ₀ + θ₁·x' },
      { text: 'Cost measures how wrong', note: 'J(θ): the average squared error' },
      { text: 'Best θ = lowest cost', note: 'the bottom of the valley' },
    ],
  },
  {
    kicker: 'The idea',
    title: 'Feel the slope, step downhill',
    accent: '#F28B54',
    diagram: 'slope',
    items: [
      { text: 'Start anywhere', note: 'θ = 0 is fine' },
      { text: 'Measure the slope', note: 'the gradient ∂J/∂θ' },
      { text: 'Step against it', note: 'θ := θ − α · ∂J/∂θ' },
    ],
  },
  {
    kicker: 'The catch',
    title: 'Step size is everything',
    accent: '#B6A6D9',
    diagram: 'stepsize',
    items: [
      { text: 'Too small: it crawls', note: 'hundreds of tiny steps' },
      { text: 'Too big: it overshoots', note: 'bigger still and it diverges' },
      { text: 'Just right: it settles', note: 'a handful of steps' },
    ],
  },
  {
    kicker: 'The loop',
    title: 'Repeat until it stops moving',
    accent: '#202124',
    diagram: 'repeat',
    items: [
      { text: 'Each step lowers the cost' },
      { text: 'Steps shrink near the bottom', note: 'because the slope flattens' },
      { text: 'That’s how a model learns' },
      { text: 'Try it yourself', note: 'with real data, below', action: 'playground' },
    ],
  },
]

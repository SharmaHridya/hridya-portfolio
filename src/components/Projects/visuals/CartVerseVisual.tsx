import { AnimatePresence, motion } from 'framer-motion'
import { Lock, RotateCcw, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Frame } from './Frame'

const PRODUCTS = [
  { name: 'Desk lamp', price: 1299, tint: '#3657D6', stock: 3 },
  { name: 'Notebook set', price: 349, tint: '#F28B54', stock: 2 },
  { name: 'Headphones', price: 2499, tint: '#B6A6D9', stock: 1 },
]

/** A playable miniature storefront: adding the last unit shows the stock lock CartVerse relies on. */
export function CartVerseVisual() {
  const [stock, setStock] = useState(PRODUCTS.map((p) => p.stock))
  const [cart, setCart] = useState(0)
  const [toast, setToast] = useState<string | null>(null)

  const add = (i: number) => {
    if (stock[i] === 0) {
      setToast(`${PRODUCTS[i].name}: sold out. The row was locked, so no one oversold it.`)
      return
    }
    setStock((s) => s.map((v, k) => (k === i ? v - 1 : v)))
    setCart((c) => c + 1)
    setToast(stock[i] === 1 ? `Last ${PRODUCTS[i].name.toLowerCase()} reserved with SELECT … FOR UPDATE` : null)
  }

  const reset = () => {
    setStock(PRODUCTS.map((p) => p.stock))
    setCart(0)
    setToast(null)
  }

  return (
    <Frame title="cartverse · storefront" note="Try it">
      <div className="flex h-full flex-col bg-paper p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display text-lg font-bold tracking-tight">
            Cart<span className="text-cobalt">Verse</span>
          </span>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="rounded-full p-1.5 text-muted hover:bg-line" aria-label="Reset demo store">
              <RotateCcw className="size-3.5" aria-hidden />
            </button>
            <span className="relative grid size-8 place-items-center rounded-full bg-ink text-paper" aria-label={`${cart} items in cart`}>
              <ShoppingBag className="size-4" aria-hidden />
              <AnimatePresence>
                <motion.span
                  key={cart}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-tangerine font-mono text-[0.6rem] text-ink"
                >
                  {cart}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2.5">
          {PRODUCTS.map((p, i) => (
            <div key={p.name} className="flex min-h-0 flex-col rounded-xl border border-line bg-card p-2">
              <div className="relative min-h-16 flex-1 rounded-lg" style={{ background: `${p.tint}22` }}>
                <span className="absolute top-1/2 left-1/2 aspect-square h-[56%] max-h-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: p.tint, opacity: 0.85 }} aria-hidden />
                {stock[i] === 0 && (
                  <span className="absolute inset-0 grid place-items-center rounded-lg bg-ink/60 font-mono text-[0.6rem] text-paper">SOLD OUT</span>
                )}
              </div>
              <p className="mt-2 truncate text-[0.72rem] font-medium">{p.name}</p>
              <p className="font-mono text-[0.65rem] text-muted">₹{p.price.toLocaleString('en-IN')}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className={`font-mono text-[0.6rem] ${stock[i] <= 1 ? 'text-[#a2491a]' : 'text-muted'}`}>
                  {stock[i] === 0 ? '0 left' : `${stock[i]} left`}
                </span>
                <button
                  onClick={() => add(i)}
                  className="rounded-full bg-ink px-2 py-0.5 text-[0.65rem] text-paper transition-colors hover:bg-cobalt"
                  aria-label={`Add ${p.name} to cart`}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 h-8" aria-live="polite">
          <AnimatePresence mode="wait">
            {toast && (
              <motion.p
                key={toast}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 font-mono text-[0.65rem] text-cobalt-deep"
              >
                <Lock className="size-3 shrink-0" aria-hidden /> {toast}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Frame>
  )
}

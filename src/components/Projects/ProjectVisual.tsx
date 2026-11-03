import type { ProjectVisualKind } from '../../data/projects'
import { CartVerseVisual } from './visuals/CartVerseVisual'
import { HeatmapVisual } from './visuals/HeatmapVisual'
import { HsnVisual } from './visuals/HsnVisual'
import { InkwellVisual } from './visuals/InkwellVisual'
import { NetworkVisual } from './visuals/NetworkVisual'

const VISUALS: Record<ProjectVisualKind, () => React.JSX.Element> = {
  cartverse: CartVerseVisual,
  inkwell: InkwellVisual,
  heatmap: HeatmapVisual,
  hsn: HsnVisual,
  network: NetworkVisual,
}

export function ProjectVisual({ kind }: { kind: ProjectVisualKind }) {
  const Visual = VISUALS[kind]
  return <Visual />
}

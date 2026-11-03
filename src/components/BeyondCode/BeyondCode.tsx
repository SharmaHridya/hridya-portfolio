import { SectionHeader } from '../ui/SectionHeader'
import { Debater } from './Debater'
import { RabbitHoles } from './RabbitHoles'
import { Speaker } from './Speaker'

export function BeyondCode() {
  return (
    <section id="beyond" aria-labelledby="beyond-title" className="relative overflow-hidden border-t border-line bg-[#efeaf7]/60 py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          id="beyond-title"
          number="06"
          label="Beyond code"
          title={
            <>
              There’s more to me than <span className="serif-italic text-cobalt">just code.</span>
            </>
          }
          intro={<p>The speaker, the debater and the curious one: different dimensions of the same person who builds the software.</p>}
        />
        <Speaker />
        <Debater />
        <RabbitHoles />
      </div>
    </section>
  )
}

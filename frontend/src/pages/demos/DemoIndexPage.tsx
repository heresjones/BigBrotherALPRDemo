import { PageHeader, PageContent } from "../../components/Page";
import { ScenarioCard } from "../../components/ScenarioUI";
import { SCENARIOS } from "../../data/scenarios";

const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

export default function DemoIndexPage() {
  const count = COUNT_WORDS[SCENARIOS.length] ?? String(SCENARIOS.length);
  return (
    <>
      <PageHeader
        title="Scenario Library"
        lead={`${count[0].toUpperCase()}${count.slice(1)} interactive walkthroughs — each takes an ordinary-looking action and shows it becoming consequential once the system scales, makes a mistake, or is misused. All data is fictional.`}
      />
      <PageContent>
        <div className="row">
          {SCENARIOS.map((s, i) => (
            <ScenarioCard key={s.slug} slug={s.slug} index={i + 1} title={s.title} concern={s.concern} reveal={s.reveal} />
          ))}
        </div>
      </PageContent>
    </>
  );
}

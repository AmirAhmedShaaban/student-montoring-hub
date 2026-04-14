import { Accordion, AccordionItem, Card } from "./HelpUI";

function FaqItem({ item, defaultOpen = false }) {
  return (
    <AccordionItem id={item.id} title={item.question} defaultOpen={defaultOpen}>
      {item.answer}
    </AccordionItem>
  );
}

function FaqAccordion({ items }) {
  return (
    <Card
      id="help-faqs"
      title="Frequently asked questions"
      description="Start here for the questions teachers and administrators ask most often."
    >
      {items.length > 0 ? (
        <Accordion>
          {items.map((item, index) => (
            <FaqItem key={item.id} item={item} defaultOpen={index === 0} />
          ))}
        </Accordion>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm leading-6 text-slate-600">
          No FAQ matches your search. Try a different keyword or clear the
          filter.
        </div>
      )}
    </Card>
  );
}

export { FaqItem };
export default FaqAccordion;

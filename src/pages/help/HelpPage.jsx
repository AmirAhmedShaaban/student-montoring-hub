import { useEffect, useMemo, useState } from "react";
import { helpMockData } from "../../mocks/help.mock";
import HelpFooter from "./components/HelpFooter";
import FaqAccordion from "./components/FaqAccordion";
import HelpHero from "./components/HelpHero";
import HelpSearchBar from "./components/HelpSearchBar";

function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFaqId, setActiveFaqId] = useState(helpMockData.faqs[0]?.id ?? null);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredFaqs = useMemo(() => {
    if (!normalizedSearch) {
      return helpMockData.faqs;
    }

    return helpMockData.faqs.filter((item) => {
      return [item.question, item.answer]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [normalizedSearch]);

  useEffect(() => {
    setActiveFaqId(filteredFaqs[0]?.id ?? null);
  }, [filteredFaqs]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFaqToggle = (faqId) => {
    setActiveFaqId((currentFaqId) => (currentFaqId === faqId ? null : faqId));
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:gap-8">
      <HelpHero
        title={helpMockData.hero.title}
        subtitle={helpMockData.hero.subtitle}
        note={helpMockData.hero.note}
      />

      <HelpSearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={helpMockData.search.placeholder}
      />

      <FaqAccordion
        items={filteredFaqs}
        activeId={activeFaqId}
        onToggle={handleFaqToggle}
      />

      <HelpFooter
        note={helpMockData.footer.note}
        responseTime={helpMockData.footer.responseTime}
        supportEmail={helpMockData.footer.supportEmail}
        supportPhone={helpMockData.footer.supportPhone}
        supportHours={helpMockData.footer.supportHours}
      />
    </div>
  );
}

export default HelpPage;

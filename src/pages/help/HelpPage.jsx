import { useMemo, useState } from "react";
import { helpMockData } from "../../mocks/help.mock";
import HelpFooter from "./components/HelpFooter";
import FaqAccordion from "./components/FaqAccordion";
import HelpHero from "./components/HelpHero";
import HelpQuickLinks from "./components/HelpQuickLinks";
import HelpSearchBar from "./components/HelpSearchBar";
import SupportTicketCard from "./components/SupportTicketCard";

function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ticketDraft, setTicketDraft] = useState({ subject: "", message: "" });
  const [ticketConfirmation, setTicketConfirmation] = useState("");

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredQuickLinks = useMemo(() => {
    if (!normalizedSearch) {
      return helpMockData.quickLinks;
    }

    return helpMockData.quickLinks.filter((item) => {
      return [item.title, item.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [normalizedSearch]);

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubjectChange = (event) => {
    if (ticketConfirmation) {
      setTicketConfirmation("");
    }

    setTicketDraft((currentDraft) => ({
      ...currentDraft,
      subject: event.target.value,
    }));
  };

  const handleMessageChange = (event) => {
    if (ticketConfirmation) {
      setTicketConfirmation("");
    }

    setTicketDraft((currentDraft) => ({
      ...currentDraft,
      message: event.target.value,
    }));
  };

  const handleTicketSubmit = (event) => {
    event.preventDefault();

    const subject = ticketDraft.subject.trim();
    const message = ticketDraft.message.trim();

    if (!subject || !message) {
      setTicketConfirmation(
        "Please add both a subject and a message before submitting.",
      );
      return;
    }

    setTicketConfirmation(helpMockData.supportTicket.confirmation);
    setTicketDraft({ subject: "", message: "" });
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

      <HelpQuickLinks items={filteredQuickLinks} />

      <FaqAccordion items={filteredFaqs} />

      <SupportTicketCard
        title={helpMockData.supportTicket.title}
        description={helpMockData.supportTicket.description}
        subject={ticketDraft.subject}
        message={ticketDraft.message}
        onSubjectChange={handleSubjectChange}
        onMessageChange={handleMessageChange}
        onSubmit={handleTicketSubmit}
        subjectLabel={helpMockData.supportTicket.subjectLabel}
        subjectPlaceholder={helpMockData.supportTicket.subjectPlaceholder}
        messageLabel={helpMockData.supportTicket.messageLabel}
        messagePlaceholder={helpMockData.supportTicket.messagePlaceholder}
        submitLabel={helpMockData.supportTicket.submitLabel}
        confirmation={ticketConfirmation}
        note="Support requests are reviewed by the school help desk and prioritized by urgency."
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

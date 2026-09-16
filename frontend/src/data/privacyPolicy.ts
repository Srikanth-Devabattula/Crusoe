import { CONTACT_EMAIL } from "@/data/contactPage";
import { SITE_NAME } from "@/constants";

/** Edit this file to update the Privacy Policy page content. */
export const privacyPolicyContent = {
  title: "Privacy Policy",
  lastUpdated: "August 13, 2026",
  intro: `${SITE_NAME} ("we", "us", or "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard personal information when you visit our website, contact us, apply for careers, or use our services.`,
  contactNote: `If you have questions about this policy or wish to exercise your privacy rights, contact us at ${CONTACT_EMAIL}.`,
  sections: [
    {
      id: "information-we-collect",
      title: "Information We Collect",
      paragraphs: [
        "We may collect information that you provide directly to us, information collected automatically when you use our website, and information received from third parties where permitted by law.",
      ],
      bullets: [
        "Contact details such as name, email address, phone number, and company name when you submit enquiry or contact forms.",
        "Careers information such as résumé/CV, cover letter, work history, and other details you provide when applying for a role.",
        "Communications you send to us, including support requests and feedback.",
        "Technical data such as IP address, browser type, device information, pages visited, and approximate location derived from IP.",
      ],
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      paragraphs: [
        "We use personal information for legitimate business purposes, including:",
      ],
      bullets: [
        "Responding to enquiries, providing quotes, and delivering our software quality, engineering, and development services.",
        "Processing job applications and managing recruitment.",
        "Operating, maintaining, and improving our website and user experience.",
        "Sending service-related communications and, where permitted, marketing updates.",
        "Complying with legal obligations, enforcing our terms, and protecting our rights and the security of our users.",
      ],
    },
    {
      id: "legal-bases",
      title: "Legal Basis for Processing",
      paragraphs: [
        "Where applicable, we process personal data based on your consent, the performance of a contract or steps prior to entering a contract, our legitimate interests in running and improving our business, and compliance with legal obligations.",
      ],
    },
    {
      id: "sharing",
      title: "How We Share Information",
      paragraphs: [
        "We do not sell your personal information. We may share information with:",
      ],
      bullets: [
        "Service providers who assist with hosting, email delivery, analytics, recruitment tools, and IT support, under appropriate confidentiality obligations.",
        "Professional advisers such as lawyers, auditors, or insurers where necessary.",
        "Authorities or third parties when required by law, court order, or to protect rights, safety, and security.",
        "Successors in the event of a merger, acquisition, or business transfer, subject to this policy.",
      ],
    },
    {
      id: "retention",
      title: "Data Retention",
      paragraphs: [
        "We retain personal information only for as long as necessary to fulfil the purposes described in this policy, unless a longer retention period is required or permitted by law. Enquiry and application records are typically retained for the period needed to manage the relationship or recruitment process, after which they may be archived or securely deleted.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We implement appropriate technical and organisational measures designed to protect personal information against unauthorised access, alteration, disclosure, or destruction. No method of transmission over the internet or electronic storage is completely secure; we cannot guarantee absolute security.",
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights",
      paragraphs: [
        "Depending on your location, you may have rights to access, correct, delete, restrict, or object to certain processing of your personal information, and to withdraw consent where processing is consent-based. To make a request, contact us using the details below. We may need to verify your identity before responding.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      paragraphs: [
        `${SITE_NAME} does not use cookies for analytics, advertising, or tracking on this website. We do not place marketing or third-party tracking cookies on our public pages. If our practices change, we will update this Privacy Policy accordingly.`,
      ],
    },
    {
      id: "third-party-links",
      title: "Third-Party Links",
      paragraphs: [
        "Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies before providing personal information.",
      ],
    },
    {
      id: "children",
      title: "Children's Privacy",
      paragraphs: [
        "Our services and website are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us so we can delete it.",
      ],
    },
    {
      id: "international",
      title: "International Transfers",
      paragraphs: [
        "We are based in India and may process information in India or other countries where we or our service providers operate. Where required, we take steps to ensure appropriate safeguards for cross-border transfers.",
      ],
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The \"Last updated\" date at the top of this page indicates when the policy was last revised. Material changes may be communicated through our website or other appropriate channels.",
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      paragraphs: [
        `For privacy-related questions or requests, email ${CONTACT_EMAIL} or write to us at our registered offices listed on the Contact page.`,
      ],
    },
  ],
} as const;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeDropdown from "./dropdown/ThemeDropdown";
import { TbDownload } from "react-icons/tb";
import ResumePDF from "../uploads/Resume.pdf";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaCode,
  FaBriefcase,
  FaUserGraduate,
  FaRocket,
  FaUser,
  FaProjectDiagram,
  FaCertificate
} from "react-icons/fa";

// ── Typing card data ──────────────────────────────────────────
const FIXED_TITLE = "Full Stack Developer";

const phases = [
  {
    label: "Frontend Technologies",
    items: ["React & Redux", "TypeScript", "HTML & CSS", "Tailwind CSS"],
  },
  {
    label: "Backend Technologies",
    items: ["Node.js & Express.js", "PHP", "MySQL & MongoDB", "REST APIs"],
  },
  {
    label: "Projects",
    items: [
      "Vibe Chat – MERN + Redux",
      "Web Apps – PHP + MySQL",
      "Phone Theft Detection App",
      "Portfolio Website",
    ],
  },
];

function SkillsTypingCard() {
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [titleDone, setTitleDone]           = useState(false);
  const [phaseIndex, setPhaseIndex]         = useState(0);
  const [displayedLabel, setDisplayedLabel] = useState("");
  const [items, setItems]                   = useState([]); // { text, done }[]
  const [stage, setStage]                   = useState("label");

  // ── Type the fixed title once ────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let ti = 0;
    const typeTitle = () => {
      if (cancelled) return;
      ti++;
      setDisplayedTitle(FIXED_TITLE.slice(0, ti));
      if (ti < FIXED_TITLE.length) {
        setTimeout(typeTitle, 68);
      } else {
        setTitleDone(true);
      }
    };
    const init = setTimeout(typeTitle, 300);
    return () => { cancelled = true; clearTimeout(init); };
  }, []);

  // ── Cycle phases once title is done ─────────────────────────
  useEffect(() => {
    if (!titleDone) return;
    const phase = phases[phaseIndex];
    let cancelled = false;

    setDisplayedLabel("");
    setItems([]);
    setStage("label");

    let itemIdx = 0;

    const typeItems = () => {
      if (cancelled) return;
      setStage("items");

      if (itemIdx >= phase.items.length) {
        setTimeout(() => {
          if (!cancelled) setPhaseIndex(p => (p + 1) % phases.length);
        }, 2000);
        return;
      }

      const targetText = phase.items[itemIdx];

      // Add the item to the DOM immediately (empty text + cursor visible)
      // so the motion.li slide-in plays ONCE, then typing fills it in-place.
      setItems(prev => [...prev, { text: "", done: false }]);

      let ci = 0;
      const typeChar = () => {
        if (cancelled) return;
        ci++;
        const sliced = targetText.slice(0, ci);
        // Update in-place — same DOM node, no remount, no flicker
        setItems(prev => {
          const next = [...prev];
          next[next.length - 1] = { text: sliced, done: false };
          return next;
        });
        if (ci < targetText.length) {
          setTimeout(typeChar, 48);
        } else {
          // Commit: hide cursor, same DOM node
          setTimeout(() => {
            if (cancelled) return;
            setItems(prev => {
              const next = [...prev];
              next[next.length - 1] = { text: targetText, done: true };
              return next;
            });
            itemIdx++;
            setTimeout(typeItems, 150);
          }, 210);
        }
      };
      // Small delay so React renders the new item (slide-in starts) before typing
      setTimeout(typeChar, 20);
    };

    let li = 0;
    const typeLabel = () => {
      if (cancelled) return;
      li++;
      setDisplayedLabel(phase.label.slice(0, li));
      if (li < phase.label.length) {
        setTimeout(typeLabel, 55);
      } else {
        setTimeout(typeItems, 320);
      }
    };

    const init = setTimeout(typeLabel, 200);
    return () => { cancelled = true; clearTimeout(init); };
  }, [titleDone, phaseIndex]);

  return (
    
    <div
      className="backdrop-blur-lg border rounded-3xl p-8 pt-10 min-h-[420px] flex flex-col justify-start items-start"
      style={{ backgroundColor: "var(--portfolio-card-bg)", borderColor: "var(--portfolio-accent-border)", boxShadow: "0 0 40px var(--portfolio-shadow)" }}
    >
      {/* Fixed title – typed once, stays forever */}
      <h3 className="text-2xl font-bold flex items-center gap-1 min-h-[2rem]" style={{ color: "var(--portfolio-accent)" }}>
        {displayedTitle}
        {!titleDone && (
          <span className="inline-block w-[2px] h-6 ml-0.5 animate-pulse" style={{ backgroundColor: "var(--portfolio-accent)" }} />
        )}
      </h3>

      {/* Divider */}
      {titleDone && (
        <div className="w-full h-px mt-4 mb-3" style={{ backgroundColor: "var(--portfolio-accent-border)" }} />
      )}

      {/* Cycling section – label + items */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phaseIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          exit   ={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full"
        >
          {/* Section label */}
          <p className="text-xs tracking-widest uppercase mb-3 flex items-center gap-1" style={{ color: "var(--portfolio-accent)" }}>
            {displayedLabel}
            {stage === "label" && titleDone && (
              <span className="inline-block w-[2px] h-3.5 animate-pulse" style={{ backgroundColor: "var(--portfolio-accent)" }} />
            )}
          </p>

          {/* Items – single DOM node per item, no swap, no flicker */}
          <ul className="space-y-3 w-full">
            {items.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1,  x: 0   }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 text-sm" style={{ color: "var(--portfolio-subtext)" }}
              >
                <span className="text-xs" style={{ color: "var(--portfolio-accent)" }}>▸</span>
                {item.text}
                {!item.done && (
                  <span className="inline-block w-[2px] h-4 ml-0.5 animate-pulse" style={{ backgroundColor: "var(--portfolio-accent)" }} />
                )}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div className={`relative group h-full ${className}`}>
      <div
        className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-100 glass-glow rounded-3xl"
        style={{ backgroundColor: "var(--portfolio-accent-light)" }}
      ></div>
      <div
        className="relative h-full backdrop-blur-lg border rounded-3xl p-6 glass-hover"
        style={{ backgroundColor: "var(--portfolio-card-bg)", borderColor: "var(--portfolio-accent-border)" }}
      >
        {children}
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function App({ theme = "violet", onThemeChange }) {
  return (
    <div
      data-theme={theme === "yellow" ? "yellow" : undefined}
      className="min-h-screen overflow-hidden relative"
      style={{ backgroundColor: "var(--portfolio-bg)", color: "var(--portfolio-text)", transition: "background-color 0.4s ease, color 0.4s ease" }}
    >

      {/* Background Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 blur-[150px] rounded-full" style={{ backgroundColor: "var(--portfolio-glow1)" }}></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 blur-[150px] rounded-full" style={{ backgroundColor: "var(--portfolio-glow2)" }}></div>

      <div className="max-w-7xl mx-auto px-10 py-10 relative z-10">

        {/* HERO SECTION */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-10 items-center"
        >

          <div>
<div className="flex items-center gap-4 flex-wrap">
  <span className="hover-pop inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white cursor-default" style={{ backgroundColor: "var(--portfolio-badge-bg)" }}>
    <FaRocket />
    Open to Opportunities
  </span>
                <a
                href={ResumePDF}
                download="Resume.pdf"
                className="flex items-center gap-2 px-4 py-2 rounded-full transition hover:opacity-80"
                style={{ backgroundColor: "var(--portfolio-accent-light)", color: "var(--portfolio-accent)", border: "1px solid var(--portfolio-accent-border)" }}
              >
                <TbDownload size={16} />
                Resume
              </a>

  <ThemeDropdown onThemeChange={onThemeChange} />
</div>

            <h1 className="text-7xl font-extrabold mt-6 leading-tight" style={{ color: "var(--portfolio-heading)" }}>
              Santhosh 
              <span className="block" style={{ color: "var(--portfolio-accent)" }}>
                Sivan H
              </span>
            </h1>

            <h2 className="text-3xl mt-5 font-semibold" style={{ color: "var(--portfolio-heading)" }}>
              Full Stack Developer
            </h2>

            <p className="mt-4 leading-8 max-w-xl" style={{ color: "var(--portfolio-subtext)" }}>
              Full Stack Developer specializing in React, Node.js,
              TypeScript, Redux and scalable backend development.
            </p>

            {/* Contact */}
            <div className="flex flex-wrap gap-4 mt-6">
              <span className="px-4 py-2 rounded-full flex items-center gap-2 cursor-default" style={{ backgroundColor: "var(--portfolio-pill-bg)" }}>
                <FaPhoneAlt />
                +91 9025427271
              </span>

              <span className="px-4 py-2 rounded-full flex items-center gap-2 cursor-default" style={{ backgroundColor: "var(--portfolio-pill-bg)" }}>
                <FaEnvelope />
                ssivan361@gmail.com
              </span>

              <span className="px-4 py-2 rounded-full flex items-center gap-2 cursor-default" style={{ backgroundColor: "var(--portfolio-pill-bg)" }}>
                <FaMapMarkerAlt />
                Madurai, Tamil Nadu
              </span>

              {/* <a
                href="/uploads/Resume.pdf"
                download
                className="flex items-center gap-2 px-4 py-2 rounded-full transition hover:opacity-80"
                style={{ backgroundColor: "var(--portfolio-accent-light)", color: "var(--portfolio-accent)", border: "1px solid var(--portfolio-accent-border)" }}
              >
                <TbDownload size={16} />
                Resume
              </a> */}

              <a
                href="https://github.com/SanthoshSivan11"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: "var(--portfolio-pill-bg)", color: "var(--portfolio-text)" }}
              >
                <FaGithub style={{ color: "var(--portfolio-accent)" }} />
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/santhosh-sivan-h-589801274/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: "var(--portfolio-pill-bg)", color: "var(--portfolio-text)" }}
              >
                <FaLinkedin style={{ color: "var(--portfolio-accent)" }} />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Hero Right Card */}
          <div className="relative rotate-[-8deg]">
            <SkillsTypingCard />
          </div>
        </motion.section>

        {/* PROFESSIONAL SUMMARY */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-15"
        >
          <h2 className="text-4xl font-bold flex items-center gap-3 mb-6" style={{ color: "var(--portfolio-heading)" }}>
            <FaUser style={{ color: "var(--portfolio-accent)" }} />
            Professional Summary
          </h2>

          <GlassCard>
            <p className="leading-8" style={{ color: "var(--portfolio-subtext)" }}>
              Aspiring Full Stack Developer with hands-on experience in
              React, Node.js, and Java, skilled in building responsive
              web applications and scalable backend systems.
              Strong in problem-solving, REST APIs, and database management.
            </p>
          </GlassCard>
        </motion.section>

        {/* TECHNICAL SKILLS */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-15"
        >
          <h2 className="text-4xl font-bold flex items-center gap-3 mb-6" style={{ color: "var(--portfolio-heading)" }}>
            <FaCode style={{ color: "var(--portfolio-accent)" }} />
            Technical Skills
          </h2>

          <GlassCard>
            <div className="space-y-4" style={{ color: "var(--portfolio-subtext)" }}>
              <p><strong>Languages:</strong> Java, JavaScript, TypeScript, PHP</p>
              <p><strong>Frontend:</strong> HTML, CSS, Tailwind CSS, React, Redux</p>
              <p><strong>Backend:</strong> Node.js, Express.js, PHP</p>
              <p><strong>Database:</strong> MySQL, MongoDB</p>
              <p><strong>Tools & Testing:</strong> Git, GitHub, Apache JMeter</p>
              <p><strong>Documentation:</strong> Microsoft Word, PowerPoint</p>
            </div>
          </GlassCard>
        </motion.section>

        {/* EXPERIENCE */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-15"
        >
          <h2 className="text-4xl font-bold flex items-center gap-3 mb-6" style={{ color: "var(--portfolio-heading)" }}>
            <FaBriefcase style={{ color: "var(--portfolio-accent)" }} />
            Experience
          </h2>

          <GlassCard>
            <h3 className="text-2xl font-semibold" style={{ color: "var(--portfolio-heading)" }}>
              Frontend Developer – Warely Software Pvt. Ltd.
            </h3>

            <p className="mt-2" style={{ color: "var(--portfolio-accent)" }}>
              Aug 2025 – Present
            </p>

            <ul className="list-disc ml-6 mt-5 space-y-3" style={{ color: "var(--portfolio-subtext)" }}>
              <li>Developed UI features for Singapore-based POS system</li>
              <li>Worked on Food Delivery applications</li>
              <li>Built Digital Ordering systems</li>
              <li>Worked on Support Chat systems</li>
              <li>Integrated REST APIs</li>
              <li>Resolved production issues</li>
              <li>Handled deployments and feature updates</li>
            </ul>
          </GlassCard>
        </motion.section>

        {/* INTERNSHIP + CERTIFICATIONS */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-15"
        >
  <h2 className="text-4xl font-bold flex items-center gap-3 mb-10" style={{ color: "var(--portfolio-heading)" }}>
    <FaCertificate style={{ color: "var(--portfolio-accent)" }} />
    Internship & Certifications
  </h2>

  <div className="grid md:grid-cols-2 gap-8">
    
    {/* Internship */}
    <GlassCard>
      <h3 className="text-2xl font-semibold mb-4" style={{ color: "var(--portfolio-heading)" }}>
        Internship
      </h3>
      <ul className="list-disc ml-6 space-y-3" style={{ color: "var(--portfolio-subtext)" }}>
        <li>Java Full Stack Internship – Wipro (May 2024 – Sep 2024)</li>
        <li>Web Development Certificate – InternPe</li>
      </ul>
    </GlassCard>

    {/* Certifications */}
    <GlassCard>
      <h3 className="text-2xl font-semibold mb-4" style={{ color: "var(--portfolio-heading)" }}>
        Certifications
      </h3>
      <ul className="list-disc ml-6 space-y-3" style={{ color: "var(--portfolio-subtext)" }}>
        <li>Oracle Java Explorer Badge – Oracle MyLearn</li>
        <li>Network Essentials Certification – Cisco</li>
        <li>Full Stack Development Certificate – Novitech</li>
      </ul>
    </GlassCard>

  </div>
</motion.section>

        {/* PROJECTS */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-15"
        >
          <h2 className="text-4xl font-bold flex items-center gap-3 mb-6" style={{ color: "var(--portfolio-heading)" }}>
            <FaProjectDiagram style={{ color: "var(--portfolio-accent)" }} />
            Projects
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <GlassCard>
              <h3 className="text-xl font-semibold" style={{ color: "var(--portfolio-heading)" }}>
                Vibe Chat – MERN + Redux
              </h3>
              <ul className="list-disc ml-5 mt-4 space-y-2" style={{ color: "var(--portfolio-subtext)" }}>
                <li>Built social media platform</li>
                <li>Real-time chat system</li>
                <li>Friend request system</li>
                <li>Story upload</li>
                <li>Post sharing</li>
                <li>Daily to-do feature</li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xl font-semibold" style={{ color: "var(--portfolio-heading)" }}>
                Online Grocery Management System (PHP + MySQL)
              </h3>
              <ul className="list-disc ml-5 mt-4 space-y-2" style={{ color: "var(--portfolio-subtext)" }}>
                <li>User management</li>
                <li>Product CRUD operations</li>
                <li>Order placement</li>
                <li>Order tracking</li>
                <li>Admin order management</li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xl font-semibold" style={{ color: "var(--portfolio-heading)" }}>
                Course Registration Platform (PHP + MySQL)
              </h3>
              <ul className="list-disc ml-5 mt-4 space-y-2" style={{ color: "var(--portfolio-subtext)" }}>
                <li>Course enrollment</li>
                <li>Course CRUD operations</li>
                <li>Course approval workflow (Accept / Reject / Pending)</li>
                <li>User-course management</li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xl font-semibold" style={{ color: "var(--portfolio-heading)" }}>
                Mobile Phone Theft Detection App
              </h3>
              <ul className="list-disc ml-5 mt-4 space-y-2" style={{ color: "var(--portfolio-subtext)" }}>
                <li>GPS tracking</li>
                <li>Photo capture</li>
                <li>Audio recording</li>
                <li>Automatic email alerts</li>
              </ul>
            </GlassCard>
          </div>
        </motion.section>

        {/* EDUCATION */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-15"
        >
          <h2 className="text-4xl font-bold flex items-center gap-3 mb-6" style={{ color: "var(--portfolio-heading)" }}>
            <FaUserGraduate style={{ color: "var(--portfolio-accent)" }} />
            Education
          </h2>

          <GlassCard>
            <div className="space-y-4" style={{ color: "var(--portfolio-subtext)" }}>
              <p>
                <strong>B.E CSE:</strong> Anna University Regional Campus Madurai
                (2022–2025) | CGPA: 8.1
              </p>

              <p>
                <strong>Diploma CSE:</strong> Tamil Nadu Government Polytechnic
                College (2019–2022) | 94.3%
              </p>

              <p>
                <strong>SSLC:</strong> Swathi Matriculation School
                (2018–2019) | 81.6%
              </p>
            </div>
          </GlassCard>
        </motion.section>


      </div>
    </div>
  );
}
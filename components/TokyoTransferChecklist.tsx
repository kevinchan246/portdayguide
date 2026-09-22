"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./TokyoTransferChecklist.module.css";

const canonicalUrl = "https://portdayguide.com/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal";
const shareUrl = `${canonicalUrl}?utm_source=checklist&utm_medium=shared_link&utm_campaign=tokyo_embarkation#tokyo-transfer-checklist`;
const terminalUrl = "https://www.city.yokohama.lg.jp/lang/overseas/port/cruise/terminal_info.html";
const checks = [
  { title: "Match the terminal to your cruise documents", detail: "Save the terminal name, address and assigned berth. Yokohama Station is not your cruise terminal." },
  { title: "Write down the arrival window and final check-in time", detail: "Plan around your cruise line’s instructions, not the ship’s departure time. Check again before leaving Tokyo." },
  { title: "Count everyone and every bag", detail: "Confirm passenger seats, suitcase capacity, child seats and any mobility assistance with the transfer provider." },
  { title: "Confirm the complete hotel-to-terminal route", detail: "Include hotel checkout, station access, changes and the final walk or vehicle. Allow room for delays within your arrival window." },
  { title: "For a booked car, confirm pickup and the full price", detail: "Check the hotel entrance, pickup time, exact terminal, tolls, waiting, cancellation terms and driver contact." },
  { title: "Keep documents and contacts available offline", detail: "Have boarding documents, the cruise line’s contact, the route or pickup instructions, and a backup transport option." },
];

function TerminalReference() {
  return <div className={styles.terminals}>
    <h3>Confirm one of these destinations</h3>
    <dl>
      <div><dt>Osanbashi</dt><dd>Yokohama International Passenger Terminal<br />1-1-4 Kaigandori, Naka-ku<br /><span>Nihon-odori station, then the terminal approach.</span></dd></div>
      <div><dt>Shinko Pier</dt><dd>Shinko Pier Cruise Terminal<br />2-11-4 Shinko, Naka-ku<br /><span>Bashamichi station, then the terminal approach.</span></dd></div>
      <div><dt>Daikoku Pier</dt><dd>Daikoku Pier Cruise Terminal<br />13 Daikoku-Futo, Tsurumi-ku<br /><span>Arrange the final vehicle leg. Carry boarding documents and follow the organizer’s arrival time.</span></dd></div>
    </dl>
    <p>All addresses are in Yokohama, Japan. Your cruise documents determine the terminal and entry instructions for your sailing.</p>
  </div>;
}

function OfficialLinks() {
  return <div className={styles.sources}>
    <strong>Official maps &amp; entry guidance</strong>
    <ul>
      <li><a href={terminalUrl} target="_blank" rel="noopener noreferrer">City of Yokohama terminal map and addresses</a></li>
      <li><a href="https://osanbashi.jp/en/access/" target="_blank" rel="noopener noreferrer">Osanbashi access map</a></li>
      <li><a href="https://www.mm21railway.co.jp/global/english/station/nihonodori/stationmap.html" target="_blank" rel="noopener noreferrer">Nihon-odori station map</a></li>
      <li><a href="https://osanbashi.jp/en/other/" target="_blank" rel="noopener noreferrer">Daikoku and Shinko entry guidance</a></li>
    </ul>
  </div>;
}

export function TokyoTransferChecklist() {
  const [checked, setChecked] = useState<boolean[]>(() => checks.map(() => false));
  const [status, setStatus] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  const [printing, setPrinting] = useState(false);
  const completed = checked.filter(Boolean).length;

  useEffect(() => {
    if (!printing) return;
    const finish = () => {
      document.body.removeAttribute("data-print-tokyo-checklist");
      setPrinting(false);
    };
    document.body.setAttribute("data-print-tokyo-checklist", "true");
    window.addEventListener("afterprint", finish, { once: true });
    const frame = window.requestAnimationFrame(() => {
      try { window.print(); }
      catch {
        finish();
        setStatus("Printing is unavailable in this browser. You can copy the checklist link below.");
      }
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("afterprint", finish);
      document.body.removeAttribute("data-print-tokyo-checklist");
    };
  }, [printing]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFailed(false);
      setStatus("Checklist link copied. Share it with your travel group.");
    } catch {
      setCopyFailed(true);
      setStatus("Select and copy this link to share the checklist.");
    }
  }

  return <>
    <section id="tokyo-transfer-checklist" className={styles.checklist} aria-labelledby="tokyo-transfer-checklist-title">
      <div className={styles.heading}>
        <p className={styles.kicker}>Free planning checklist</p>
        <h2 id="tokyo-transfer-checklist-title">Ready to leave Tokyo for your cruise?</h2>
        <p>Tick off the essentials, print a copy, or send the checklist to your travel group. No sign-up needed.</p>
      </div>
      <div className={styles.toolbar}>
        <button type="button" onClick={() => setPrinting(true)} disabled={printing}>Print / save PDF</button>
        <button type="button" onClick={copyLink}>Copy checklist link</button>
        <span className={styles.progress} aria-live="polite">{completed} of {checks.length} checked</span>
      </div>
      <p className={styles.status} role="status">{status}</p>
      {copyFailed && <label className={styles.linkFallback}>Checklist link<input type="text" readOnly value={shareUrl} onFocus={(event) => event.currentTarget.select()} /></label>}
      <ul className={styles.items}>{checks.map((check, index) => <li key={check.title}>
        <label><input type="checkbox" checked={checked[index]} onChange={(event) => setChecked((previous) => previous.map((value, item) => item === index ? event.target.checked : value))} /><span><strong>{check.title}</strong><span>{check.detail}</span></span></label>
      </li>)}</ul>
      <p className={styles.sessionNote}>Ticks stay on this page until you reload. The shared link opens a fresh checklist.</p>
      <TerminalReference />
      <OfficialLinks />
      <p className={styles.nextStep}>Need a car for your group and bags? <a href="#hotel-to-port-transfers">Compare Tokyo hotel-to-port transfers</a>, then confirm your exact terminal with the provider.</p>
    </section>
    {printing && createPortal(<div className={styles.printSheet} aria-hidden="true">
      <p className={styles.printBrand}>PORTDAYGUIDE · TOKYO → YOKOHAMA</p>
      <h1>Your cruise transfer checklist</h1>
      <p>Use your cruise documents to confirm the terminal, arrival window and final check-in deadline.</p>
      <div className={styles.writingLines}><p><strong>Terminal / berth:</strong> __________________________________________________</p><p><strong>Arrival window / final check-in:</strong> _______________________________________</p><p><strong>Leave hotel at / pickup location:</strong> _____________________________________</p><p><strong>People / suitcases / driver contact:</strong> ____________________________________</p></div>
      <ul className={styles.printItems}>{checks.map((check, index) => <li key={check.title}><span className={styles.printCheck}>{checked[index] ? "✓" : ""}</span><div><strong>{check.title}</strong><p>{check.detail}</p></div></li>)}</ul>
      <TerminalReference />
      <p className={styles.printSources}>Official terminal details: <a href={terminalUrl}>City of Yokohama</a> · Daikoku entry: <a href="https://osanbashi.jp/en/other/">osanbashi.jp/en/other/</a><br />Terminal facts checked September 2026. Recheck your cruise line’s instructions before travel.</p>
      <p className={styles.printReturn}>Routes, official maps &amp; hotel transfer options:<br /><a href={shareUrl}>{canonicalUrl}</a></p>
    </div>, document.body)}
  </>;
}

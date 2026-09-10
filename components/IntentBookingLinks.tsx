import styles from "./IntentBookingLinks.module.css";

export function IntentBookingLinks({ portSlug, topic }: { portSlug: string; topic: string }) {
  const links = portSlug === "cozumel" && topic === "taxi-rates"
    ? [
      { href: "#transport-budget-title", label: "Compare taxi & driver costs" },
      { href: "#cozumel-driver-checks", label: "Check private driver & booking options" },
    ]
    : portSlug === "roatan" && topic === "west-bay-beach-from-cruise-port"
      ? [{ href: "#west-bay-booking-checks", label: "Check beach transport & booking options" }]
      : [];

  if (!links.length) return null;
  return <nav className={styles.links} aria-label="Transport and booking shortcuts">
    {links.map(link => <a href={link.href} key={link.href}>{link.label}<span aria-hidden="true"> ↓</span></a>)}
  </nav>;
}

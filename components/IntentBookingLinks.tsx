import styles from "./IntentBookingLinks.module.css";

export function CozumelCostLinks() {
  return <nav className={styles.costTools} aria-label="Cozumel transport cost tools">
    <span>Plan your taxi budget</span>
    <a className={styles.calculator} href="#cozumel-fare-references">See fares by destination <span aria-hidden="true">↓</span></a>
    <a className={styles.driverCheck} href="#transport-budget-title">Compare your whole-party cost</a>
    <a className={styles.driverCheck} href="#cozumel-driver-checks">Review private-driver inclusions</a>
  </nav>;
}

export function WestBayBookingLink() {
  return <p className={styles.beachNote}>Once you know your terminal, <a href="#west-bay-booking-checks">check what your West Bay booking includes</a>: beach facilities, pickup and the return appointment.</p>;
}

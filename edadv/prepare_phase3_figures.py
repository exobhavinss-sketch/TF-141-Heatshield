"""Create two annotated presentation copies without replacing Phase 2 figures."""

from __future__ import annotations

import csv
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt


ROOT = Path(__file__).resolve().parents[1]
EDADV = ROOT / "edadv"
OUT = EDADV / "outputs"
FIG = EDADV / "figures_phase3"
DISCLOSURE = "Synthetic academic simulation data; not verified live Solapur measurements."


def rows(name: str) -> list[dict[str, str]]:
    with (OUT / name).open("r", encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))


def main() -> None:
    FIG.mkdir(parents=True, exist_ok=True)
    stations = rows("station_aggregates.csv")
    zones = sorted({r["zone_type"] for r in stations})
    values = [[float(r["land_surface_temperature_c_mean"]) for r in stations if r["zone_type"] == z] for z in zones]
    counts = [len(v) for v in values]
    fig, ax = plt.subplots(figsize=(14, 8), constrained_layout=True)
    labels = [f"{z}\n(n={n} stations)" for z, n in zip(zones, counts)]
    box_kwargs = {"patch_artist": True, "showfliers": True,
                  "medianprops": {"color": "#172554", "linewidth": 2}}
    try:
        box = ax.boxplot(values, tick_labels=labels, **box_kwargs)
    except TypeError:  # Matplotlib versions before the tick_labels keyword
        box = ax.boxplot(values, labels=labels, **box_kwargs)
    for patch in box["boxes"]:
        patch.set_facecolor("#91b9d7")
        patch.set_alpha(0.85)
    ax.set_title("Station-level mean land surface temperature by source zone", fontsize=17, pad=14)
    ax.set_xlabel("Source zone label")
    ax.set_ylabel("Station mean land surface temperature (°C)")
    ax.grid(axis="y", alpha=0.25)
    fig.text(0.01, 0.005, DISCLOSURE + " Each box summarizes station means; points beyond whiskers are station-level IQR candidates.",
             fontsize=9, color="#555555")
    fig.savefig(FIG / "03_station_level_lst_by_zone_annotated.png", dpi=220, bbox_inches="tight")
    plt.close(fig)

    risk_rows = rows("risk_category_by_zone.csv")
    categories = ["Low", "Moderate", "High", "Very High"]
    totals = {r["zone_type"]: int(r["zone_observations"]) for r in risk_rows}
    zone_order = sorted(totals)
    colors = {"Low": "#258f84", "Moderate": "#e6be63", "High": "#ed8b52", "Very High": "#c94b5d"}
    fig, ax = plt.subplots(figsize=(14, 8), constrained_layout=True)
    bottoms = [0.0] * len(zone_order)
    for category in categories:
        pct = []
        for zone in zone_order:
            item = next(r for r in risk_rows if r["zone_type"] == zone and r["heat_risk_category"] == category)
            pct.append(float(item["percent_within_zone"]))
        ax.bar(range(len(zone_order)), pct, bottom=bottoms, color=colors[category], label=category, width=0.76)
        bottoms = [a + b for a, b in zip(bottoms, pct)]
    labels = [f"{z}\n(n={totals[z]:,})" for z in zone_order]
    ax.set_xticks(range(len(zone_order)), labels)
    ax.set_ylim(0, 100)
    ax.set_ylabel("Share of records in zone (%)")
    ax.set_xlabel("Source zone label; n is the number of synthetic records")
    ax.set_title("Source-encoded heat-risk label mix by zone", fontsize=17, pad=14)
    ax.legend(title="Source risk label", frameon=False, ncols=2, loc="upper center", bbox_to_anchor=(0.5, -0.12))
    ax.grid(axis="y", alpha=0.2)
    fig.text(0.01, 0.005, DISCLOSURE + " Category thresholds are not independently verified; labels are not validated health-risk classes.",
             fontsize=9, color="#555555")
    fig.savefig(FIG / "12_risk_label_mix_by_zone_annotated.png", dpi=220, bbox_inches="tight")
    plt.close(fig)

    print(f"Generated {FIG.relative_to(ROOT)}: 03_station_level_lst_by_zone_annotated.png, 12_risk_label_mix_by_zone_annotated.png")


if __name__ == "__main__":
    main()

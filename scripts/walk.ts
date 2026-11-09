/**
 * Plays every campaign many times and reports endings, scene coverage and
 * length: the evidence behind the balance claims in docs/DESIGN.md.
 * Usage: npm run walk [-- seeds]
 */
import { STORY } from "../content/index.ts";
import { walk, type Policy } from "../content/walk.ts";
import { ROLE_IDS, type Mode } from "../engine/types.ts";

const n = Number(process.argv[2] ?? 300);
for (const role of ROLE_IDS) {
  const campaign = STORY.campaigns.find((c) => c.role === role)!;
  console.log(`\n${campaign.label} (${campaign.scenes.length} scenes)`);
  for (const mode of ["story", "standard"] as Mode[]) {
    for (const policy of ["careful", "random"] as Policy[]) {
      const endings = new Map<string, number>();
      const seen = new Set<string>();
      let steps = 0;
      for (let seed = 1; seed <= n; seed++) {
        const w = walk(STORY, role, mode, seed, policy);
        endings.set(w.state.ending!, (endings.get(w.state.ending!) ?? 0) + 1);
        w.scenes.forEach((s) => seen.add(s));
        steps += w.state.choices.length;
      }
      const list = [...endings].sort((a, b) => b[1] - a[1]).map(([e, k]) => `${e} ${Math.round((100 * k) / n)}%`);
      console.log(`  ${mode.padEnd(8)} ${policy.padEnd(7)} choices ~${Math.round(steps / n)}  scenes seen ${seen.size}/${campaign.scenes.length}  ${list.join(", ")}`);
    }
  }
}

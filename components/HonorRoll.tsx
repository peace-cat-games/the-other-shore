import { RIGHTEOUS, type Righteous } from "@/content/righteous";

function Names({ title, list }: { title: string; list: Righteous[] }) {
  return (
    <section className="mt-5">
      <h3 className="text-xl font-semibold">{title}</h3>
      <ul className="mt-3 space-y-3">
        {list.map((r) => (
          <li key={r.name}>
            <p className="font-serif text-lg">{r.name}</p>
            <p className="muted text-sm">{r.where}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Every Danish and Swedish Righteous Among the Nations, from Yad Vashem's records. */
export function HonorRoll() {
  const count = (l: Righteous[]) => l.reduce((n, r) => n + r.people, 0);
  return (
    <div>
      <h2 className="text-2xl font-semibold">Righteous Among the Nations</h2>
      <div className="story mt-3">
        {RIGHTEOUS.intro.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
      <Names title={`From Denmark (${count(RIGHTEOUS.denmark)})`} list={RIGHTEOUS.denmark} />
      <Names title={`From Sweden (${count(RIGHTEOUS.sweden)})`} list={RIGHTEOUS.sweden} />
      <Names title="And in Copenhagen" list={RIGHTEOUS.others} />
      <p className="muted mt-5 text-sm">{RIGHTEOUS.asOf}</p>
    </div>
  );
}

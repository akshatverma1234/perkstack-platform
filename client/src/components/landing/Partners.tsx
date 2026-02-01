"use client";
const partners = [
  "AWS",
  "Google Cloud",
  "Notion",
  "HubSpot",
  "Stripe",
  "Linear",
  "Vercel",
  "Miro",
  "Segment",
  "Mixpanel",
  "OpenAI",
  "Typeform",
];

export const Partners = () => {
  return (
    <section className="py-20 border-y border-white/5 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto px-6 mb-10 text-center">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
          Trusted by leading startups
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex space-x-12 px-6">
          {partners.map((partner) => (
            <span
              key={partner}
              className="text-2xl font-bold text-slate-500 hover:text-white transition-colors duration-300 mx-8"
            >
              {partner}
            </span>
          ))}
          {partners.map((partner) => (
            <span
              key={`${partner}-2`}
              className="text-2xl font-bold text-slate-500 hover:text-white transition-colors duration-300 mx-8"
            >
              {partner}
            </span>
          ))}
        </div>

        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex space-x-12 px-6">
          {partners.map((partner) => (
            <span
              key={`${partner}-3`}
              className="text-2xl font-bold text-slate-500 hover:text-white transition-colors duration-300 mx-8"
            >
              {partner}
            </span>
          ))}
          {partners.map((partner) => (
            <span
              key={`${partner}-4`}
              className="text-2xl font-bold text-slate-500 hover:text-white transition-colors duration-300 mx-8"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

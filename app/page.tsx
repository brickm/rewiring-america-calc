import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e8e4dc]">
      <div className="max-w-[1200px] mx-auto px-8 py-12 md:py-16">
        <h1 className="text-[40px] md:text-[56px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-6 uppercase">
          Claude Code for Learning Designers
        </h1>
        <div className="mb-12 text-[#1a1a1a] text-base leading-relaxed max-w-[800px]">
          Explore the workshop presentation or see the live demo app built with Claude Code.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Presentation Card */}
          <Card variant="yellow" shadow="lg" className="p-8 h-full">
            <h2 className="text-[32px] md:text-[40px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-4">
              WORKSHOP PRESENTATION
            </h2>
            <p className="text-[#1a1a1a] text-lg mb-6 leading-relaxed">
              Why specification is the new superpower. A 75-minute webinar for instructional designers and L&D leaders.
            </p>
            <div className="mt-auto">
              <a href="/workshop-presentation.html" className="inline-block">
                <span className="inline-block bg-[#1a1a1a] hover:bg-[#4da6ff] text-white px-6 py-3 border-[2px] border-black font-semibold uppercase text-sm transition-colors duration-200">
                  View Slides &rarr;
                </span>
              </a>
            </div>
          </Card>

          {/* Demo App Card */}
          <Card variant="white" shadow="lg" className="p-8 h-full">
            <h2 className="text-[32px] md:text-[40px] font-mono font-normal leading-[1.1] tracking-tight text-[#1a1a1a] mb-4">
              LIVE DEMO APP
            </h2>
            <p className="text-[#1a1a1a] text-lg mb-6 leading-relaxed">
              The Rewiring America Heat Pump Calculator &mdash; a working web app built entirely with Claude Code. The &ldquo;deployed Hydrofoil&rdquo; from the presentation.
            </p>
            <div className="mt-auto">
              <a href="/calculator">
                <Button className="w-full">
                  Open Demo App &rarr;
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

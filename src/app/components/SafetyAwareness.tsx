import { useEffect, useState } from 'react';
import { Shield, Activity, AlertOctagon, Heart, Smartphone, ShieldAlert, Crosshair, AlertTriangle } from 'lucide-react';

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span className="font-bold tabular-nums">{count.toLocaleString()}{suffix}</span>;
}

export function SafetyAwareness() {
  const safetyRules = [
    {
      icon: <ShieldAlert className="w-8 h-8 text-amber-500" />,
      title: "Wear ISI Mark Helmet",
      description: "Always strap your helmet. It reduces the risk of fatal head injuries by up to 70%.",
      tip: "Ensure the chin strap is tightly fastened."
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      title: "Follow Speed Limits",
      description: "Speeding is the leading cause of road deaths in India. Better late than never.",
      tip: "Reduce speed by 30% during rain or fog."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-500" />,
      title: "No Mobile Phones",
      description: "Using a mobile phone while driving increases the risk of accidents by 4 times.",
      tip: "Pull over safely if an urgent call is needed."
    },
    {
      icon: <AlertOctagon className="w-8 h-8 text-purple-500" />,
      title: "Don't Drink and Drive",
      description: "Alcohol impairs judgement and reaction time. Zero tolerance for drunk driving.",
      tip: "Take a cab if you plan to drink."
    }
  ];

  return (
    <div className="p-4 space-y-8 pb-10">
      
      {/* Live Awareness Meters Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-foreground">India Road Safety Stats</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Stat Card 1 */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 text-center">
            <Heart className="w-6 h-6 text-red-500 mx-auto mb-2 opacity-80" />
            <div className="text-2xl font-black text-red-700 mb-1">
              <AnimatedCounter end={168491} duration={2500} />
            </div>
            <p className="text-xs font-medium text-red-900 leading-tight">Lives Lost in Road Accidents (2022)</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 text-center">
            <Shield className="w-6 h-6 text-amber-500 mx-auto mb-2 opacity-80" />
            <div className="text-2xl font-black text-amber-700 mb-1">
              <AnimatedCounter end={71} duration={2000} suffix="%" />
            </div>
            <p className="text-xs font-medium text-amber-900 leading-tight">Fatalities linked to overspeeding</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 text-center">
            <ShieldAlert className="w-6 h-6 text-orange-500 mx-auto mb-2 opacity-80" />
            <div className="text-2xl font-black text-orange-700 mb-1">
              <AnimatedCounter end={50029} duration={2500} />
            </div>
            <p className="text-xs font-medium text-orange-900 leading-tight">Two-wheeler deaths w/o Helmet</p>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center flex flex-col justify-center">
            <Crosshair className="w-6 h-6 text-green-500 mx-auto mb-2 opacity-80" />
            <div className="text-lg font-bold text-green-800 mb-1 leading-tight">
              Drive Safe.
            </div>
            <p className="text-xs font-medium text-green-900 leading-tight">Someone is waiting for you at home.</p>
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-3">*Source: MoRTH India Annual Report</p>
      </section>

      {/* Road Safety Rules Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Critical Safety Rules</h2>
        </div>

        <div className="space-y-4">
          {safetyRules.map((rule, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-4 flex gap-4 shadow-sm">
              <div className="bg-muted rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
                {rule.icon}
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{rule.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 leading-snug">
                  {rule.description}
                </p>
                <div className="inline-block bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                  💡 Tip: {rule.tip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Code2, Terminal, Cpu, FileCode2, Braces } from "lucide-react";

export function DeveloperMode() {
  const stacks = [
    {
      name: "TypeScript & React",
      icon: FileCode2,
      description: "JSX tags, generic types, arrow functions, and object destructuring.",
      snippets: "24 Snippets",
      symbolFocus: "< > { } [ ] => :",
    },
    {
      name: "Rust & Systems",
      icon: Cpu,
      description: "Lifetimes, pattern matching, match expressions, and macro syntax.",
      snippets: "20 Snippets",
      symbolFocus: "& ' :: -> => | !",
    },
    {
      name: "Java & Spring",
      icon: Braces,
      description: "Annotations, lambda streams, class hierarchies, and method references.",
      snippets: "18 Snippets",
      symbolFocus: "@ ( ) . ; :: ->",
    },
    {
      name: "Bash & CLI Scripts",
      icon: Terminal,
      description: "Command pipelines, flags, environment variables, and shell redirects.",
      snippets: "16 Snippets",
      symbolFocus: "$ | > < - -- ;",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Developer Mode"
        subtitle="Programming syntax training tailored for software engineers and code typing muscle memory."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stacks.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} className="border border-border hover:border-primary/50 transition-all shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Symbols: {s.symbolFocus}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">{s.snippets}</span>
                </div>
                <CardTitle className="text-base flex items-center space-x-2 pt-1">
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{s.name}</span>
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {s.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full flex items-center space-x-2">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Launch Syntax Arena</span>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default DeveloperMode;

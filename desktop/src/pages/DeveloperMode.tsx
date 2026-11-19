import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Code2, Cpu, FileCode2, Braces, Database, Terminal, FileJson } from "lucide-react";

export function DeveloperMode() {
  const tracks = [
    {
      name: "Java",
      icon: Braces,
      description: "Static typing, object-oriented hierarchies, lambda streams, annotations, and semicolons.",
      snippets: "18 Snippets",
      symbolFocus: "@ ( ) . ; :: -> { }",
    },
    {
      name: "TypeScript",
      icon: FileCode2,
      description: "Type annotations, generics, interfaces, union types, and modern arrow function syntax.",
      snippets: "24 Snippets",
      symbolFocus: "< > { } [ ] => : ;",
    },
    {
      name: "JavaScript",
      icon: Code2,
      description: "Dynamic scripting, closures, async/await promises, object destructuring, and template literals.",
      snippets: "22 Snippets",
      symbolFocus: "` $ { } ( ) => ... ;",
    },
    {
      name: "Python",
      icon: Terminal,
      description: "Semantic indentation, colons, list comprehensions, decorators, and snake_case naming.",
      snippets: "20 Snippets",
      symbolFocus: ": [ ] ( ) _ # @",
    },
    {
      name: "SQL",
      icon: Database,
      description: "Relational database queries, uppercase DDL/DML keywords, joins, and aggregates.",
      snippets: "16 Snippets",
      symbolFocus: ", ( ) ' ; * = != >=",
    },
    {
      name: "Rust",
      icon: Cpu,
      description: "Memory safety, explicit lifetimes, pattern matching, macro calls, and dense operators.",
      snippets: "20 Snippets",
      symbolFocus: "& ' :: -> => | ! { }",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Developer Mode"
        subtitle="Programming syntax and symbol muscle memory drills across the approved D7 language tracks."
      />

      {/* 6 Approved Language Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} className="border border-border hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {s.symbolFocus}
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
              <CardContent className="pt-0">
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-2">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Launch Syntax Arena</span>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Data Formats Note (D7 Specification) */}
      <div className="p-3.5 rounded-lg border border-border/80 bg-secondary/30 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-2.5">
          <FileJson className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong className="text-foreground font-medium">Data Format Exercises:</strong> JSON drills (bracket nesting, key-value quotes) are available as exercise categories bridging syntax precision.
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/80 shrink-0 hidden sm:inline">
          D7 Code Studio
        </span>
      </div>
    </div>
  );
}

export default DeveloperMode;

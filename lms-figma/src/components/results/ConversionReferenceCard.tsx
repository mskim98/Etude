import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface ConversionReferenceCardProps {
  section: 'Math' | 'Reading' | 'Writing';
}

export function ConversionReferenceCard({ section }: ConversionReferenceCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Placeholder conversion data - in a real app, this would come from official SAT scoring tables
  const conversionData = {
    'Math': [
      { raw: 0, scaled: 200 },
      { raw: 5, scaled: 330 },
      { raw: 10, scaled: 430 },
      { raw: 15, scaled: 500 },
      { raw: 20, scaled: 540 },
      { raw: 25, scaled: 580 },
      { raw: 30, scaled: 620 },
      { raw: 35, scaled: 660 },
      { raw: 40, scaled: 700 },
      { raw: 45, scaled: 750 },
      { raw: 50, scaled: 780 },
      { raw: 58, scaled: 800 }
    ],
    'Reading': [
      { raw: 0, scaled: 100 },
      { raw: 3, scaled: 155 },
      { raw: 5, scaled: 195 },
      { raw: 8, scaled: 225 },
      { raw: 10, scaled: 250 },
      { raw: 13, scaled: 270 },
      { raw: 15, scaled: 290 },
      { raw: 18, scaled: 310 },
      { raw: 20, scaled: 330 },
      { raw: 23, scaled: 355 },
      { raw: 25, scaled: 380 },
      { raw: 27, scaled: 400 }
    ],
    'Writing': [
      { raw: 0, scaled: 100 },
      { raw: 3, scaled: 155 },
      { raw: 5, scaled: 195 },
      { raw: 8, scaled: 225 },
      { raw: 10, scaled: 250 },
      { raw: 13, scaled: 270 },
      { raw: 15, scaled: 290 },
      { raw: 18, scaled: 310 },
      { raw: 20, scaled: 330 },
      { raw: 23, scaled: 355 },
      { raw: 25, scaled: 380 },
      { raw: 27, scaled: 400 }
    ]
  };

  const data = conversionData[section];

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center space-x-2">
                <Calculator className="w-4 h-4" />
                <span>{section} Score Conversion</span>
              </CardTitle>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-left">
              Raw score to scaled score reference table
            </p>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            <div className="max-h-64 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Raw Score</TableHead>
                    <TableHead className="text-xs">Scaled Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-xs font-medium">
                        {row.raw}
                      </TableCell>
                      <TableCell className="text-xs" style={{ color: 'var(--color-accent)' }}>
                        {row.scaled}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
              <strong>Note:</strong> These are approximate conversions. Actual SAT scoring may vary based on test difficulty and equating.
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
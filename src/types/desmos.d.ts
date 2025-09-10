// Desmos Calculator API Type Definitions
declare global {
  interface Window {
    Desmos: {
      GraphingCalculator: (
        element: HTMLElement, 
        options?: {
          keypad?: boolean;
          settingsMenu?: boolean;
          expressionsTopbar?: boolean;
          pointsOfInterest?: boolean;
          trace?: boolean;
          border?: boolean;
          lockViewport?: boolean;
          expressionsCollapsed?: boolean;
        }
      ) => {
        setExpressions: (expressions: Array<{
          id?: string;
          latex?: string;
          color?: string;
        }>) => void;
        getExpressions: () => any[];
        setExpression: (expression: {
          id?: string;
          latex?: string;
          color?: string;
        }) => void;
        removeExpression: (id: string) => void;
        setState: (state: any) => void;
        getState: () => any;
      };
    };
  }
}

export {};
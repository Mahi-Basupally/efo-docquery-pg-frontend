/**
 * FEC form type code -> friendly display label (e.g. "F3X" -> "FORM 3X").
 * Shared across every page that shows a form/report heading.
 */
export const FORM_TYPE_LABELS: Record<string, string> = {
  F: 'FORM',
  F3X: 'FORM 3X',
  F3: 'FORM 3',
  F3S: 'FORM 3S',
  F3P: 'FORM 3P',
  F3PS: 'FORM 3PS', 
  F1: 'FORM 1', 
  F1M: 'FORM 1M',
  F2: 'FORM 2', 
  F4: 'FORM 4', 
  F5: 'FORM 5', 
  F6: 'FORM 6', 
  F7: 'FORM 7', 
  F8: 'FORM 8', 
  F9: 'FORM 9',
  F99: 'FORM 99',  
  F24: 'FORM 24',
};


export function getFormTypeLabel(formType?: string | null): string {
  return (formType && FORM_TYPE_LABELS[formType]) || formType || 'FORM';
}

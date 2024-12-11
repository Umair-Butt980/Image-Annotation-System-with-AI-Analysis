import { Annotation } from './store';

export async function generateCommentSummary(annotations: Annotation[]) {
  const comments = annotations.map((a) => a.comment).join('\n');
  return processComments(comments);
}

export async function analyzeImageChanges(checklist: string, newAnnotations: Annotation[]) {
  const newComments = newAnnotations.map((a) => a.comment).join('\n');
  return processChanges(checklist, newComments);
}

function processComments(comments: string): string {
  // Local processing of comments to create a checklist
  const lines = comments.split('\n').filter(Boolean);
  const uniquePoints = new Set(lines);
  
  return Array.from(uniquePoints)
    .map(comment => `- ${comment.trim()}`)
    .join('\n');
}

function processChanges(checklist: string, newComments: string): Record<string, boolean> {
  const checklistItems = checklist.split('\n').filter(line => line.startsWith('-'));
  const comments = newComments.split('\n');
  
  return checklistItems.reduce((acc, item, index) => {
    const itemText = item.replace('-', '').trim();
    const isCompleted = comments.some(comment => 
      comment.toLowerCase().includes(itemText.toLowerCase()) ||
      itemText.toLowerCase().includes(comment.toLowerCase())
    );
    
    acc[index] = { completed: isCompleted };
    return acc;
  }, {} as Record<string, { completed: boolean }>);
}
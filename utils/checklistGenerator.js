import checklistItems from '../data/checklist_items.json';
import travelTypes from '../data/travel_types.json';

export function generateChecklist(travelTypeId) {
  const travelType = travelTypes.find((t) => t.id === travelTypeId);
  if (!travelType) {
    return checklistItems
      .filter((item) => item.required)
      .map((item) => ({
        id: item.id,
        title: item.title,
        titleKo: item.titleKo,
        categoryId: item.categoryId,
        checked: false,
        important: item.required,
        isCustom: false,
      }));
  }

  const includeTags = travelType.includeTags || [];

  const filteredItems = checklistItems.filter((item) => {
    if (item.required) return true;
    return item.tags.some((tag) => includeTags.includes(tag));
  });

  return filteredItems.map((item) => ({
    id: item.id,
    title: item.title,
    titleKo: item.titleKo,
    categoryId: item.categoryId,
    checked: false,
    important: item.required,
    isCustom: false,
  }));
}

export function getChecklistByCategory(checklist, categoryId) {
  return checklist.filter((item) => item.categoryId === categoryId);
}

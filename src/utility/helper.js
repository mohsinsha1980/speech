export const getRowsFromChapter = (chapter) => {
  if (!chapter.length) {
    return [];
  }
  const ids = chapter.map(card => {
    return card.id.replace(/[0-9]/g, '');
  });
  const groups = ([...new Set(ids)]).map(id => ({ group: id, cards: [] }));
  chapter.forEach(card => {
    for (let index in groups) {
      if (groups[index].group === card.id.replace(/[0-9]/g, '')) {
        groups[index].cards.push(card);
        break;
      }
    }
  });
  return groups;
};
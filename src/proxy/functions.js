const nextId = (items) => {
    if (items.length === 0) {
        return 1;
    }

    const highestId = items.reduce((maxId, item) => {
        return item.id > maxId ? item.id : maxId;
    }, 0);

    return highestId + 1;
};
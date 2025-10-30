const basePath = "/books/G1";

const buildBookLinks = (id) => ({
    self: { href: `${basePath}/${id}` },
    collection: { href: basePath },
    update: { href: `${basePath}/${id}`, method: "PUT" },
    delete: { href: `${basePath}/${id}`, method: "DELETE" },
});

const buildCollectionLinks = () => ({
    self: { href: basePath },
    create: { href: basePath, method: "POST" },
    versions: { href: "/books" },
});

const formatBook = (book) => {
    if (!book || typeof book !== "object") {
        return null;
    }

    return {
        ...book,
        _links: buildBookLinks(book.id),
    };
};

const formatCollection = (books = []) => ({
    items: books.map(formatBook),
    _links: buildCollectionLinks(),
});

module.exports = {
    basePath,
    buildBookLinks,
    buildCollectionLinks,
    formatBook,
    formatCollection,
};

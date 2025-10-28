const users = require("../mock/userDB");

const nextId = () => {
    if (users.length === 0) {
        return 1;
    }

    const highestId = users.reduce((maxId, user) => {
        return user.id > maxId ? user.id : maxId;
    }, 0);

    return highestId + 1;
};

module.exports = {
    getByName: async (name) => users.find((user) => user.name === name ),

    add: async ({ name, password }) => {
        const newUser = { id: nextId(), name, password };
        users.push(newUser);
        return newUser;
    },

    updateById: async (id, updates) => {
        const index = users.findIndex((user) => user.id === id);

        if (index === -1) {
            return null;
        }

        users[index] = { ...users[index], ...updates, id };
        return users[index];
    },

    deleteById: async (id) => {
        const index = users.findIndex((user) => user.id === id);

        if (index === -1) {
            return null;
        }

        const [removed] = users.splice(index, 1);
        return removed;
    },
};

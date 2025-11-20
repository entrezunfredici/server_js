const users = require("../mock/userDB");
const bcrypt = require('bcryptjs');

const nextId = () => {
    if (users.length === 0) {
        return 1;
    }

    const highestId = users.reduce((maxId, user) => {
        return user.id > maxId ? user.id : maxId;
    }, 0);

    return highestId + 1;
};

const getByName = async (name) => users.find((user) => user.name === name);
const getById = async (id) => users.find((user) => user.id === id);

const add = async ({ name, password }) => {
    if (await getByName(name)) throw new Error('User already exists');
    if (!name || !password) throw new Error('Forgetten fields');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: nextId(), name, password: hashedPassword };

    users.push(newUser);
    return { status: "created", name };
};

const updateById = async (id, updates) => {
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return null;
    }

    users[index] = { ...users[index], ...updates, id };
    return users[index];
};

const verifyPassword = async (id, password) => {
    const user = await getById(id);
    if (!user) return false;
    return bcrypt.compare(password, user.password);
};

const deleteById = async (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return null;
    }

    const [removed] = users.splice(index, 1);
    return removed;
};

module.exports = {
    getByName,
    getById,
    add,
    updateById,
    verifyPassword,
    deleteById,
};

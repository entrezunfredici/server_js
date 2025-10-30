const express = require("express");
const fs = require("fs");
const path = require("path");

/**
 * @swagger
 * tags:
 *   - name: books
 *     description: Operations sur les livres
 */

/**
 * Discover and mount all versioned book routers.
 * @param {Object} limiters
 * @returns {express.Router}
 */
module.exports = (limiters = {}) => {
    const router = express.Router();
    const versionsDir = __dirname;

    const discoveredVersions = fs
        .readdirSync(versionsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && /^G\d+$/i.test(dirent.name))
        .map((dirent) => dirent.name)
        .sort();

    const mountedVersions = [];

    discoveredVersions.forEach((version) => {
        const versionRoutesPath = path.join(versionsDir, version, "routes");
        let versionRouterFactory;

        try {
            versionRouterFactory = require(versionRoutesPath);
        } catch (error) {
            if (error.code === "MODULE_NOT_FOUND" && error.message.includes(versionRoutesPath)) {
                return;
            }
            throw error;
        }

        const versionRouter =
            typeof versionRouterFactory === "function"
                ? versionRouterFactory(limiters)
                : versionRouterFactory;

        router.use(`/${version}`, versionRouter);
        mountedVersions.push(version);
    });

    /**
     * @swagger
     * /books:
     *   get:
     *     summary: List available books API versions
     *     tags: [books]
     *     responses:
     *       200:
     *         description: Available versions.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 versions:
     *                   type: array
     *                   items:
     *                     type: string
     *                   example: ["G1"]
     *                 latest:
     *                   type: string
     *                   example: "G1"
     */
    router.get("/", (req, res) => {
        res.json({
            versions: mountedVersions,
            latest: mountedVersions.length > 0 ? mountedVersions[mountedVersions.length - 1] : null,
        });
    });

    return router;
};

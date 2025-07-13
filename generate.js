const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { body, validationResult } = require("express-validator");

const config = yaml.load(fs.readFileSync("config.yaml", "utf8"));
const models = config.models || [];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

models.forEach(({ name, fields, options }) => {
  if (!name || !fields) {
    console.warn(`⚠️ Skipping invalid model definition.`);
    return;
  }

  const modelName = cap(name);
  const modelVar = name.toLowerCase();

  // Mongoose Schema fields
  const schemaFields = Object.entries(fields)
    .map(([key, val]) => {
      if (typeof val === "string") return `  ${key}: ${val}`;
      if (val.ref) {
        return `  ${key}: { type: mongoose.Schema.Types.ObjectId, ref: '${val.ref}' }`;
      }
      return `  ${key}: { type: ${cap(val.type || "String")} }`;
    })
    .join(",\n");

  // Search logic
  const searchLogic = (options?.search || [])
    .map((field) => `{ ${field}: regex }`)
    .join(", ");

  // Validator rules
  const validatorRules = Object.entries(fields)
    .map(([key, val]) => {
      const label = cap(key);
      if (typeof val === "string") {
        switch (val.toLowerCase()) {
          case "string":
            return `  body('${key}').isString().notEmpty().withMessage('${label} is required')`;
          case "number":
            return `  body('${key}').isNumeric().withMessage('${label} must be a number')`;
          default:
            return `  body('${key}').notEmpty().withMessage('${label} is required')`;
        }
      } else {
        if (val.ref) {
          return `  body('${key}').notEmpty().withMessage('${label} reference is required')`;
        }
        switch (val.type?.toLowerCase()) {
          case "string":
            return `  body('${key}').isString().notEmpty().withMessage('${label} is required')`;
          case "number":
            return `  body('${key}').isNumeric().withMessage('${label} must be a number')`;
          default:
            return `  body('${key}').notEmpty().withMessage('${label} is required')`;
        }
      }
    })
    .join(",\n");

  // ==== GENERATED FILES ====

  const modelContent = `
const mongoose = require('mongoose');

const ${modelVar}Schema = new mongoose.Schema({
${schemaFields}
}, { timestamps: true });

module.exports = mongoose.model('${modelName}', ${modelVar}Schema);
`;

  const controllerContent = `
const ${modelName} = require('../models/${modelName}');
const { validationResult } = require('express-validator');

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const allowedFields = ${JSON.stringify(Object.keys(fields))};
    const data = {};
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    });
    const doc = await ${modelName}.create(data);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.q) {
      const regex = new RegExp(req.query.q, 'i');
      query.$or = [${searchLogic}];
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const data = await ${modelName}.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(data);
  } catch (err) {
    next(err);
  }
};
`;

  const routeContent = `
const express = require('express');
const ${modelVar}Routes = express.Router();
const ${modelVar}Controller = require('../../controllers/${modelVar}Controller');
const { create${modelName}Validator } = require('../../validators/${modelVar}Validator');

${modelVar}Routes.get('/', ${modelVar}Controller.getAll);
${modelVar}Routes.post('/', create${modelName}Validator, ${modelVar}Controller.create);

module.exports = ${modelVar}Routes;
`;

  const validatorContent = `
const { body } = require('express-validator');

exports.create${modelName}Validator = [
${validatorRules}
];
`;

  // Overwrite model file
  fs.writeFileSync(`models/${modelName}.js`, modelContent);

  // Overwrite controller file
  fs.writeFileSync(`controllers/${modelVar}Controller.js`, controllerContent);

  // Overwrite validator file
  fs.writeFileSync(`validators/${modelVar}Validator.js`, validatorContent);

  // Overwrite route file
  fs.writeFileSync(`routes/v1/${modelVar}Routes.js`, routeContent);


  // ==== UPDATE INDEX.JS ====
  const indexPath = "routes/v1/index.js";
  let indexContent = fs.existsSync(indexPath)
    ? fs.readFileSync(indexPath, "utf-8")
    : "";

  const importLine = `const ${modelVar}Routes = require('./${modelVar}Routes');`;
  const useLine = `router.use('/${modelVar}', ${modelVar}Routes);`;
  const routerDeclaration = `const router = require('express').Router();`;
  const exportLine = `module.exports = router;`;

  let lines = indexContent.split("\n");

  // Ensure router declaration only once
  if (!lines.some((line) => line.trim() === routerDeclaration)) {
    lines.unshift(routerDeclaration);
  }

  // Ensure import line only once
  if (!lines.includes(importLine)) {
    const lastImportIndex = lines.findIndex(
      (line) => line.startsWith("const") && line.includes("Routes")
    );
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, importLine);
    } else {
      lines.unshift(importLine);
    }
  }

  // Ensure router.use line only once
  if (!lines.includes(useLine)) {
    const lastUseIndex = lines.findIndex((line) =>
      line.includes("router.use(")
    );
    if (lastUseIndex !== -1) {
      lines.splice(lastUseIndex + 1, 0, useLine);
    } else {
      lines.push(useLine);
    }
  }

  // Ensure module.exports only once
  if (!lines.some((line) => line.trim() === exportLine)) {
    lines.push(exportLine);
  }

  // Remove duplicate lines if any
  const uniqueLines = [...new Set(lines.map((line) => line.trim()))];
  fs.writeFileSync(indexPath, uniqueLines.join("\n"));

  fs.writeFileSync(indexPath, lines.join("\n"));

  console.log(`✅ Files for ${modelName} generated successfully.`);
});

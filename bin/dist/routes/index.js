"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.render('index', { title: 'Safe&Home' });
});

router.get('/pagos', (req, res) => {
    res.render('pagos', { title: 'Compra del Servicio' });
});
exports.default = router;

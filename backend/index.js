import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { parseSTL } from '@amandaghassaei/stl-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('public'));

app.post('/api/stl-info', upload.single('stl'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error reading file.' });
        }

        try {
            const parsed = parseSTL(new Uint8Array(data));
            const volume = calculateVolume(parsed.vertices);
            const dimensions = calculateDimensions(parsed.vertices);
            const printTime = estimatePrintTime(volume);

            // Delete the uploaded file
            fs.unlinkSync(filePath);

            res.json({
                volume: volume / 1000, // convert to cm³
                dimensions: dimensions,
                printTime: formatPrintTime(printTime)
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error processing STL file.' });
        }
    });
});

function calculateVolume(vertices) {
    let volume = 0;
    for (let i = 0; i < vertices.length; i += 9) {
        const triangle = [
            [vertices[i], vertices[i+1], vertices[i+2]],
            [vertices[i+3], vertices[i+4], vertices[i+5]],
            [vertices[i+6], vertices[i+7], vertices[i+8]]
        ];
        volume += signedVolumeOfTriangle(triangle);
    }
    return Math.abs(volume);
}

function signedVolumeOfTriangle(triangle) {
    const [a, b, c] = triangle;
    return (1/6) * (-a[2] * b[1] * c[0] + a[1] * b[2] * c[0] + a[2] * b[0] * c[1] - a[0] * b[2] * c[1] - a[1] * b[0] * c[2] + a[0] * b[1] * c[2]);
}

function calculateDimensions(vertices) {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i+1];
        const z = vertices[i+2];

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
    }

    return {
        x: maxX - minX,
        y: maxY - minY,
        z: maxZ - minZ
    };
}

function estimatePrintTime(volume) {
    // This is a very rough estimate. Adjust the factor based on your printer's speed.
    const printSpeedFactor = 0.5; // cm³ per minute
    return volume / printSpeedFactor;
}

function formatPrintTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
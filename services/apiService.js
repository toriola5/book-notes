import axios from "axios";
import fs from 'fs';
import https from "https";

const agent = new https.Agent({ family: 4 });
export async function fetchImage(url , pathToSave) {
    const response = await axios.get(url, { responseType: 'arraybuffer' , httpsAgent: agent ,timeout : 5000});
    const buffer = Buffer.from(response.data, 'binary');
    fs.writeFileSync(pathToSave, buffer);
}


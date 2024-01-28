import {readFile, writeFile} from 'node:fs/promises'
import {getDate, monSecret} from "./divers.js";
import {NotFoundError} from "./errors.js";
import {createHash} from 'node:crypto'
import { v4 as uuidv4 } from 'uuid';

/* Chemin de stockage des blocks */
const path = "data/blockchain.json"

/**
 * Mes définitions
 * @typedef { id: string, nom: string, don: number, date: string,hash: string} Block
 * @property {string} id
 * @property {string} nom
 * @property {number} don
 * @property {string} date
 * @property {string} string
 *
 */

/**
 * Renvoie un tableau json de tous les blocks
 * @return {Promise<any>}
 */
export async function findBlocks() {

    return readFile(path, 'utf-8')
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
            NotFoundError();
        })
}

/**
 * Trouve un block à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    // A coder
}

/**
 * Trouve le dernier block de la chaine
 * @return {Promise<Block|null>}
 */
export async function findLastBlock() {
    const currentBlocksString = await findBlocks();

    const currentBlocksArray = JSON.parse(currentBlocksString);

    const lastBlock = currentBlocksArray[currentBlocksArray.length - 1];

    if(currentBlocksArray.length === 0) {
        return null;
    }else {
        return lastBlock;
    }
}

/**
 * Creation d'un block depuis le contenu json
 * @param contenu
 * @return {Promise<Block[]>}
 */
export async function createBlock(contenu) {

    const lastBlock = await findLastBlock();
    let block;

    console.log("LAST BLOCK : ", lastBlock);
    console.log("CONTENU : ", contenu);

    if (lastBlock == null) {
        block = {
            "id": uuidv4(),
            "hash": createHash('sha256').update(monSecret).digest('hex'), // On utilise le secret comme premier hash
            "date": getDate(),
            "nom": contenu.nom,
            "don": contenu.don,
        };
    } else {
        // On convertit le dernier block en string pour l'utiliser comme hash
        const lastBlockString = JSON.stringify(lastBlock);
        block = {
            "id": uuidv4(),
            "hash": createHash("sha256").update(lastBlockString).digest("hex"),
            "date": getDate(),
            "nom": contenu.nom,
            "don": contenu.don,
        };
    }

    const currentBlocks = await findBlocks();
    const currentBlocksJSON = JSON.parse(currentBlocks);
    const blocksAdded =   [...currentBlocksJSON, block]
    writeFile(path, JSON.stringify(blocksAdded));
    return block;
}


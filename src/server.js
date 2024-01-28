
import {createServer} from "node:http"
import {create, liste} from "./blockchain.js";
import {NotFoundError} from "./errors.js";

createServer(async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const url = new URL(req.url, `http://${req.headers.host}`)
        const endpoint = `${req.method}:${url.pathname}`

        let results

        try {
            switch (endpoint) {
                case 'GET:/blockchain':
                    results = await liste(req, res, url)
                    console.log(`\x1b[32m Resultat du GET : ${results}`)
                    break
                case 'POST:/blockchain':
                    results = await create(req, res)
                    console.log(`\x1b[35m Resultat du POST : ${results}`)
                    break
                default :
                    res.writeHead(404)
            }
            if (results) {
                console.log("RESULTS : ", results)
                res.write(JSON.stringify(results))
            }
        } catch (erreur) {
            if (erreur instanceof NotFoundError) {
                res.writeHead(404)
            } else {
                throw erreur
            }
        }
        res.end()
    }
).listen(3000)

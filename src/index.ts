import express, { Request } from "express";
import dotenv from "dotenv/config";
import sequelize, { DataTypes , Sequelize} from "sequelize";
import cors from 'cors';
import bodyParser from "body-parser"

const app = express();
app.use(cors());
app.use(bodyParser.json());

const myport = process.env.PORT ? parseInt(process.env.PORT as string) : 3030;



const mySequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db.sqlite",
});

//Pour tester la connection 
async function connexionTest() {
    try {
        await mySequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    }

//connexionTest();

//Creation du model
const maRecette = mySequelize.define('Recette', {
   
    nameRecette:{
        type : DataTypes.STRING,
        allowNull:false
   },
    lienImageRecette:{
        type : DataTypes.STRING,
        allowNull : false
    }
    ,
    dureeRecette:{
        type : DataTypes.INTEGER,
        allowNull : false
    }
    ,
    noteRecette:{
        type : DataTypes.NUMBER,
        allowNull : false
    }
});
//Verifier la correspondance du model est de la table 
console.log(maRecette  === mySequelize.models.Recette);

//This creates the table
//maRecette.sync({ force: true});
maRecette.sync();

interface IMaRequetBody {
    id:number,
    name: string,
    lienImage : string,
    duree : number,
    note : number,

  }

app.get("/hello", async (_, res) => {    
    
    //res.send renvoi du text    
    res.send("Hello");   
});

//create a recette
app.post("/recettes", async (req, res) => {  
    const nameRecette = req.body.name;
    const lienImageRecette = req.body.lienImage;
    const dureeRecette = req.body.duree;
    const noteRecette = req.body.note;

    const creerMaRecette = await maRecette.create({nameRecette, lienImageRecette, dureeRecette , noteRecette })     
    res.json(creerMaRecette);   
});

//Get a list of recettes
app.get("/recettes", async (_, res) => {   
    const mesRecettes =  await maRecette.findAll();     
    res.json(mesRecettes);   
});

//Get a specific recette
app.get("/recettes/:id", async (req, res) => {   
    const idRecette = req.params.id;
    const mesRecettes =  await maRecette.findAll({
        where: {
          id: idRecette
        }
      });     
    res.json(mesRecettes);   
});

//Delete a recette
app.delete("/recettes/:id", async (req, res) => {   
    const idRecette = req.params.id;
    const mesRecettes =  await maRecette.destroy({
        where: {
          id: idRecette
        }
      });     
    res.json(mesRecettes);   
});

//Update a recette
app.put("/recettes/:id", async (req : Request<IMaRequetBody>, res) => {   
    const idRecette = req.params.id;
    const nameRecette = req.body.name;
    const lienImageRecette = req.body.lienImage;
    const dureeRecette = req.body.duree;
    const noteRecette = req.body.note;
    const mesRecettes =  await maRecette.update({ nameRecette: nameRecette, lienImageRecette : lienImageRecette, dureeRecette : dureeRecette, noteRecette : noteRecette }, {
        where: {
          id: idRecette,
        },
      });     
    res.json(mesRecettes);   
});

app.listen( myport, () =>
  console.log(`Server is listening on port ${myport}`)
);
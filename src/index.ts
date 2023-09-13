import express from "express";
import dotenv from "dotenv/config";
import sequelize, { DataTypes , Sequelize} from "sequelize";

const app = express();
//dotenv.config();

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
        type : DataTypes.STRING,
        allowNull : false
    }
    ,
    noteRecette:{
        type : DataTypes.STRING,
        allowNull : false
    }
});
//Verifier la correspondance du model est de la table 
console.log(maRecette  === mySequelize.models.Recette);

//This creates the table
// maRecette.sync({ force: true});
maRecette.sync();



app.get("/hello", async (_, res) => {        
    res.send("Hello");   
});

app.get("/add/:name/:lienImage/:duree/:note", async (req, res) => {  
    console.log('tptp')
    const nameRecette = req.params.name;
    const lienImageRecette = req.params.lienImage;
    const dureeRecette = req.params.duree;
    const noteRecette = req.params.note;
    const creerMaRecette = await maRecette.create({nameRecette, lienImageRecette, dureeRecette , noteRecette })     
    res.send(creerMaRecette);   
});

app.get("/findAll", async (_, res) => {   
    const mesRecettes =  await maRecette.findAll();     
    res.send(mesRecettes);   
});

app.listen( myport, () =>
  console.log(`Server is listening on port ${myport}`)
);
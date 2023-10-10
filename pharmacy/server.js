    const express = require('express');
    const path = require('path');
    const bodyParser = require('body-parser');

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'Public')));
     app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    const { log } = require('console');

    const  MongoClient  = require('mongodb').MongoClient;
    const uri = "mongodb://localhost:27017/Pharmacy";
    const client = new MongoClient(uri);


    const collectionNames = ["Pharmacy A", "Pharmacy B", "Pharmacy C", "Pharmacy D"];
    let searchValue = "";
    
    app.post("/submit",async (req,res)=>{
        searchValue=req.body.inputMedicine
         console.log(searchValue);
         searchValueInCollections();
         res.redirect("/index2.html")
    })

    async function searchValueInCollections() {
        console.log("in search");
        try {
            await client.connect();
            console.log("Connected to MongoDB");

            const db = client.db();

            for (const collectionName of collectionNames) {
                const collection = db.collection(collectionName);
                
                
                const columns = ["Medicine Name", "Price (INR)", "Use", "Quantity","Latitude","Longitude"];

                for (const column of columns) {
                    const query = {};
                    query[column] = searchValue;

                    const document = await collection.findOne(query);
                    
                       
                    if (document) {
                        console.log(`Found in collection: ${collectionName}, column: ${column}`);
                        
                        //console.log(`Quantity: ${document.Quantity}, Price: ${document.Price (INR) }`)
                        
                    }
                    
                }
                

            }
            
           
        } catch (err) {
            console.error("Error connecting to MongoDB", err);
        } finally {
            client.close();
        }
    }

    

   
import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());  

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async (req, res) => {
    // Extract the image_url query parameter from the request
    const { image_url } = req.query;

    // 1. validate the image_url query
    if (!image_url) {
      return res.status(400).send("image_url parameter is required");
  }

  try {
      // 2. call filterImageFromURL(image_url) to filter the image
      const filteredImagePath = await filterImageFromURL(image_url);

      //3. send the resulting file in the response
      res.sendFile(filteredImagePath, (err) => {
        // Callback function to handle the response finish event
        if (err) {
          console.error("Error sending file:", err);
        } else {
          // 4. deletes any files on the server on finish of the response
          deleteLocalFiles([filteredImagePath]);
          console.log("Local files deleted.");
        }
      });
  } catch (error) {
      // Handle errors during image filtering
      res.status(500).send("Error filtering image");
  }
});
//! END @TODO1


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
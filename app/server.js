const express = require('express');
const urlMetadata = require('url-metadata');
const helmet = require('helmet');

const app = express();
app.use(express.json());
app.use(helmet());


app.post('/fetch-metadata', async (req, res) => {
  const { urls } = req.body;
  
  if (urls.length === 0) {
    return res.status(400).json({ error: 'Invalid input, please provide an array of URLs.' });
  }

  const metadataPromises = urls.map(url => 
    urlMetadata(url)
      .then(metadata => ({
        url,
        title: metadata.title,
        description: metadata.description,
        image: metadata.image
      }))
      .catch(err => ({ url, error: `Failed to fetch metadata: ${err.message}` }))
  );


 try {
    const metadataResults = await Promise.all(metadataPromises);
    res.json(metadataResults);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching metadata.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

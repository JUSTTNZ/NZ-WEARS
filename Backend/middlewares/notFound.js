const notFound = (req, res) => {
    const errorText = "Check the for the specific API method you are calling and make sure you are sending valid and complete parameters. You may also need to check the encoding, format, or size of your request data. Try to update the resource again and ensure no other requests are trying to update it."
    const html = `<div style="
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    margin: 30px auto;
    max-width: 60%;
    min-height: fit-content;
    border: 1px solid black;
    padding: 8px 16px;
    text-align: justify;
    border-radius: 5px;
     ">
    <h2>PAGE NOT FOUND </h2>
      <p>${errorText}</p>
      <a href="/" style="
      text-decoration: none;
      text-transform: lowercase;
      ">BACK HOME </a>
    </div>`

    res.status(404).send(html);
}

module.exports = notFound;